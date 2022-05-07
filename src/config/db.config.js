"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
require("dotenv").config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.PGHOST || "localhost",
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: false,
    logging: true,
    dropSchema: false,
    entities: [entity_1.User, entity_1.RefreshToken, entity_1.Conversation, entity_1.Message],
    subscribers: [],
    migrations: [],
    ssl: process.env.PGHOST ? true : false,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
