import { NextFunction, Request } from 'express';
import { NotFoundError } from '../../errors';
import { GetOneUserResponse, UpdateUserRequest, UpdateUserResponse } from './types';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

export class UsersController {
  static getOneUser = async (req: Request, res: GetOneUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = await UsersService.findOneByCondition({ id: 2 });
      if (!user) {
        throw new NotFoundError('User not found.');
      }
      res.status(200).json(new UserDTO(user));
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: UpdateUserRequest, res: UpdateUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = await UsersService.update(2, req.body);
      res.status(200).json(new UserDTO(user));
    } catch (err) {
      next(err);
    }
  };
}
