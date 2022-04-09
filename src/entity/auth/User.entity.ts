import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { RefreshToken } from './RefreshToken.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.token)
  refreshToken: RefreshToken['token'];
  @Column({ default: false })
  isActivated: boolean;
  @Column()
  activationLink: string;
}
