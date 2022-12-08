/* eslint-disable import/no-named-as-default-member */
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { JWTService } from '../modules/auth/jwt.service';

export function isAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing.');
    }

    const accessToken = authHeader.split(' ')[1];
    const verifiedAccessToken = JWTService.validateAccessToken(accessToken);

    req.userId = verifiedAccessToken.userId;
    req.role = verifiedAccessToken.role;

    next();
  } catch (err) {
    next(new UnauthorizedError('Access token is missing or invalid.'));
  }
}
