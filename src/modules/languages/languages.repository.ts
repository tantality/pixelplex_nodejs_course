import { DeepPartial, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageBody, GetLanguagesCommon, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static findAndCountAll = async (
    skip: number,
    take: number,
    whereCondition: FindOptionsWhere<Language>,
    orderCondition: FindOptionsOrder<Language>,
  ): Promise<GetLanguagesCommon> => {
    const languagesAndTheirNumber = await Language.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
      },
      where: whereCondition,
      order: orderCondition,
      skip,
      take,
    });

    const [languages, count] = languagesAndTheirNumber;

    return { count, languages };
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Language>): Promise<Language | null> => {
    const language = await Language.findOneBy(whereCondition);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<Language> => {
    const createdLanguage = Language.create(body as DeepPartial<Language>);
    const savedLanguage = await Language.save(createdLanguage);

    return savedLanguage;
  };

  static update = async (currentLanguage: Language, id: number, body: UpdateLanguageBody): Promise<Language> => {
    await Language.update({ id }, { ...currentLanguage, ...body });

    const updatedLanguage = (await LanguagesRepository.findOneByCondition({ id })) as Language;

    return updatedLanguage;
  };

  static delete = async (id: number): Promise<void> => {
    await Language.delete({ id });
  };
}
