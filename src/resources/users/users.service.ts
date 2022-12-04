/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { UpdateUserRequest } from './types';
import { UserDTO } from './user.dto';
import { USER_DTO } from './users.constants';

export class UsersService {
  static findById = async (req: Request): Promise<UserDTO | null> => {
    logRequest(req);
    return USER_DTO;
  };

  static update = async (req: UpdateUserRequest): Promise<UserDTO | null> => {
    logRequest(req);
    return USER_DTO;
  };
}
