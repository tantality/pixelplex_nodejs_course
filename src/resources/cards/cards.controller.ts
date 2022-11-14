/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
import { NextFunction, Request, Response } from 'express';
import { logRequest } from '../../utils/log-request.utils';

export class CardsController {
  static getCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static updateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };
}