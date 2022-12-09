import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { JWTService } from '../modules/auth/jwt.service';

export function isAuth<T>(req: T, _res: Response, next: NextFunction): void {
  try {
    const request = req as T & Request;
    const authHeader = request.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing.');
    }

    const accessToken = authHeader.split(' ')[1];
    const verifiedAccessToken = JWTService.validateAccessToken(accessToken);

    request.userId = verifiedAccessToken.userId;
    request.role = verifiedAccessToken.role;

    next();
  } catch (err) {
    next(new UnauthorizedError('Access token is missing or invalid.'));
  }
}
