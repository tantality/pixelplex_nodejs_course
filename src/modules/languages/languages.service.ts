/* eslint-disable require-await */
import { logRequest } from '../../utils';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
  GetLanguagesCommon,
} from './types';
import { LanguageDTO } from './language.dto';
import { Language } from './language.entity';

const languageDTO = new LanguageDTO(new Language('russian', 'ru', new Date(), new Date()));

export class LanguagesService {
  static findAll = async (req: GetLanguagesRequest): Promise<GetLanguagesCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      languages: [languageDTO],
    };
  };

  static findById = async (req: GetOneLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest(req);
    return languageDTO;
  };

  static create = async (req: CreateLanguageRequest): Promise<LanguageDTO> => {
    logRequest(req);
    return languageDTO;
  };

  static update = async (req: UpdateLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest(req);
    return languageDTO;
  };

  static delete = async (req: DeleteLanguageRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
