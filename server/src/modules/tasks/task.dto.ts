import { Task } from './task.entity';
import { ITask } from './types';

export class TaskDTO implements Omit<ITask, 'updatedAt' | 'userId' | 'hiddenWordId' | 'correctAnswers' | 'receivedAnswer'> {
  public readonly id: number;
  public readonly nativeLanguageId: number;
  public readonly foreignLanguageId: number;
  public readonly type: string;
  public readonly status: string;
  public readonly hiddenWord: string;
  public readonly correctAnswers?: string[];
  public readonly receivedAnswer?: string;
  public readonly createdAt: Date;
  constructor(task: Task, hiddenWord: string, nativeLanguageId: number, foreignLanguageId: number) {
    this.id = task.id;
    this.nativeLanguageId = nativeLanguageId;
    this.foreignLanguageId = foreignLanguageId;
    this.type = task.type;
    this.status = task.status;
    this.hiddenWord = hiddenWord;
    if (task.correctAnswers) {
      this.correctAnswers = task.correctAnswers;
    }
    if (task.receivedAnswer) {
      this.receivedAnswer = task.receivedAnswer;
    }
    this.createdAt = task.createdAt;
  }
}
