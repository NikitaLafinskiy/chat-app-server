import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { RefreshToken, Conversation } from "../index";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.token)
  refreshToken: RefreshToken["token"];
  @Column({ default: false })
  isActivated: boolean;
  @Column()
  activationLink: string;
  @ManyToMany(() => Conversation, (conversation) => conversation.members)
  @JoinTable({ name: "userConversations" })
  conversations: Conversation[];
}
