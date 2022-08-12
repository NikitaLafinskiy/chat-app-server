"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
const redisOptions = process.env.NODE_ENV === "production"
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
            port: parseInt(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
        },
    };
exports.client = (0, redis_1.createClient)(redisOptions);
