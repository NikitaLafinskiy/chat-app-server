import { DataSource, DataSourceOptions } from "typeorm";
import { User, RefreshToken, Conversation, Message } from "../entity";
require("dotenv").config();

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [User, RefreshToken, Conversation, Message],
  subscribers: [],
  migrations: ["./migrations/*.js"],
};

const dbOptions: DataSourceOptions =
  process.env.NODE_ENV === "production"
    ? {
        ...options,
        ssl: process.env.PGHOST ? true : false,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : { ...options };

export const AppDataSource = new DataSource(dbOptions);
