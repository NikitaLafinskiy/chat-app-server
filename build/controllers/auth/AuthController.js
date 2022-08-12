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
exports.AuthController = void 0;
const AuthService_1 = require("../../services/auth/AuthService");
const validators_1 = require("../../validators");
const ApiError_1 = require("../../exceptions/ApiError");
const TokenService_1 = require("../../services/token/TokenService");
class AuthController {
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const isValid = yield validators_1.AuthValidators.registerValidator.validate({
                    username,
                    password,
                });
                if (!isValid) {
                    throw ApiError_1.ApiError.BadRequestError("Invalid username or password", isValid);
                }
                const { refreshUUID, accessUUID } = yield AuthService_1.AuthService.register(username, password);
                res.json({ refreshUUID, accessUUID });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const isValid = yield validators_1.AuthValidators.registerValidator.validate({
                    username,
                    password,
                });
                if (!isValid) {
                    throw ApiError_1.ApiError.BadRequestError("Invalid username or password", isValid);
                }
                const { refreshUUID, accessUUID, user } = yield AuthService_1.AuthService.login(username, password);
                res.json({ refreshUUID, accessUUID, user });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token: refreshUUID } = TokenService_1.TokenService.extractTokenFromHeaders(req, "Refresh");
                const { msg } = yield AuthService_1.AuthService.logout(refreshUUID);
                res.clearCookie("refreshToken");
                res.json({ msg });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token: refreshID } = TokenService_1.TokenService.extractTokenFromHeaders(req, "Refresh");
                if (!refreshID) {
                    throw ApiError_1.ApiError.UnauthorizedError("No token cookie is present");
                }
                const { accessUUID, refreshUUID, user } = yield AuthService_1.AuthService.refresh(refreshID);
                res.json({ accessUUID, refreshUUID, user });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token: accessUUID } = TokenService_1.TokenService.extractTokenFromHeaders(req, "Bearer");
                const { user } = yield AuthService_1.AuthService.getUser(accessUUID);
                res.json({ user });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthController = AuthController;
