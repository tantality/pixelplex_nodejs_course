import { IUser } from '../users/types';

export class AuthDTO implements Pick<IUser, 'refreshToken' | 'id'> {
  public readonly id: number;
  public readonly refreshToken: string;
  public readonly accessToken: string;
  constructor(user: IUser, accessToken: string) {
    this.id = user.id;
    this.refreshToken = user.refreshToken as string;
    this.accessToken = accessToken;
  }
}
