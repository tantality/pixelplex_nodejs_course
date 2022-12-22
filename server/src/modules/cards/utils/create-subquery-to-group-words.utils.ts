export const createSubqueryToGroupWords = (findWordsSubquery: string, orderByWordCondition: string): string => {
  return `
    (
      SELECT ARRAY_AGG("w"."id" ${orderByWordCondition}) AS "ids", ARRAY_AGG("w"."value" ${orderByWordCondition}) AS "values", "w"."cardId" AS "cardId"
      FROM ${findWordsSubquery} AS "w"
      GROUP BY "w"."cardId"
    )`;
};
