import { TaskDTO } from './task.dto';
import { Task } from './task.entity';

export enum TASK_STATUS {
  UNANSWERED = 'unanswered',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export enum TASK_TYPE {
  TO_NATIVE = 'to_native',
  TO_FOREIGN = 'to_foreign',
}

const TASK = new Task(1, 1, 'to_foreign', 'correct', ['привет'], 'привет', new Date(), new Date());
export const TASK_DTO = new TaskDTO(TASK, 'hello', 1, 2);
