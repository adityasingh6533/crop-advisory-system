const { app, ensureDatabase } = require("../app");

module.exports = async (req, res) => {
  await ensureDatabase();
  return app(req, res);
};
