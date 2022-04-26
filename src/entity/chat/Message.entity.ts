import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Conversation } from "../index";

@Entity("messages")
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @Column()
  from: number;
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversation", referencedColumnName: "id" })
  conversation: Conversation;
}
