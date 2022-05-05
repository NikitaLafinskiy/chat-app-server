import express from "express";
import cors from "cors";
import { initIO } from "./tcp/index";
import cookieParser from "cookie-parser";
import { routesInit } from "./routes";
import { errHandler } from "./middleware/error.middleware";
import { AppDataSource } from "./config/db.config";

require("dotenv").config();
const PORT = process.env.PORT || 6969;

const app = express();

const start = async () => {
  await AppDataSource.initialize();
  console.log(process.env.POSTGRESQL_DB_NAME);
  console.log(process.env.POSTGRESQL_USERNAME);
  console.log(process.env.POSTGRESQL_PASSWORD);
  console.log(process.env.POSTGRESQL_HOST);
  // app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  routesInit(app);
  app.use(errHandler);

  const server = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
  initIO(server);
};

start();
