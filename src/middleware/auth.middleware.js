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
const ApiError_1 = require("../exceptions/ApiError");
const TokenService_1 = require("../services/token/TokenService");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw ApiError_1.ApiError.UnauthorizedError("The auth header isn't present on the request");
        }
        const token = authHeader.split(" ")[1];
        const { isValid } = TokenService_1.TokenService.validateAccessToken(token);
        if (!isValid) {
            throw ApiError_1.ApiError.UnauthorizedError("The token is invalid");
        }
        next();
    }
    catch (err) {
        next(ApiError_1.ApiError.UnauthorizedError("Token is invalid"));
    }
});
exports.authHandler = authHandler;
