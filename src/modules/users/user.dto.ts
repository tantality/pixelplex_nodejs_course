import { IUser } from './types';

export class UserDTO implements Pick<IUser, 'id' | 'name' | 'email' | 'nativeLanguageId'> {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly nativeLanguageId: number;
  constructor(user: IUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.nativeLanguageId = user.nativeLanguageId;
  }
}
