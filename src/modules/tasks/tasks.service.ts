import { FindOptionsWhere, ILike } from 'typeorm';
import {
  ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE,
  LANGUAGE_NOT_FOUND_MESSAGE,
  NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE,
  NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE,
  NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE,
  TASK_NOT_FOUND_MESSAGE,
} from '../../errors';
import { BadRequestError, NotFoundError } from '../../errors/app.error';
import { Word } from '../cards/word.entity';
import { WordsService } from '../cards/words.service';
import { LanguagesService } from '../languages/languages.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Statistics, TASK_TYPE, CreatedTaskDTO, TASK_STATUS, UpdateTaskParams, TaskIdWithWordData } from './types';
import { CreateTaskBody, UpdateTaskBody } from './types/body.types';
import { GetStatisticsQuery, GetTasksQuery } from './types/query.types';
import { getTaskStatus } from './utils';

export class TasksService {
  static findAndCountAll = async (
    userId: number,
    { search, sortDirection, limit, offset, taskStatus, languageId }: GetTasksQuery,
  ): Promise<{ count: number; tasks: TaskDTO[] }> => {
    const whereCondition: FindOptionsWhere<Task>[] = [];
    let baseCondition: FindOptionsWhere<Task> = { userId, hiddenWord: {} as FindOptionsWhere<Word> };

    if (search) {
      baseCondition = {
        ...baseCondition,
        hiddenWord: {
          value: ILike(`%${search}%`),
        },
      };
    }

    if (taskStatus) {
      baseCondition = { ...baseCondition, status: taskStatus };
    }

    let taskWithNativeLanguageCondition: FindOptionsWhere<Task> | null = null;
    let taskWithForeignLanguageCondition: FindOptionsWhere<Task> | null = null;

    if (languageId) {
      taskWithNativeLanguageCondition = {
        hiddenWord: {
          ...(baseCondition.hiddenWord as FindOptionsWhere<Word>),
          card: {
            nativeLanguageId: languageId,
          },
        } as FindOptionsWhere<Word>,
      } as FindOptionsWhere<Task>;

      taskWithForeignLanguageCondition = {
        hiddenWord: {
          ...(baseCondition.hiddenWord as FindOptionsWhere<Word>),
          card: {
            foreignLanguageId: languageId,
          },
        } as FindOptionsWhere<Word>,
      } as FindOptionsWhere<Task>;
    }

    whereCondition.push({ ...baseCondition, ...taskWithNativeLanguageCondition });
    whereCondition.push({ ...baseCondition, ...taskWithForeignLanguageCondition });

    const tasksAndTheirNumber = await TasksRepository.findAndCountAll(offset, limit, sortDirection, whereCondition);

    return tasksAndTheirNumber;
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await TasksRepository.findOneByCondition(whereCondition);
    return task;
  };

  static calculateStatistics = async (userId: number, query: GetStatisticsQuery): Promise<{ statistics: Statistics[] }> => {
    const statistics = await TasksRepository.calculateStatistics(userId, query);
    return statistics;
  };

  static getRandomWord = async (
    userId: number,
    nativeLanguageId: number,
    foreignLanguageId: number,
    type: string,
  ): Promise<Word | null> => {
    const languageId = type === TASK_TYPE.TO_NATIVE ? foreignLanguageId : nativeLanguageId;
    const word = await Word.createQueryBuilder('word')
      .leftJoinAndSelect('word.card', 'card')
      .where('card.userId=:userId', { userId })
      .andWhere('card.nativeLanguageId=:nativeLanguageId', { nativeLanguageId })
      .andWhere('card.foreignLanguageId=:foreignLanguageId', { foreignLanguageId })
      .andWhere('word.languageId=:languageId', { languageId })
      .orderBy('RANDOM()')
      .getOne();

    return word;
  };

  static create = async (userId: number, { type, foreignLanguageId }: CreateTaskBody): Promise<CreatedTaskDTO> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    if (!nativeLanguageId) {
      throw new BadRequestError(NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE);
    }

    const foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
    if (!foreignLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError(NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE);
    }

    const hiddenWord = await TasksService.getRandomWord(userId, nativeLanguageId, foreignLanguageId, type);
    if (!hiddenWord) {
      throw new BadRequestError(NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE);
    }

    const createdTask = await TasksRepository.create({ userId, hiddenWordId: hiddenWord.id, type });

    return {
      id: createdTask.id,
      nativeLanguageId,
      foreignLanguageId,
      word: hiddenWord.value,
      type,
    };
  };

  static findCorrectAnswers = async (hiddenWordId: number, userId: number, type: string): Promise<string[]> => {
    const {
      value,
      card: { nativeLanguageId, foreignLanguageId },
    } = (await WordsService.findOneWithJoinedCard(hiddenWordId)) as Word;

    const languageId = type === TASK_TYPE.TO_NATIVE ? nativeLanguageId : foreignLanguageId;
    const cardIdsQueryBuilder = WordsService.findCardIdsByConditionQueryBuilder(userId, nativeLanguageId, foreignLanguageId, value);
    const answers = await WordsService.findCorrectAnswersToTask(cardIdsQueryBuilder, languageId);

    return answers;
  };

  static update = async (userId: number, { taskId }: UpdateTaskParams, { answer }: UpdateTaskBody): Promise<TaskDTO> => {
    const task = await TasksService.findOneByCondition({ id: taskId, userId });
    if (!task) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }

    if (task.status !== TASK_STATUS.UNANSWERED) {
      throw new BadRequestError(ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE);
    }

    const { id, hiddenWordId, type } = task;

    const correctAnswers = await TasksService.findCorrectAnswers(hiddenWordId, userId, type);
    const status = getTaskStatus(correctAnswers, answer);
    const updatedTask = await TasksRepository.update(id, correctAnswers, answer, status);

    const {
      hiddenWord: {
        value,
        card: { nativeLanguageId, foreignLanguageId },
      },
    } = (await TasksRepository.findOneForDTO(id)) as TaskIdWithWordData;

    const updatedTaskDTO = new TaskDTO(updatedTask, value, nativeLanguageId, foreignLanguageId);

    return updatedTaskDTO;
  };
}
