/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE, AUTHORIZATION_HEADER_IS_MISSING_MESSAGE, UnauthorizedError } from '../errors';
import { TokensService } from '../modules/auth/tokens.service';

export function isAuth<T>(req: T, _res: Response, next: NextFunction): void {
  try {
    const request = req as T & Request;
    const authHeader = request.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError(AUTHORIZATION_HEADER_IS_MISSING_MESSAGE);
    }

    const accessToken = authHeader.split(' ')[1];
    const verifiedAccessToken = TokensService.validateAccessToken(accessToken);

    request.userId = verifiedAccessToken.userId;
    request.role = verifiedAccessToken.role;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError(ACCESS_TOKEN_IS_MISSING_OR_INVALID_MESSAGE));
    }

    next(err);
  }
}
