import { ILanguage } from '../../modules/languages/types';

export enum LANGUAGE_EVENTS {
  CREATE = 'create-language',
}

export type LanguageEvents = {
  [LANGUAGE_EVENTS.CREATE]: (payload: ILanguage) => void;
};
