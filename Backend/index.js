const { app, ensureDatabase } = require("./app");

const PORT = process.env.PORT || 5002;

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
