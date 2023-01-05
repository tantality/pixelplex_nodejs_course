import { Answers, GetStatisticsQueryResult, Statistics } from '../types';

const transformStatisticsQueryResult = (queryResult: GetStatisticsQueryResult): { statistics: Statistics[] } => {
  const statistics: Statistics[] = [];

  const defaultAnswers: Answers = { correct: 0, incorrect: 0, unanswered: 0 };
  const transformedAnswers: Answers & { [key: string]: number } = {} as Answers & { [key: string]: number };

  queryResult.forEach(({ language, answers }) => {
    answers.forEach(({ status, count }) => {
      transformedAnswers[status] = count;
    });

    const statisticsItem: Statistics = {
      language,
      answers: {
        ...defaultAnswers,
        ...transformedAnswers,
      } as Answers,
    };

    statistics.push(statisticsItem);
  });

  return { statistics };
};

export const getStatisticsByLanguage = (queryResult: GetStatisticsQueryResult): { statistics: Statistics[] } => {
  if (!queryResult.length) {
    return { statistics: [] };
  }

  const statistics = transformStatisticsQueryResult(queryResult);

  return statistics;
};
