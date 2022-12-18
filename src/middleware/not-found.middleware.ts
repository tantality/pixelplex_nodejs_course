import { Request, Response } from 'express';
import { ENDPOINT_NOT_FOUND_MESSAGE } from '../errors';

export const processNotFoundEndpoint = (_req: Request, res: Response): void => {
  res.status(404).json({ message: ENDPOINT_NOT_FOUND_MESSAGE, statusCode: 404 });
};
