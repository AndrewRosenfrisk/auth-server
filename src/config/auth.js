const nodeEnv = process.env.NODE_ENV;

const hoursPerWeek = 7 * 24;
const hoursPerYear = 365 * 24;

const hoursToSeconds = (hours) => hours * 60 * 60;

module.exports = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    validity: nodeEnv === 'development' ? '30d' : '5m',
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    validity: nodeEnv === 'development' ? '365d' : '7d',
    cookie: {
      secret: process.env.COOKIE_SECRET,
      options: {
        httpOnly: true,
        sameSite: nodeEnv === 'production' ? 'Strict' : 'None',
        domain: process.env.HOST,
        secure: nodeEnv !== 'development',
        maxAge:
          nodeEnv === 'development' ? hoursToSeconds(hoursPerYear) : hoursToSeconds(hoursPerWeek),
      },
    },
  },
};
