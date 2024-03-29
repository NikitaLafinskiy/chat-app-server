"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeRedisClient = exports.client = void 0;
const redis_1 = require("redis");
const redisOptions = process.env.NODE_ENV === "production"
    ? { url: process.env.REDIS_URL, disableOfflineQueue: true }
    : {
        socket: {
            port: parseInt(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
        },
    };
const invokeRedisClient = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.client = (0, redis_1.createClient)(redisOptions);
    exports.client.on("error", (err) => {
        console.error(err);
    });
    yield exports.client.connect();
});
exports.invokeRedisClient = invokeRedisClient;
