const express = require("express");
const cors = require("cors");
const currentWeather = require("./api/currentWeather");
const userRouter = require("./api/user");
const CropInputRouter = require("./api/CropInput");
const recommendation = require("./api/recommendation.js");
const { connectToMongoDB } = require("./connect");

require("dotenv").config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const parsedCorsOrigins = corsOrigin
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
const allowVercelPreviewOrigins =
  process.env.CORS_ALLOW_VERCEL_PREVIEWS !== "false";

const normalizeOrigin = (value) => value.replace(/\/+$/, "");
const allowedOrigins = parsedCorsOrigins.map(normalizeOrigin);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (corsOrigin === "*" || allowedOrigins.length === 0) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalizedOrigin)) return true;

  if (allowVercelPreviewOrigins && /^https:\/\/.*\.vercel\.app$/i.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/cropInput", CropInputRouter);
app.use("/api/weather", currentWeather);
app.use("/api/recommendation", recommendation);

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "crop-advisory-backend" });
});

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cropAdvisorySystem";

let dbConnectPromise;
const ensureDatabase = () => {
  if (!dbConnectPromise) {
    dbConnectPromise = connectToMongoDB(MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB successfully");
      })
      .catch((err) => {
        dbConnectPromise = undefined;
        console.log("Error connecting to MongoDB:", err);
        throw err;
      });
  }
  return dbConnectPromise;
};

ensureDatabase().catch(() => {});

module.exports = { app, ensureDatabase };

