import { DeepPartial, FindOptionsOrderValue, FindOptionsWhere } from 'typeorm';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { CreateTaskData, TaskIdWithWordData } from './types';
import { getTasksAndTheirNumber } from './utils';

export class TasksRepository {
  static findAndCountAll = async (
    skip: number,
    take: number,
    sortDirection: string,
    whereCondition: FindOptionsWhere<Task>[],
  ): Promise<{ count: number; tasks: TaskDTO[] }> => {
    const tasksAndTheirNumberQueryResult = await Task.findAndCount({
      select: {
        id: true,
        type: true,
        status: true,
        hiddenWord: {
          value: true,
          card: {
            nativeLanguageId: true,
            foreignLanguageId: true,
          },
        },
        correctAnswers: true,
        receivedAnswer: true,
        createdAt: true,
      },
      relations: {
        hiddenWord: {
          card: true,
        },
      },
      where: whereCondition,
      order: {
        createdAt: sortDirection as FindOptionsOrderValue,
      },
      skip,
      take,
    });

    return getTasksAndTheirNumber(tasksAndTheirNumberQueryResult);
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Task>): Promise<Task | null> => {
    const task = await Task.findOneBy(whereCondition);
    return task;
  };

  static findOneForDTO = async (id: number): Promise<TaskIdWithWordData | null> => {
    const task = await Task.createQueryBuilder('task')
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
