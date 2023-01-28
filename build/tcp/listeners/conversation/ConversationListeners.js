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
exports.ConversationListeners = void 0;
const ConversationService_1 = require("../../../services/socket/ConversationService");
const uuid_1 = require("uuid");
class ConversationListeners {
    static joinUser(conversationID, socket) {
        socket.join(conversationID);
    }
    static createConversation(data, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isPrivate, users, currentUser, groupName } = data;
            const id = (0, uuid_1.v4)();
            yield ConversationService_1.ConversationService.createConversation(id, [...users, currentUser], groupName, isPrivate);
            socket.join(id);
        });
    }
    static sendMessage(payload, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, from, conversation } = payload;
            const { newMessage } = yield ConversationService_1.ConversationService.createMessage(body, from, conversation);
            socket.to(payload.conversation.id).emit("sendMessage", newMessage);
        });
    }
}
exports.ConversationListeners = ConversationListeners;
