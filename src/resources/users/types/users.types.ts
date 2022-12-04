export interface IUser {
  id: number;
  nativeLanguageId: number;
  name: string;
  email: string;
  normalizedEmail: string;
  password: string;
  role: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}
