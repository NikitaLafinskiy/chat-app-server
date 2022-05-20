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
                const { refreshToken, accessToken } = yield AuthService_1.AuthService.register(username, password);
                res.cookie("refreshToken", refreshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV !== "development",
                });
                res.json({ refreshToken, accessToken });
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
                const { refreshToken, accessToken } = yield AuthService_1.AuthService.login(username, password);
                res.cookie("refreshToken", refreshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV !== "development",
                });
                res.json({ refreshToken, accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const { msg } = yield AuthService_1.AuthService.logout(refreshToken);
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
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    throw ApiError_1.ApiError.UnauthorizedError("No token cookie is present");
                }
                const { accessToken } = yield AuthService_1.AuthService.refresh(refreshToken);
                res.json({ accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(" ")[1];
                const { user } = yield AuthService_1.AuthService.getUser(token);
                res.json({ user });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthController = AuthController;
