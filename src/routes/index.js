"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesInit = void 0;
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const chat_route_1 = __importDefault(require("./chat/chat.route"));
const routesInit = (app) => {
    app.use(auth_route_1.default);
    app.use(chat_route_1.default);
};
exports.routesInit = routesInit;
