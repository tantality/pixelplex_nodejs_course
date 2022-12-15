/* eslint-disable require-await */
import { FindOptionsWhere } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { logRequest } from '../../utils';
import { Word } from '../cards/word.entity';
import { WordsService } from '../cards/words.service';
import { LanguageDTO } from '../languages/language.dto';
import { Language } from '../languages/language.entity';
import { LanguagesService } from '../languages/languages.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import {
  GetTasksRequest,
  GetTasksCommon,
  GetStatisticsCommon,
  GetStatisticsRequest,
  CreateTaskCommon,
  CreateTaskBody,
  TASK_TYPE,
  AddAnswerToTaskBody,
  TASK_STATUS,
  TaskIdWithWordData,
} from './types';

const language = new Language();
language.id = 1;
language.code = 'russian';
language.name = 'ru';
language.createdAt = new Date();
language.updatedAt = new Date();
const languageDTO = new LanguageDTO(language);

const task = new Task();
task.id = 1;
task.userId = 1;
task.hiddenWordId = 1;
task.type = 'to_foreign';
task.status = 'correct';
task.correctAnswers = ['привет'];
task.receivedAnswer = 'привет';
task.createdAt = new Date();
task.updatedAt = new Date();
const taskDTO = new TaskDTO(task, 'hello', 1, 2);

export class TasksService {
  static findAll = async (req: GetTasksRequest): Promise<GetTasksCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      tasks: [taskDTO],
    };
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await TasksRepository.findOneByCondition(whereCondition);
    return task;
  };

  static calculateStatistics = async (req: GetStatisticsRequest): Promise<GetStatisticsCommon | null> => {
    logRequest(req);
    const statistics = [
      {
        language: languageDTO,
        answers: {
          correct: 10,
          incorrect: 1,
        },
      },
    ];

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

  static create = async (userId: number, { type, foreignLanguageId }: CreateTaskBody): Promise<CreateTaskCommon> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    if (!nativeLanguageId) {
      throw new NotFoundError('The user\'s native language is not set.');
    }

    const foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
    if (!foreignLanguage) {
      throw new NotFoundError('Language not found');
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError('ForeignLanguageId must be different from the user\'s nativeLanguageId.');
    }

    const hiddenWord = await TasksService.getRandomWord(userId, nativeLanguageId, foreignLanguageId, type);
    if (!hiddenWord) {
      throw new BadRequestError('No cards with the current native or / and foreign language were found.');
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

  static getTaskStatus = (correctAnswers: string[], receivedAnswer: string): string => {
    const isReceivedAnswerCorrect = correctAnswers.includes(receivedAnswer);
    if (isReceivedAnswerCorrect) {
      return TASK_STATUS.CORRECT;
    } else {
      return TASK_STATUS.INCORRECT;
    }
  };

  static update = async (userId: number, taskId: number, { answer }: AddAnswerToTaskBody): Promise<TaskDTO> => {
    const task = await TasksService.findOneByCondition({ id: taskId, userId });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.status !== TASK_STATUS.UNANSWERED) {
      throw new BadRequestError('The answer has already been recorded for the task');
    }

    const { id, hiddenWordId, type } = task;

    const correctAnswers = await TasksService.findCorrectAnswers(hiddenWordId, userId, type);
    const status = TasksService.getTaskStatus(correctAnswers, answer);
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
