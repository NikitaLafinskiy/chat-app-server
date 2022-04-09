import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('refreshToken')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'longtext' })
  token: string;
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userID', referencedColumnName: 'id' })
  userID: User['id'];
}
