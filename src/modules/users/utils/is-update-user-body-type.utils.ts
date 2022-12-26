import { UpdateUserBody, UpdateUserData } from '../types';

export const isUpdateUserBodyType = (userData: UpdateUserData): userData is UpdateUserBody => {
  return (userData as UpdateUserBody).nativeLanguageId !== undefined;
};
