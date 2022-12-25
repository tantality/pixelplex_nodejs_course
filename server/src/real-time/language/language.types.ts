import { ILanguage } from '../../modules/languages/types';

export enum LANGUAGE_EVENTS {
  CREATING = 'creating-language',
}

export type LanguageEvents = {
  [LANGUAGE_EVENTS.CREATING]: (payload: ILanguage) => void;
};
