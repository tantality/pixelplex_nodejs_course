import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskData, TaskIdWithWordData } from './types';

export class TasksRepository {
  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await Task.findOneBy(whereCondition);
    return task;
  };

  static findOneForDTO = async (id: number): Promise<TaskIdWithWordData | null> => {
    const task: TaskIdWithWordData | null = await Task.createQueryBuilder('task')
      .select(['task.id', 'card.nativeLanguageId', 'card.foreignLanguageId', 'word.value'])
      .leftJoin('task.hiddenWord', 'word')
      .leftJoin('word.card', 'card')
      .where('task.id=:id', { id })
      .getOne();

    return task;
  };

  static create = async (taskData: CreateTaskData): Promise<Task> => {
    const createdTask = Task.create(taskData as DeepPartial<Task>);
    const savedTask = await Task.save(createdTask);

    return savedTask;
  };

  static update = async (id: number, correctAnswers: string[], receivedAnswer: string, status: string): Promise<Task> => {
    await Task.update({ id }, { correctAnswers, receivedAnswer, status });

    const updatedTask = (await TasksRepository.findOneByCondition({ id })) as Task;

    return updatedTask;
  };
}
