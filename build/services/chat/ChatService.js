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
exports.ChatService = void 0;
const entity_1 = require("../../entity");
const ApiError_1 = require("../../exceptions/ApiError");
const db_config_1 = require("../../config/db.config");
class ChatService {
    static getConversations(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.User.findOne({
                relations: ["conversations"],
                where: { id: userID },
            });
            if (!user) {
                throw ApiError_1.ApiError.UnauthorizedError(`No user with such id ${userID}`);
            }
            return { conversations: user.conversations };
        });
    }
    static getMessages(conversationID, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const take = 30;
            const skip = 30 * index;
            const messages = (yield db_config_1.AppDataSource.getRepository(entity_1.Message)
                .createQueryBuilder("message")
                .where("message.conversation=:id", { id: conversationID })
                .orderBy("message.id", "DESC")
                .skip(skip)
                .take(take)
                .getMany()).reverse();
            if (!messages) {
                return { messages: [] };
            }
            return { messages };
        });
    }
}
exports.ChatService = ChatService;
