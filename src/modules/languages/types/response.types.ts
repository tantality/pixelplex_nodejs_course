import { Response } from 'express';
import { LanguageDTO } from '../language.dto';
import { GetLanguagesCommon } from './common.types';

export type GetLanguagesResponse = Response<GetLanguagesCommon>;
export type GetOneLanguageResponse = Response<LanguageDTO>;
export type CreateLanguageResponse = Response<LanguageDTO>;
export type UpdateLanguageResponse = Response<LanguageDTO>;
