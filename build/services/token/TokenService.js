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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiError_1 = require("../../exceptions/ApiError");
const uuid_1 = require("uuid");
const redis_config_1 = require("../../config/redis.config");
const entity_1 = require("../../entity");
const User_dto_1 = require("../../dtos/User.dto");
class TokenService {
    static generateTokens(user) {
        const refreshToken = (0, jsonwebtoken_1.sign)(user, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });
        const accessToken = (0, jsonwebtoken_1.sign)(user, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        return { accessToken, refreshToken };
    }
    static saveRefreshToken(refreshToken, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshUUID = (0, uuid_1.v4)();
            const accessUUID = (0, uuid_1.v4)();
            yield redis_config_1.client.set(refreshUUID, refreshToken);
            yield redis_config_1.client.set(accessUUID, accessToken);
            return { refreshUUID, accessUUID };
        });
    }
    static removeRefreshToken(refreshUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_config_1.client.del(refreshUUID);
            return { msg: "Logged out successfully" };
        });
    }
    static updateTokens(refreshID) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDB = yield redis_config_1.client.get(refreshID);
            if (!refreshTokenDB) {
                throw ApiError_1.ApiError.UnauthorizedError("Session expired please log in again");
            }
            const rtPayload = (0, jsonwebtoken_1.verify)(refreshTokenDB, process.env.JWT_REFRESH_SECRET);
            const user = yield entity_1.User.findOneBy({ id: rtPayload.id });
            const userDTO = __rest(new User_dto_1.UserDTO(user), []);
            if (!rtPayload) {
                throw ApiError_1.ApiError.UnauthorizedError("Session expired please log in again");
            }
            const { refreshToken, accessToken } = this.generateTokens(userDTO);
            const { refreshUUID, accessUUID } = yield this.saveRefreshToken(refreshToken, accessToken);
            return { refreshUUID, accessUUID, user: userDTO };
        });
    }
    static extractTokenFromHeaders(req, keyword) {
        const headers = req.headers.authorization;
        if (!headers) {
            throw ApiError_1.ApiError.BadRequestError("No authorization headers found on the request");
        }
        const token = headers.split(`${keyword} `)[1].split(",")[0];
        return { token };
    }
}
exports.TokenService = TokenService;
