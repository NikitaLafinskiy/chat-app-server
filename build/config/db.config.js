"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
require("dotenv").config();
const options = {
    type: "postgres",
    host: process.env.PGHOST || "localhost",
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: true,
    logging: false,
    dropSchema: false,
    entities: [entity_1.User, entity_1.RefreshToken, entity_1.Conversation, entity_1.Message],
    subscribers: [],
    migrations: ["./migrations/*.js"],
};
const dbOptions = process.env.NODE_ENV === "production"
    ? Object.assign(Object.assign({}, options), { ssl: process.env.PGHOST ? true : false, extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        } }) : Object.assign({}, options);
exports.AppDataSource = new typeorm_1.DataSource(dbOptions);
