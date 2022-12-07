import { IUser } from '../../users/types';

export type LogInBody = Pick<IUser, 'email' | 'password'>;
export type SignUpBody = LogInBody & { nativeLanguageId: number; name: string };
