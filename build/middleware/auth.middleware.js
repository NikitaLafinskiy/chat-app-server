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
exports.authHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_config_1 = require("../config/redis.config");
const ApiError_1 = require("../exceptions/ApiError");
const TokenService_1 = require("../services/token/TokenService");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token: accessUUID } = TokenService_1.TokenService.extractTokenFromHeaders(req, "Bearer");
        const accessToken = yield redis_config_1.client.get(accessUUID);
        if (!accessToken) {
            res.redirect("/api/auth/refresh");
            return;
        }
        (0, jsonwebtoken_1.verify)(accessToken, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                res.redirect("/api/auth/refresh");
                return;
            }
            if (decoded) {
                next();
            }
        });
    }
    catch (err) {
        next(ApiError_1.ApiError.UnauthorizedError("Token is invalid"));
    }
});
exports.authHandler = authHandler;
