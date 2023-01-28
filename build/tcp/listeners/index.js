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
exports.initSocketListeners = void 0;
const SearchListeners_1 = require("./search/SearchListeners");
const ConversationListeners_1 = require("./conversation/ConversationListeners");
const initSocketListeners = (socket, io) => {
    socket.on("queryUsers", (data) => {
        SearchListeners_1.SearchListeners.queryUsers(data, socket);
    });
    socket.on("createConversation", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield ConversationListeners_1.ConversationListeners.createConversation(data, socket);
        socket.emit("conversationCreated");
    }));
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield ConversationListeners_1.ConversationListeners.sendMessage(data, socket);
    }));
    socket.on("joinUser", (data) => {
        ConversationListeners_1.ConversationListeners.joinUser(data, socket);
    });
};
exports.initSocketListeners = initSocketListeners;
