import { NextFunction, Request } from 'express';
import { REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { AuthService } from './auth.service';
import { SignUpResponse, LogInResponse, LogOutResponse, RefreshTokensResponse, SignUpRequest, LogInRequest } from './types';

export class AuthController {
  static signUp = async (req: SignUpRequest, res: SignUpResponse, next: NextFunction): Promise<void> => {
    try {
      const authData = await AuthService.signUp(req.body);
      res.cookie('refreshToken', authData.refreshToken, { maxAge: REFRESH_TOKEN_LIFETIME_IN_MS, httpOnly: true, sameSite: 'strict' });
      res.status(201).json(authData);
    } catch (err) {
      next(err);
    }
  };

  static logIn = async (req: LogInRequest, res: LogInResponse, next: NextFunction): Promise<void> => {
    try {
      const authData = await AuthService.logIn(req.body);
      res.cookie('refreshToken', authData.refreshToken, { maxAge: REFRESH_TOKEN_LIFETIME_IN_MS, httpOnly: true, sameSite: 'strict' });
      res.status(200).json(authData);
    } catch (err) {
      next(err);
    }
  };

  static logOut = async (req: Request, res: LogOutResponse, next: NextFunction): Promise<void> => {
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
      res.cookie('refreshToken', authData.refreshToken, { maxAge: REFRESH_TOKEN_LIFETIME_IN_MS, httpOnly: true, sameSite: 'strict' });
      res.status(200).json(authData);
    } catch (err) {
      next(err);
    }
  };
}
