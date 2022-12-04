import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { Language } from '../language.entity';

export const getWhereOptions = (search?: string): FindOptionsWhere<Language> => {
  let whereOptions: FindOptionsWhere<Language> = {};
  if (search) {
    whereOptions = {
      name: ILike(`%${search}%`),
    };
  }
  return whereOptions;
};

export const getOrderOptions = (sortBy: string, sortDir: string): FindOptionsOrder<Language> => {
  let orderOptions: FindOptionsOrder<Language> = {};
  const sortDirection: 'ASC' | 'DESC' = sortDir.toUpperCase() as 'ASC' | 'DESC';
  if (sortBy === 'name') {
    orderOptions = { name: sortDirection };
  }
  if (sortBy === 'date') {
    orderOptions = { createdAt: sortDirection };
  }
  return orderOptions;
};
