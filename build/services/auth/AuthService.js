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
exports.AuthService = void 0;
const entity_1 = require("../../entity");
const uuid_1 = require("uuid");
const User_dto_1 = require("../../dtos/User.dto");
const bcrypt_1 = require("bcrypt");
const TokenService_1 = require("../token/TokenService");
const ApiError_1 = require("../../exceptions/ApiError");
const jsonwebtoken_1 = require("jsonwebtoken");
const redis_config_1 = require("../../config/redis.config");
class AuthService {
    static register(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield entity_1.User.findOneBy({ username });
            if (checkUser) {
                throw ApiError_1.ApiError.UnauthorizedError(`User ${username} already exists`);
            }
            const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
            const activationLink = (0, uuid_1.v4)();
            const user = yield entity_1.User.create({
                username,
                password: hashedPassword,
                activationLink,
            }).save();
            const userDTO = __rest(new User_dto_1.UserDTO(user), []);
            const { refreshToken, accessToken } = TokenService_1.TokenService.generateTokens(userDTO);
            const { refreshUUID, accessUUID } = yield TokenService_1.TokenService.saveRefreshToken(refreshToken, accessToken);
            return { refreshUUID, accessUUID, user: userDTO };
        });
    }
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.User.findOneBy({ username });
            if (!user) {
                throw ApiError_1.ApiError.BadRequestError("User was not found");
            }
            const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
            if (!isMatch) {
                throw ApiError_1.ApiError.BadRequestError("Password doesn't match");
            }
            const userDTO = __rest(new User_dto_1.UserDTO(user), []);
            const { refreshToken, accessToken } = TokenService_1.TokenService.generateTokens(userDTO);
            const { refreshUUID, accessUUID } = yield TokenService_1.TokenService.saveRefreshToken(refreshToken, accessToken);
            return { refreshUUID, accessUUID, user: userDTO };
        });
    }
    static logout(refreshUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { msg } = yield TokenService_1.TokenService.removeRefreshToken(refreshUUID);
            return { msg };
        });
    }
    static refresh(refreshID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessUUID, refreshUUID, user } = yield TokenService_1.TokenService.updateTokens(refreshID);
            return { accessUUID, refreshUUID, user };
        });
    }
    static getUser(accessUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield redis_config_1.client.get(accessUUID);
            if (!token) {
                throw ApiError_1.ApiError.UnauthorizedError("No access token or id present");
            }
            const userPayload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_ACCESS_TOKEN);
            const user = yield entity_1.User.findOneBy({ id: userPayload.id });
            if (!user) {
                throw ApiError_1.ApiError.UnauthorizedError("No user with such token");
            }
            const userDTO = __rest(new User_dto_1.UserDTO(user), []);
            return { user: userDTO };
        });
    }
}
exports.AuthService = AuthService;
