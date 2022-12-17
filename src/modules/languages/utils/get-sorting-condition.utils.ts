import { FindOptionsOrder } from 'typeorm';
import { SORT_DIRECTION } from '../../../types';
import { Language } from '../language.entity';
import { LANGUAGE_SORT_BY } from '../types';

export const getSortingCondition = (sortBy: string, sortDir: string): FindOptionsOrder<Language> => {
  let sortingCondition: FindOptionsOrder<Language> = {};
  const sortDirection: SORT_DIRECTION = sortDir as SORT_DIRECTION;

  if (sortBy === LANGUAGE_SORT_BY.NAME) {
    sortingCondition = { name: sortDirection };
  }
  if (sortBy === LANGUAGE_SORT_BY.DATE) {
    sortingCondition = { createdAt: sortDirection };
  }

  return sortingCondition;
};
