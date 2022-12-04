import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validatePayload = <T>(req: T, res: Response, next: NextFunction): void => {
  const errors = validationResult(req as Request);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Bad request', statusCode: 400, errors: errors.array() });
    return;
  }
  next();
};
