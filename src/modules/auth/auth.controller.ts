import { NextFunction, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpResponse, LogInResponse, LogOutResponse, RefreshTokensResponse, SignUpRequest, LogInRequest } from './types';

export class AuthController {
  static signUp = async (req: SignUpRequest, res: SignUpResponse, next: NextFunction): Promise<void> => {
    try {
      const auth = await AuthService.signUp(req);
      res.status(201).json(auth);
    } catch (err) {
      next(err);
    }
  };

  static logIn = async (req: LogInRequest, res: LogInResponse, next: NextFunction): Promise<void> => {
    try {
      const auth = await AuthService.logIn(req);
      res.status(200).json(auth);
    } catch (err) {
      next(err);
    }
  };

  static logOut = async (req: Request, res: LogOutResponse, next: NextFunction): Promise<void> => {
    try {
      const userId = await AuthService.logOut(req);
      res.status(200).json({ id: userId });
    } catch (err) {
      next(err);
    }
  };

  static refreshTokens = async (req: Request, res: RefreshTokensResponse, next: NextFunction): Promise<void> => {
    try {
      const auth = await AuthService.refresh(req);
      res.status(200).json(auth);
    } catch (err) {
      next(err);
    }
  };
}
