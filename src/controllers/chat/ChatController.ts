import { Request, Response, NextFunction } from "express";
import { ChatService } from "../../services/chat/ChatService";

export class ChatController {
  static async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userID } = req.params;
      const { conversations } = await ChatService.getConversations(
        parseInt(userID)
      );

      res.json({ conversations });
    } catch (err) {
      next(err);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationID } = req.body;

      const { messages } = await ChatService.getMessages(conversationID);

      res.json({ messages });
    } catch (err) {
      next(err);
    }
  }
}
