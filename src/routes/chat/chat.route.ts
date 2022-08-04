import express, { Request, Response } from "express";
import { ChatController } from "../../controllers/chat/ChatController";

const router = express.Router();

router.get("/api/chat/conversations/:userID", ChatController.getConversations);
router.post("/api/chat/messages/:index", ChatController.getMessages);
router.get("/", (req: Request, res: Response) => {
  res.send("Welcome");
});

export default router;
