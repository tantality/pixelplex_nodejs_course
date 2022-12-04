import { ITask } from './task.interface';

let taskCounter = 1;

export class Task implements ITask {
  id: number;

  constructor(
    public readonly userId: number,
    public readonly hiddenWordId: number,
    public readonly type: string,
    public readonly status: string,
    public readonly correctAnswers: string[] | null,
    public readonly receivedAnswer: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = taskCounter;
    taskCounter += 1;
  }
}
