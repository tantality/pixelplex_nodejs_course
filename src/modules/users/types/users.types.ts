import { UpdateUserBody } from './body.types';

export interface IUser {
  id: number;
  nativeLanguageId: number | null;
  name: string;
  email: string;
  normalizedEmail: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export type CreateUserData = Pick<IUser, 'name' | 'email' | 'normalizedEmail' | 'password'> & { nativeLanguageId: number };
