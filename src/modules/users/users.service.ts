/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { UpdateUserRequest } from './types';
import { UserDTO } from './user.dto';
import { User } from './user.entity';

const user = new User(1, 'Angelina', 'email@gmail.com', 'email@gmail.com', 'qwerty123', 'user', 'awdwkmkwad243', new Date(), new Date());
const userDTO = new UserDTO(user);

export class UsersService {
  static findById = async (req: Request): Promise<UserDTO | null> => {
    logRequest(req);
    return userDTO;
  };

  static update = async (req: UpdateUserRequest): Promise<UserDTO | null> => {
    logRequest(req);
    return userDTO;
  };
}
