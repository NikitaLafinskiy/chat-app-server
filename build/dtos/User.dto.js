"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor({ id, username, activationLink, isActivated }) {
        this.id = id;
        this.activationLink = activationLink;
        this.username = username;
        this.isActivated = isActivated;
    }
}
exports.UserDTO = UserDTO;
