import { DeepPartial, FindOptionsOrderValue, FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../data-source';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { CreateTaskData, GetStatisticsQuery, GetStatisticsQueryResult, Statistics, TaskIdWithWordData } from './types';
import { getStatisticsByLanguage, getTasksAndTheirNumber } from './utils';

export class TasksRepository {
  static findAndCountAll = async (
    skip: number,
    take: number,
    sortDirection: string,
    whereCondition: FindOptionsWhere<Task>[],
  ): Promise<{ count: number; tasks: TaskDTO[] }> => {
    const tasksAndTheirNumberQueryResult = await Task.findAndCount({
      select: {
        id: true,
        type: true,
        status: true,
        hiddenWord: {
          value: true,
          card: {
            nativeLanguageId: true,
            foreignLanguageId: true,
          },
        },
        correctAnswers: true,
        receivedAnswer: true,
        createdAt: true,
      },
      relations: {
        hiddenWord: {
          card: true,
        },
      },
      where: whereCondition,
      order: {
        createdAt: sortDirection as FindOptionsOrderValue,
      },
      skip,
      take,
    });

    return getTasksAndTheirNumber(tasksAndTheirNumberQueryResult);
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await Task.findOneBy(whereCondition);
    return task;
  };

  static findTaskPartForDTO = async (id: number): Promise<TaskIdWithWordData | null> => {
    const task: TaskIdWithWordData | null = await Task.createQueryBuilder('task')
      .select(['task.id', 'card.nativeLanguageId', 'card.foreignLanguageId', 'word.value'])
      .leftJoin('task.hiddenWord', 'word')
      .leftJoin('word.card', 'card')
      .where('task.id=:id', { id })
      .getOne();

    return task;
  };

  static calculateStatistics = async (
    userId: number,
    { fromDate, toDate, languageIds }: GetStatisticsQuery,
  ): Promise<{ statistics: Statistics[] }> => {
    const additionalLanguageIdCondition = languageIds ? ` AND "w"."languageId" IN (${languageIds.join(',')})` : '';

    let additionalDatesCondition = ' AND "t"."createdAt" BETWEEN ';
    const fromDateQueryString = fromDate ? `'${fromDate.toISOString()}' AND ` : 'LEAST("t"."createdAt") AND ';
    const toDateQueryString = toDate ? `'${toDate.toISOString()}'` : 'GREATEST("t"."createdAt")';
    additionalDatesCondition += fromDateQueryString + toDateQueryString;

    const statisticsByLanguageQueryResult: GetStatisticsQueryResult = await AppDataSource.query(`
      SELECT 
        JSONB_BUILD_OBJECT('id', "l"."id", 'code', "l"."code", 'name', "l"."name", 'createdAt', "l"."createdAt") AS "language",
        JSONB_AGG( DISTINCT "stats"."answers" ) AS "answers"
      FROM (
          SELECT "w"."languageId" AS "languageId", JSONB_BUILD_OBJECT('count', COUNT(*), 'status', "t"."status" )  AS "answers"
          FROM "tasks" AS "t" LEFT JOIN "words" AS "w" ON "t"."hiddenWordId" = "w"."id" 
          WHERE "t"."userId"=${userId} ${additionalLanguageIdCondition} ${additionalDatesCondition}
          GROUP BY "w"."languageId" , "t"."status"
        ) AS "stats",
        "tasks" AS "t" 
          LEFT JOIN "words" AS "w" ON "t"."hiddenWordId" = "w"."id"
          LEFT JOIN "languages" AS "l" ON "w"."languageId" = "l"."id"
      WHERE "w"."languageId" = "stats"."languageId" 
      GROUP BY "l"."id", "l"."code", "l"."name", "l"."createdAt"
  `);

    return getStatisticsByLanguage(statisticsByLanguageQueryResult);
  };

  static create = async (taskData: CreateTaskData): Promise<Task> => {
    const createdTask = Task.create(taskData as DeepPartial<Task>);
    const savedTask = await Task.save(createdTask);

    return savedTask;
  };

  static update = async (id: number, correctAnswers: string[], receivedAnswer: string, status: string): Promise<Task> => {
    await Task.update({ id }, { correctAnswers, receivedAnswer, status });

    const updatedTask = (await TasksRepository.findOneByCondition({ id })) as Task;

    return updatedTask;
  };
}
