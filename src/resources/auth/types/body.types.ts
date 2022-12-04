import { IUser } from '../../users/user.interface';

export type LogInBody = Pick<IUser, 'email' | 'password'>;
export type SignUpBody = LogInBody & { nativeLanguageId: number; name: string };
