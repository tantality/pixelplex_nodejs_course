import { Request } from 'express';
import { CreateLanguageBody, UpdateLanguageBody } from './body.types';
import { DeleteLanguageParams, GetOneLanguageParams, UpdateLanguageParams } from './params.types';
import { GetLanguagesQuery } from './query.types';

export type GetLanguagesRequest = Request<unknown, unknown, unknown, GetLanguagesQuery>;
export type GetOneLanguageRequest = Request<GetOneLanguageParams, unknown, unknown, unknown>;
export type CreateLanguageRequest = Request<unknown, unknown, CreateLanguageBody, unknown>;
export type UpdateLanguageRequest = Request<UpdateLanguageParams, unknown, UpdateLanguageBody, unknown>;
export type DeleteLanguageRequest = Request<DeleteLanguageParams, unknown, unknown, unknown>;
