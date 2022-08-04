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
exports.ChatController = void 0;
const ChatService_1 = require("../../services/chat/ChatService");
class ChatController {
    static getConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID } = req.params;
                const { conversations } = yield ChatService_1.ChatService.getConversations(parseInt(userID));
                res.json({ conversations });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { conversationID } = req.body;
                const { index } = req.params;
                const { messages } = yield ChatService_1.ChatService.getMessages(conversationID, parseInt(index));
                res.json({ messages });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.ChatController = ChatController;
