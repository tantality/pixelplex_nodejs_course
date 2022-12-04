import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageBody, GetLanguagesCommon, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static findAndCountAll = async (
    skip: number,
    take: number,
    where: FindOptionsWhere<Language>,
    order: FindOptionsOrder<Language>,
  ): Promise<GetLanguagesCommon> => {
    const languagesAndCount = await Language.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
      },
      where,
      order,
      skip,
      take,
    });

    const [languages, count] = languagesAndCount;
    return { count, languages };
  };

  static findByCode = async (code: string): Promise<Language | null> => {
    const language = await Language.findOneBy({ code });
    return language;
  };

  static findById = async (id: number): Promise<Language | null> => {
    const language = await Language.findOneBy({ id });
    return language;
  };

  static create = async ({ name, code }: CreateLanguageBody): Promise<Language> => {
    const language = Language.create({ code, name });
    const createdLanguage = await Language.save(language);
    return createdLanguage;
  };

  static update = async (currentLanguage: Language, id: number, body: UpdateLanguageBody): Promise<Language> => {
    await Language.update({ id }, { ...currentLanguage, ...body });
    const updatedLanguage = (await LanguagesRepository.findById(id)) as Language;
    return updatedLanguage;
  };

  static delete = async (id: number): Promise<void> => {
    await Language.delete({ id });
  };
}
