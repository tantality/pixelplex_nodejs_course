import { DeepPartial, FindOptionsOrderValue, FindOptionsWhere, Like } from 'typeorm';
import AppDataSource from '../../data-source';
import { Word } from '../cards/word.entity';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { CreateTaskData, GetStatisticsQuery, GetStatisticsQueryResult, GetTasksQuery, Statistics, TaskIdWithWordData } from './types';
import { getStatisticsByLanguage, getTasksAndTheirNumber } from './utils';

export class TasksRepository {
  private static getAdditionalDatesCondition = (fromDate?: Date, toDate?: Date): string => {
    let additionalDatesCondition = ' AND "t"."createdAt" BETWEEN ';
    const fromDateQueryString = fromDate ? `'${fromDate.toISOString()}' AND ` : 'LEAST("t"."createdAt") AND ';
    const toDateQueryString = toDate ? `'${toDate.toISOString()}'` : 'GREATEST("t"."createdAt")';
    additionalDatesCondition += fromDateQueryString + toDateQueryString;

    return additionalDatesCondition;
  };

  private static getLanguageIdCondition = (
    baseCondition: FindOptionsWhere<Task>,
    languageIdType: 'foreignLanguageId' | 'nativeLanguageId',
    languageId?: number,
  ): FindOptionsWhere<Task> => {
    let languageIdCondition: FindOptionsWhere<Task> = {};
    if (languageId) {
      languageIdCondition = {
        hiddenWord: {
          ...(baseCondition.hiddenWord as FindOptionsWhere<Word>),
          card: {
            [languageIdType]: languageId,
          },
        },
      };
    }

    return languageIdCondition;
  };

  private static getBaseCondition = (
    userId: number,
    { search, taskStatus }: Pick<GetTasksQuery, 'search' | 'taskStatus'>,
  ): FindOptionsWhere<Task> => {
    let baseCondition: FindOptionsWhere<Task> = { userId, hiddenWord: {} as FindOptionsWhere<Word> };

    if (search) {
      baseCondition = {
        ...baseCondition,
        hiddenWord: {
          value: Like(`%${search}%`),
        },
      };
    }

    if (taskStatus) {
      baseCondition = { ...baseCondition, status: taskStatus };
    }

    return baseCondition;
  };

  private static getWhereCondition = (
    userId: number,
    { search, taskStatus, languageId }: Pick<GetTasksQuery, 'search' | 'taskStatus' | 'languageId'>,
  ): FindOptionsWhere<Task>[] => {
    const whereCondition: FindOptionsWhere<Task>[] = [];
    const baseCondition = TasksRepository.getBaseCondition(userId, { search, taskStatus });

    const nativeLanguageIdCondition = TasksRepository.getLanguageIdCondition(baseCondition, 'nativeLanguageId', languageId);
    const foreignLanguageIdCondition = TasksRepository.getLanguageIdCondition(baseCondition, 'foreignLanguageId', languageId);

    whereCondition.push({ ...baseCondition, ...nativeLanguageIdCondition });
    whereCondition.push({ ...baseCondition, ...foreignLanguageIdCondition });

    return whereCondition;
  };

  static findAndCountAll = async (
    userId: number,
    { search, sortDirection, limit, offset, taskStatus, languageId }: GetTasksQuery,
  ): Promise<{ count: number; tasks: TaskDTO[] }> => {
    const whereCondition = TasksRepository.getWhereCondition(userId, { search, taskStatus, languageId });
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
      skip: offset,
      take: limit,
    });

    return getTasksAndTheirNumber(tasksAndTheirNumberQueryResult);
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await Task.findOneBy(whereCondition);
    return task;
  };

  static findTaskPartToCreateDTO = async (id: number): Promise<TaskIdWithWordData | null> => {
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

    const additionalDatesCondition = TasksRepository.getAdditionalDatesCondition(fromDate, toDate);

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
