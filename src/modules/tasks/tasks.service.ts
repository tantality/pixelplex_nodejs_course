import { FindOptionsWhere } from 'typeorm';
import { ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE, NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE, TASK_NOT_FOUND_MESSAGE } from '../../errors';
import { BadRequestError, NotFoundError } from '../../errors/app.error';
import { checkLanguagesValidity } from '../../utils';
import { Word } from '../cards/word.entity';
import { WordsService } from '../cards/words.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Statistics, TASK_TYPE, CreatedTaskDTO, TASK_STATUS, UpdateTaskParams, TaskIdWithWordData } from './types';
import { CreateTaskBody, UpdateTaskBody } from './types/body.types';
import { GetStatisticsQuery, GetTasksQuery } from './types/query.types';
import { getAnswerStatus } from './utils';

export class TasksService {
  static findAndCountAll = async (userId: number, query: GetTasksQuery): Promise<{ count: number; tasks: TaskDTO[] }> => {
    const tasksAndTheirNumber = await TasksRepository.findAndCountAll(userId, query);

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

  static create = async (userId: number, { type, foreignLanguageId }: CreateTaskBody): Promise<CreatedTaskDTO> => {
    let { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;

    await checkLanguagesValidity(nativeLanguageId, foreignLanguageId);

    nativeLanguageId = nativeLanguageId as number;

    const wordLanguageId = type === TASK_TYPE.TO_NATIVE ? foreignLanguageId : nativeLanguageId;
    const hiddenWord = await WordsService.findRandomOne(userId, nativeLanguageId, foreignLanguageId, wordLanguageId);
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

  private static findCorrectAnswers = async (hiddenWordId: number, userId: number, type: string): Promise<string[]> => {
    const {
      value,
      card: { nativeLanguageId, foreignLanguageId },
    } = (await WordsService.findOneWithJoinedCard(hiddenWordId)) as Word;

    const languageId = type === TASK_TYPE.TO_NATIVE ? nativeLanguageId : foreignLanguageId;
    const correctAnswers = await WordsService.findCorrectAnswersToTask(userId, nativeLanguageId, foreignLanguageId, value, languageId);

    return correctAnswers;
  };

  static update = async (userId: number, { taskId }: UpdateTaskParams, { answer }: UpdateTaskBody): Promise<TaskDTO> => {
    const taskToUpdate = await TasksService.findOneByCondition({ id: taskId, userId });
    if (!taskToUpdate) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }

    const { id, hiddenWordId, type, status } = taskToUpdate;

    if (status !== TASK_STATUS.UNANSWERED) {
      throw new BadRequestError(ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE);
    }

    const correctAnswers = await TasksService.findCorrectAnswers(hiddenWordId, userId, type);
    const answerStatus = getAnswerStatus(correctAnswers, answer);
    const updatedTask = await TasksRepository.update(id, correctAnswers, answer, answerStatus);

    const {
      hiddenWord: {
        value,
        card: { nativeLanguageId, foreignLanguageId },
      },
    } = (await TasksRepository.findTaskPartToCreateDTO(id)) as TaskIdWithWordData;

    return new TaskDTO(updatedTask, value, nativeLanguageId, foreignLanguageId);
  };
}
