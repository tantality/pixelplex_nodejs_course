import { NextFunction, Request } from 'express';
import { GetOneUserResponse, UpdateUserRequest, UpdateUserResponse } from './types';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

export class UsersController {
  static getOneUser = async (req: Request, res: GetOneUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = await UsersService.findById(req);
      res.status(200).json(user as UserDTO);
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: UpdateUserRequest, res: UpdateUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = await UsersService.update(req);
      res.status(200).json(user as UserDTO);
    } catch (err) {
      next(err);
    }
  };
}
