import { NextFunction, Request, Response } from 'express';
import { ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE, AUTHORIZATION_HEADER_IS_MISSING_MESSAGE, UnauthorizedError } from '../errors';
import { JWTService } from '../modules/auth/jwt.service';

export function isAuth<T>(req: T, _res: Response, next: NextFunction): void {
  try {
    const request = req as T & Request;
    const authHeader = request.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError(AUTHORIZATION_HEADER_IS_MISSING_MESSAGE);
    }

    const accessToken = authHeader.split(' ')[1];
    const verifiedAccessToken = JWTService.validateAccessToken(accessToken);

    request.userId = verifiedAccessToken.userId;
    request.role = verifiedAccessToken.role;

    next();
  } catch (err) {
    next(new UnauthorizedError(ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE));
  }
}
