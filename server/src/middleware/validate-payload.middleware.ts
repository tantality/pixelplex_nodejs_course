import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BAD_REQUEST_MESSAGE } from '../errors';

export const validatePayload = <T>(req: T, res: Response, next: NextFunction): void => {
  const errors = validationResult(req as Request);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: BAD_REQUEST_MESSAGE, statusCode: 400, errors: errors.array() });
    return;
  }
  next();
};
