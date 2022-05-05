"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const errHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.status).json({ msg: err.message, name: err.name });
        return;
    }
    res.status(500).json({ name: "Unknown error", msg: err.message });
};
exports.errHandler = errHandler;
