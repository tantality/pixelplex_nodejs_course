/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { AUTH_DTO } from './auth.constants';
import { AuthDTO } from './auth.dto';
import { SignUpRequest, LogInRequest } from './types';

export class AuthService {
  static signUp = async (req: SignUpRequest): Promise<AuthDTO> => {
    logRequest(req);
    return AUTH_DTO;
  };

  static logIn = async (req: LogInRequest): Promise<AuthDTO> => {
    logRequest(req);
    return AUTH_DTO;
  };

  static logOut = async (req: Request): Promise<number> => {
    logRequest(req);
    return 1;
  };

  static refresh = async (req: Request): Promise<AuthDTO> => {
    logRequest(req);
    return AUTH_DTO;
  };
}
