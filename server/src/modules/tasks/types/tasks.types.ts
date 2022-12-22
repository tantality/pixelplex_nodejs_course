import { WordValueWithCardLanguages } from '../../cards/types';
import { LanguageDTO } from '../../languages/language.dto';
import { TaskDTO } from '../task.dto';

export interface ITask {
  id: number;
  userId: number;
  hiddenWordId: number;
  type: string;
  status: string;
  correctAnswers: string[] | null;
  receivedAnswer: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum TASK_STATUS {
  UNANSWERED = 'unanswered',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export enum TASK_TYPE {
  TO_NATIVE = 'to_native',
  TO_FOREIGN = 'to_foreign',
}

export enum TASK_SORT_BY {
  DATE = 'date',
}

export type CreateTaskData = Pick<ITask, 'hiddenWordId' | 'userId' | 'type'>;
export type CreatedTaskDTO = Pick<TaskDTO, 'id' | 'nativeLanguageId' | 'foreignLanguageId' | 'type'> & { word: string };
export type TaskIdWithWordData = { id: number; hiddenWord: WordValueWithCardLanguages };
export type GetStatisticsQueryResult = [{ language: LanguageDTO; answers: [{ count: number; status: string }] }];
export type Answers = Record<TASK_STATUS, number>;
export type Statistics = { language: LanguageDTO; answers: Answers };
