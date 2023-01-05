import { NextFunction, Request } from 'express';
import { GetOneUserResponse, UpdateUserRequest, UpdateUserResponse } from './types';
import { UserDTO } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

export class UsersController {
  static getOneUser = async (req: Request, res: GetOneUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = (await UsersService.findOneByCondition({ id: req.userId as number })) as User;
      res.status(200).json(new UserDTO(user));
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: UpdateUserRequest, res: UpdateUserResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedUser = await UsersService.update(req.userId as number, req.body);
      res.status(200).json(new UserDTO(updatedUser));
    } catch (err) {
      next(err);
    }
  };
}
