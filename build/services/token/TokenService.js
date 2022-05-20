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
const entity_1 = require("../../entity");
const ApiError_1 = require("../../exceptions/ApiError");
const entity_2 = require("../../entity");
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
    static saveRefreshToken(user, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield entity_1.RefreshToken.findOne({
                where: { user: { id: user.id } },
            });
            if (refreshToken) {
                refreshToken.token = token;
                refreshToken.save();
                return { refreshToken };
            }
            const newToken = yield entity_1.RefreshToken.create({ token, user }).save();
            return { refreshToken: newToken };
        });
    }
    static validateRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield entity_1.RefreshToken.findOneBy({ token });
            if (!refreshToken) {
                throw ApiError_1.ApiError.UnauthorizedError("Refresh token doesn't exist (user is not registered)");
            }
            const isValidToken = (0, jsonwebtoken_1.verify)(token, process.env.JWT_REFRESH_SECRET);
            if (!isValidToken) {
                throw ApiError_1.ApiError.UnauthorizedError("Refresh token has expired");
            }
            return { isValid: true, refreshToken };
        });
    }
    static validateAccessToken(token) {
        try {
            const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_ACCESS_TOKEN);
            return { payload, isValid: true };
        }
        catch (err) {
            return { payload: "", isValid: false };
        }
    }
    static updateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = yield this.validateRefreshToken(token);
            const user = yield entity_2.User.findOneBy({ id: refreshToken.user.id });
            const userDTO = __rest(new User_dto_1.UserDTO(user), []);
            const { accessToken } = this.generateTokens(userDTO);
            return { accessToken };
        });
    }
}
exports.TokenService = TokenService;
