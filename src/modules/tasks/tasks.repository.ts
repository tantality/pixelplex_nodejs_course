import { DeepPartial } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskData } from './types';

export class TasksRepository {
  static create = async (taskData: CreateTaskData): Promise<Task> => {
    const createdTask = Task.create(taskData as DeepPartial<Task>);
    const savedTask = await Task.save(createdTask);

    return savedTask;
  };
}
