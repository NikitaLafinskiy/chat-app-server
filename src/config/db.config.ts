import { DataSource } from "typeorm";
import { User, RefreshToken, Conversation, Message } from "../entity";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRESQL_HOST || "localhost",
  port: 5432,
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DB_NAME,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: [User, RefreshToken, Conversation, Message],
  subscribers: [],
  migrations: [],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
