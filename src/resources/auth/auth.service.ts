/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { User } from '../users/user.entity';
import { AuthDTO } from './auth.dto';
import { SignUpRequest, LogInRequest } from './types';

const user = new User(1, 'Angelina', 'email@gmail.com', 'email@gmail.com', 'qwerty123', 'user', 'awdwkmkwad243', new Date(), new Date());
const authDTO = new AuthDTO(user, 'amdwiwnf');

export class AuthService {
  static signUp = async (req: SignUpRequest): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };

  static logIn = async (req: LogInRequest): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };

  static logOut = async (req: Request): Promise<number> => {
    logRequest(req);
    return 1;
  };

  static refresh = async (req: Request): Promise<AuthDTO> => {
    logRequest(req);
    return authDTO;
  };
}
