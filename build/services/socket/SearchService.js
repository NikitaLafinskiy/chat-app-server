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
exports.SearchService = void 0;
const User_dto_1 = require("../../dtos/User.dto");
const entity_1 = require("../../entity");
const db_config_1 = require("../../config/db.config");
class SearchService {
    static queryUsers(currentUser, users) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedUsers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                const conversationDoesExist = (yield entity_1.Conversation.findOneBy({
                    name: `pm__${currentUser.username}__${user.username}`,
                })) ||
                    (yield entity_1.Conversation.findOneBy({
                        name: `pm__${user.username}__${currentUser.username}`,
                    }));
                if (conversationDoesExist) {
                    return null;
                }
                return new User_dto_1.UserDTO(user);
            })));
            return mappedUsers.filter((user) => user !== null && user.username !== currentUser.username);
        });
    }
    static findMatchingUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.length === 0) {
                return { users: [] };
            }
            const users = yield db_config_1.AppDataSource.getRepository(entity_1.User)
                .createQueryBuilder("user")
                .where("user.username like :username", { username: `${query}%` })
                .getMany();
            console.log(users);
            return { users };
        });
    }
}
exports.SearchService = SearchService;
