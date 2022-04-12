import {
  PrimaryColumn,
  Column,
  Entity,
  BaseEntity,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { User, Message } from "../index";

@Entity("conversations")
export class Conversation extends BaseEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string;
  @Column()
  name: string;
  @Column()
  isPrivate: boolean;
  @ManyToMany(() => User, (users) => users.conversations)
  members: User[];
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
