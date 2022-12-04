import { TaskDTO } from './task.dto';
import { Task } from './task.entity';

const TASK = new Task(1, 1, 'to_foreign', 'correct', ['привет'], 'привет', new Date(), new Date());
export const TASK_DTO = new TaskDTO(TASK, 'hello', 1, 2);
