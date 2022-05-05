"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, name, message, errors = []) {
        super(message);
        this.status = status;
        this.name = name;
        this.errors = errors;
    }
    static UnauthorizedError(message) {
        return new ApiError(401, 'Unauthorized request', message);
    }
    static BadRequestError(message, errors = []) {
        return new ApiError(400, 'Bad Request', message, errors);
    }
}
exports.ApiError = ApiError;
