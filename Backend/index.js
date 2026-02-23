const { app, ensureDatabase } = require("./app");

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

ensureDatabase().catch((err) => {
  console.error("Database connection failed at startup:", err?.message || err);
});
