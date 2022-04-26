import { Conversation, User, Message } from "../../entity";
import { ApiError } from "../../exceptions/ApiError";

export class ChatService {
  static async getConversations(
    userID: number
  ): Promise<{ conversations: Conversation[] }> {
    const user = await User.findOne({
      relations: ["conversations"],
      where: { id: userID },
    });

    if (!user) {
      throw ApiError.UnauthorizedError(`No user with such id ${userID}`);
    }

    return { conversations: user.conversations };
  }

  static async getMessages(
    conversationID: string
  ): Promise<{ messages: Message[] }> {
    const conversation = await Conversation.findOne({
      relations: ["messages"],
      where: { id: conversationID },
    });

    if (!conversation) {
      return { messages: [] };
    }

    return { messages: conversation.messages };
  }
}
