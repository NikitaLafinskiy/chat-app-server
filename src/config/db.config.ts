import { DataSource } from "typeorm";
import { User, RefreshToken, Conversation, Message } from "../entity";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: [User, RefreshToken, Conversation, Message],
  subscribers: [],
  migrations: [],
  ssl: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
