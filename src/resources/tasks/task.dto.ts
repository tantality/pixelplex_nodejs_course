import { ITask } from './task.interface';

export class TaskDTO implements Omit<ITask, 'updatedAt' | 'userId' | 'hiddenWordId'> {
  public readonly id: number;
  public readonly nativeLanguageId: number;
  public readonly foreignLanguageId: number;
  public readonly type: string;
  public readonly status: string;
  public readonly hiddenWord: string;
  public readonly correctAnswers: string[];
  public readonly receivedAnswer: string;
  public readonly createdAt: Date;
  constructor(task: ITask, hiddenWord: string, nativeLanguageId: number, foreignLanguageId: number) {
    this.id = task.id;
    this.nativeLanguageId = nativeLanguageId;
    this.foreignLanguageId = foreignLanguageId;
    this.type = task.type;
    this.status = task.status;
    this.hiddenWord = hiddenWord;
    this.correctAnswers = task.correctAnswers as string[];
    this.receivedAnswer = task.receivedAnswer as string;
    this.createdAt = task.createdAt;
  }
}
