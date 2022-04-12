import express from "express";
import { DataSource } from "typeorm";
import cors from "cors";
import { initIO } from "./tcp/index";
import cookieParser from "cookie-parser";
import {
  User,
  RefreshToken,
  Conversation,
  Message,
  GroupMember,
} from "./entity";
import { routesInit } from "./routes";
import { errHandler } from "./middleware/error.middleware";

require("dotenv").config();
const PORT = process.env.PORT || 6969;

const app = express();

const start = async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DB_NAME,
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User, RefreshToken, Conversation, Message],
    subscribers: [],
    migrations: [],
  });

  await AppDataSource.initialize();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
