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
