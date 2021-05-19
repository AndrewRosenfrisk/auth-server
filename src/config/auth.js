const nodeEnv = process.env.NODE_ENV;

const oneWeekInHours = 168 * 60 * 60;
const oneYearInHours = 8760 * 60 * 60;

const hoursToSeconds = (hours) => hours * 60 * 60;

module.exports = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    validity: nodeEnv === "development" ? "30d" : "5m",
  },
};
