import { Entity, BaseEntity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation, User } from "../index";

@Entity("group_members")
export class GroupMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user) => user.id)
  userID: User["id"];
  @OneToOne(() => Conversation, (conversation) => conversation.id)
  conversationID: Conversation["id"];
}
