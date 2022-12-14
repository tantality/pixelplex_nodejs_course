/* eslint-disable require-await */
import { BadRequestError, NotFoundError } from '../../errors';
import { logRequest } from '../../utils';
import { Word } from '../cards/word.entity';
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
  AddAnswerToTaskRequest,
  CreateTaskBody,
  TASK_TYPE,
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

  static addAnswer = async (req: AddAnswerToTaskRequest): Promise<TaskDTO> => {
    logRequest(req);
    return taskDTO;
  };
}
