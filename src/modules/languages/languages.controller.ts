import { NextFunction } from 'express';
import { NotFoundError } from '../../errors';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
  CreateLanguageResponse,
  DeleteLanguageResponse,
  GetLanguagesResponse,
  GetOneLanguageResponse,
  UpdateLanguageResponse,
} from './types';
import { LanguagesService } from './languages.service';
import { LanguageDTO } from './language.dto';

export class LanguagesController {
  static getLanguages = async (req: GetLanguagesRequest, res: GetLanguagesResponse, next: NextFunction): Promise<void> => {
    try {
      const languages = await LanguagesService.findAndCountAll(req.query);
      res.status(200).json(languages);
    } catch (err) {
      next(err);
    }
  };

  static getOneLanguage = async (req: GetOneLanguageRequest, res: GetOneLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const language = await LanguagesService.findOneByCondition({ id: req.params.languageId });
      if (!language) {
        throw new NotFoundError('Language not found.');
      }
      res.status(200).json(new LanguageDTO(language));
    } catch (err) {
      next(err);
    }
  };

  static createLanguage = async (req: CreateLanguageRequest, res: CreateLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const createdLanguage = await LanguagesService.create(req.body);
      res.status(201).json(createdLanguage);
    } catch (err) {
      next(err);
    }
  };

  static updateLanguage = async (req: UpdateLanguageRequest, res: UpdateLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedLanguage = await LanguagesService.update(req.params.languageId, req.body);
      res.status(200).json(updatedLanguage);
    } catch (err) {
      next(err);
    }
  };

  static deleteLanguage = async (req: DeleteLanguageRequest, res: DeleteLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const idOfDeletedLanguage = await LanguagesService.delete(req.params.languageId);
      res.status(200).json({ id: idOfDeletedLanguage });
    } catch (err) {
      next(err);
    }
  };
}
