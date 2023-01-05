import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';
import { USER_ROLE } from '../modules/users/types';

export function hasAccess<T>(acceptableRoles: USER_ROLE[] = [USER_ROLE.ADMIN]) {
  return function (req: T, _res: Response, next: NextFunction): void {
    try {
      const { role } = req as T & Request;

      const userHasRole = acceptableRoles.includes(role as USER_ROLE);
      if (!userHasRole) {
        throw new ForbiddenError();
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
