const argon = require("argon2");
const config = require("../../config");

module.exports = class AuthService {
  constructor(User) {
    this.User = User;
  }

  // POST /REGISTER
  async register(params) {
    if (await this.User.findOne({ email: params.email })) {
      const err = new Error("Invalid login").status(400); //Email already exists
      throw err;
    } else {
      const user = await this.User.create({
        name: params.name,
        email: params.email,
        password: await argon.hash(params.password, {
          hashLength: 32, //default = 32
          timeCost: 3, //default = 3
          memoryCost: 1 << 16, //default = 1 << 12 KiB
          parallelism: 1, //default = 1
          type: argon.argon2id, //default = argon2i
          associatedData: Buffer.from(config.auth.accessToken.secret),
        }),
      });
      return {
        name: user.name,
        email: user.email,
      };
    }
  }
};
