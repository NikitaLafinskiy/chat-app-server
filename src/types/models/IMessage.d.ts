import { IConversation } from "./IConversation";
import { IUser } from "./IUser";

export interface IMessagePayload {
  from: IUser;
  conversation: IConversation;
  body: string;
  file?: File;
}

export interface IMessage {
  id: number;
  body: string;
  from: number;
  conversation: IConversation;
}
