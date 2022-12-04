import { IUser } from './user.interface';

let userCounter = 1;

export class User implements IUser {
  id: number;

  constructor(
    public readonly nativeLanguageId: number,
    public readonly name: string,
    public readonly email: string,
    public readonly normalizedEmail: string,
    public readonly password: string,
    public readonly role: string,
    public readonly refreshToken: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = userCounter;
    userCounter += 1;
  }
}
