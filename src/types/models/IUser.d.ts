export interface IUser {
  id: number;
  username: string;
  isActivated: boolean;
  activationLink: string;
  password?: string;
}
