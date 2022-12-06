import { NextFunction } from 'express';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
  CreateLanguageResponse,
  DeleteLanguageResponse,
  GetLanguagesCommon,
  GetLanguagesResponse,
  GetOneLanguageResponse,
  UpdateLanguageResponse,
} from './types';
import { LanguagesService } from './languages.service';
import { LanguageDTO } from './language.dto';

export class LanguagesController {
  static getLanguages = async (req: GetLanguagesRequest, res: GetLanguagesResponse, next: NextFunction): Promise<void> => {
    try {
      const languages = await LanguagesService.findAll(req);
      res.status(200).json(languages as GetLanguagesCommon);
    } catch (err) {
      next(err);
    }
  };

  static getOneLanguage = async (req: GetOneLanguageRequest, res: GetOneLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const language = await LanguagesService.findById(req);
      res.status(200).json(language as LanguageDTO);
    } catch (err) {
      next(err);
    }
  };

  static createLanguage = async (req: CreateLanguageRequest, res: CreateLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const createdLanguage = await LanguagesService.create(req);
      res.status(201).json(createdLanguage);
    } catch (err) {
      next(err);
    }
  };

  static updateLanguage = async (req: UpdateLanguageRequest, res: UpdateLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedLanguage = await LanguagesService.update(req);
      res.status(200).json(updatedLanguage as LanguageDTO);
    } catch (err) {
      next(err);
    }
  };

  static deleteLanguage = async (req: DeleteLanguageRequest, res: DeleteLanguageResponse, next: NextFunction): Promise<void> => {
    try {
      const languageId = await LanguagesService.delete(req);
      res.status(200).json({ id: languageId as number });
    } catch (err) {
      next(err);
    }
  };
}
