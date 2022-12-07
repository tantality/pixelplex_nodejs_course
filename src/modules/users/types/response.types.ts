import { Response } from 'express';
import { UserDTO } from '../user.dto';

export type GetOneUserResponse = Response<UserDTO>;
export type UpdateUserResponse = Response<UserDTO>;
