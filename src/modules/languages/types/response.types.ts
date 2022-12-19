import { Response } from 'express';
import { LanguageDTO } from '../language.dto';
import { Language } from '../language.entity';

export type GetLanguagesResponse = Response<{ count: number; languages: Language[] }>;
export type GetOneLanguageResponse = Response<LanguageDTO>;
export type CreateLanguageResponse = Response<LanguageDTO>;
export type UpdateLanguageResponse = Response<LanguageDTO>;
