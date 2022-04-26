import express from "express";
import { ChatController } from "../../controllers/chat/ChatController";

const router = express.Router();

router.get("/api/chat/conversations/:userID", ChatController.getConversations);
router.post("/api/chat/messages", ChatController.getMessages);

export default router;
