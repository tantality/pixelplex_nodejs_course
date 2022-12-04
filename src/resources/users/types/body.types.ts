import { IUser } from '../user.interface';

export type UpdateUserBody = Pick<IUser, 'nativeLanguageId'>;
