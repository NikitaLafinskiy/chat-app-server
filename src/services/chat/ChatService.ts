import { Conversation, User, Message } from "../../entity";
import { ApiError } from "../../exceptions/ApiError";
import { AppDataSource } from "../../config/db.config";

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
    conversationID: string,
    index: number
  ): Promise<{ messages: Message[] }> {
    const take = 30;
    const skip = 30 * index;

    const messages = (
      await AppDataSource.getRepository(Message)
        .createQueryBuilder("message")
        .where("message.conversation=:id", { id: conversationID })
        .orderBy("message.id", "DESC")
        .skip(skip)
        .take(take)
        .getMany()
    ).reverse();

    if (!messages) {
      return { messages: [] };
    }

    return { messages };
  }
}
