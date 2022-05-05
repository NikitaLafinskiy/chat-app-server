"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMember = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("../index");
let GroupMember = class GroupMember extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GroupMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => index_1.User, (user) => user.id),
    __metadata("design:type", Object)
], GroupMember.prototype, "userID", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => index_1.Conversation, (conversation) => conversation.id),
    __metadata("design:type", Object)
], GroupMember.prototype, "conversationID", void 0);
GroupMember = __decorate([
    (0, typeorm_1.Entity)("group_members")
], GroupMember);
exports.GroupMember = GroupMember;
