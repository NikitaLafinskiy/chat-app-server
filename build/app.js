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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./tcp/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
const error_middleware_1 = require("./middleware/error.middleware");
const db_config_1 = require("./config/db.config");
const redis_config_1 = require("./config/redis.config");
require("dotenv").config();
const PORT = process.env.PORT || 6969;
const app = (0, express_1.default)();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_config_1.AppDataSource.initialize();
    yield (0, redis_config_1.invokeRedisClient)();
    app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
    (0, routes_1.routesInit)(app);
    app.use(error_middleware_1.errHandler);
    const server = app.listen(PORT, () => {
        console.log("Listening on port " + PORT);
    });
    (0, index_1.initIO)(server);
});
start();
