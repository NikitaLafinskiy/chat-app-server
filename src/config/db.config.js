"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
require("dotenv").config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRESQL_HOST || "localhost",
    port: 5432,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DB_NAME,
    synchronize: false,
    logging: false,
    dropSchema: false,
    entities: [entity_1.User, entity_1.RefreshToken, entity_1.Conversation, entity_1.Message],
    subscribers: [],
    migrations: [],
});
