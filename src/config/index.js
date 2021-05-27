require('dotenv').config();
const app = require('./app');
const db = require('./db');
const auth = require('./auth');

module.exports = {
  app,
  db,
  auth,
};
