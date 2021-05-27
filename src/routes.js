const authRoutes = require('./auth/api');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).json({
      error: false,
      message: 'Hello Auth-Server!',
    });
  });

  app.use('/', authRoutes);
};
