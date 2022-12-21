import { NextFunction, Request, Response } from 'express';
import { COOKIE_OPTIONS } from './auth.constants';
import { AuthService } from './auth.service';
import { SignUpResponse, LogInResponse, RefreshTokensResponse, SignUpRequest, LogInRequest } from './types';

export class AuthController {
  static signUp = async (req: SignUpRequest, res: SignUpResponse, next: NextFunction): Promise<void> => {
    try {
      const authData = await AuthService.signUp(req.body);
      res.cookie('refreshToken', authData.refreshToken, COOKIE_OPTIONS);
      res.status(201).json(authData);
    } catch (err) {
      next(err);
    }
  };

  static logIn = async (req: LogInRequest, res: LogInResponse, next: NextFunction): Promise<void> => {
    try {
      const authData = await AuthService.logIn(req.body);
      res.cookie('refreshToken', authData.refreshToken, COOKIE_OPTIONS);
      res.status(200).json(authData);
    } catch (err) {
      next(err);
    }
  };

  static logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await AuthService.logOut(req.userId as number);

      res.clearCookie('refreshToken');
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };

  static refreshTokens = async (req: Request, res: RefreshTokensResponse, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.cookies;
      const authData = await AuthService.refresh(refreshToken);
      res.cookie('refreshToken', authData.refreshToken, COOKIE_OPTIONS);
      res.status(200).json(authData);
    } catch (err) {
      next(err);
    }
  };
}
