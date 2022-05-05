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
exports.SearchListeners = void 0;
const SearchService_1 = require("../../../services/socket/SearchService");
class SearchListeners {
    static queryUsers(data, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: currentUser, query } = data;
            const { users } = yield SearchService_1.SearchService.findMatchingUsers(query);
            if (users.length === 0) {
                socket.emit("queryUsersRes", {
                    users: [],
                    error: "Could not find any users with a similar username.",
                });
            }
            const userDTOS = yield SearchService_1.SearchService.queryUsers(currentUser, users);
            socket.emit("queryUsersRes", { users: userDTOS, error: "" });
        });
    }
}
exports.SearchListeners = SearchListeners;
