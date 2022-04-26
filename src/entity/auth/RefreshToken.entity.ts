import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("refreshToken")
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "text" })
  token: string;
  @OneToOne(() => User, (user) => user.refreshToken, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "userID", referencedColumnName: "id" })
  user: User;
}
