import { ILanguage } from '.';

export type CreateLanguageBody = Pick<ILanguage, 'code' | 'name'>;
export type UpdateLanguageBody = Partial<CreateLanguageBody>;
