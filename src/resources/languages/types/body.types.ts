import { ILanguage } from '../language.interface';

export type CreateLanguageBody = Pick<ILanguage, 'code' | 'name'>;
export type UpdateLanguageBody = Partial<CreateLanguageBody>;
