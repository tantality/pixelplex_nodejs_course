import { LanguageDTO } from './language.dto';
import { Language } from './language.entity';

const LANGUAGE = new Language();
LANGUAGE.id = 1;
LANGUAGE.name = 'russian';
LANGUAGE.code = 'rus';
LANGUAGE.createdAt = new Date();
LANGUAGE.updatedAt = new Date();

export const LANGUAGE_DTO = new LanguageDTO(LANGUAGE);
