"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = require("../../controllers/chat/ChatController");
const router = express_1.default.Router();
router.get("/api/chat/conversations/:userID", ChatController_1.ChatController.getConversations);
router.post("/api/chat/messages/:index", ChatController_1.ChatController.getMessages);
exports.default = router;
