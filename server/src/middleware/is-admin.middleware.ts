import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';
import { USER_ROLE } from '../modules/users/types';

export function isAdmin<T>(req: T, _res: Response, next: NextFunction): void {
  try {
    const request = req as T & Request;

    if (request.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenError();
    }

    next();
  } catch (err) {
    next(err);
  }
}
