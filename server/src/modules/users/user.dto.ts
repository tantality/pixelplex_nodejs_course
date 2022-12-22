import { IUser } from './types';
import { User } from './user.entity';

export class UserDTO implements Pick<IUser, 'id' | 'name' | 'email' | 'nativeLanguageId'> {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly nativeLanguageId: number | null;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.nativeLanguageId = user.nativeLanguageId;
  }
}
