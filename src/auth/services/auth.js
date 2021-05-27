const argon = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = class AuthService {
  constructor(User) {
    this.User = User;
  }

  // POST /REGISTER
  async register(params) {
    if (await this.User.findOne({ email: params.email })) {
      const err = new Error('Invalid login'); //  Email already exists
      err.status = 400;
      throw err;
    } else {
      const user = await this.User.create({
        name: params.name,
        email: params.email,
        password: await argon.hash(params.password, {
          hashLength: 32, //  default = 32
          timeCost: 3, // default = 3
          // eslint-disable-next-line no-bitwise
          memoryCost: 1 << 16, // default = 1 << 12 KiB, bitwise is appropriate in this context
          parallelism: 1, //  default = 1
          type: argon.argon2id, //  default = argon2i
          associatedData: Buffer.from(config.auth.accessToken.secret),
        }),
      });
      return {
        name: user.name,
        email: user.email,
      };
    }
  }

  async login(params) {
    const user = await this.User.findOne({ email: params.email });

    if (!user) {
      const err = new Error('Invalid login'); //  bad email
      err.status = 400;
      throw err;
    } else if (await argon.verify(user.password, params.password)) {
      const tokenPayload = {
        email: user.email,
      };

      const accessToken = jwt.sign(
        tokenPayload,
        config.auth.accessToken.secret,
        {
          expiresIn: config.auth.accessToken.validity,
        },
      );
      const refreshToken = jwt.sign(
        tokenPayload,
        config.auth.refreshToken.secret,
        {
          expiresIn: config.auth.refreshToken.validity,
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    } else {
      const err = new Error('Invalid login'); //  bad password
      err.status = 400;
      throw err;
    }
  }

  static refresh(refreshToken) {
    const user = jwt.verify(refreshToken, config.auth.refreshToken.secret);

    const tokenPayload = {
      email: user.email,
    };

    const accessToken = jwt.sign(tokenPayload, config.auth.accessToken.secret, {
      expiresIn: config.auth.accessToken.validity,
    });

    return { accessToken };
  }
};
