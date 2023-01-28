"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIO = void 0;
const socket_io_1 = require("socket.io");
const listeners_1 = require("./listeners");
const initIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
    });
    io.on("connection", (socket) => {
        (0, listeners_1.initSocketListeners)(socket, io);
    });
};
exports.initIO = initIO;
