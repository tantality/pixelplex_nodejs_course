import { WordValueWithCardLanguages } from '../../cards/types';

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
export type TaskIdWithWordData = { id: number; hiddenWord: WordValueWithCardLanguages };
