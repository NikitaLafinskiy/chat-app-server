import express from 'express';
import { DataSource } from 'typeorm';
import cors from 'cors';
import { initIO } from './tcp/index';
import cookieParser from 'cookie-parser';
import { User, RefreshToken } from './entity';
import { routesInit } from './routes';
import { errHandler } from './middleware/error.middleware';

require('dotenv').config();
const PORT = process.env.PORT || 6969;

const app = express();

const start = async () => {
  const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    synchronize: true,
    logging: true,
    dropSchema: true,
    entities: [User, RefreshToken],
    subscribers: [],
    migrations: [],
  });

  await AppDataSource.initialize();

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(errHandler);
  routesInit(app);

  const server = app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  });
  initIO(server);
};

start();
