import { IUser } from '../types/models/IUser.d';

export class UserDTO {
  id: number;
  username: string;
  activationLink: string;
  isActivated: boolean;

  constructor({ id, username, activationLink, isActivated }: IUser) {
    this.id = id;
    this.activationLink = activationLink;
    this.username = username;
    this.isActivated = isActivated;
  }
}
