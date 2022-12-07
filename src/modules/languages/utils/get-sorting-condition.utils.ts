import { FindOptionsOrder } from 'typeorm';
import { Language } from '../language.entity';

export const getSortingCondition = (sortBy: string, sortDir: string): FindOptionsOrder<Language> => {
  let sortingCondition: FindOptionsOrder<Language> = {};
  const sortDirection: 'ASC' | 'DESC' = sortDir.toUpperCase() as 'ASC' | 'DESC';
  if (sortBy === 'name') {
    sortingCondition = { name: sortDirection };
  }
  if (sortBy === 'date') {
    sortingCondition = { createdAt: sortDirection };
  }
  return sortingCondition;
};
