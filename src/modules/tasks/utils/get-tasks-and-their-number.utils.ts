import { TaskDTO } from '../task.dto';
import { Task } from '../task.entity';

const changeTasksStructure = (tasks: Task[]): TaskDTO[] => {
  const changedTasks: TaskDTO[] = [];

  tasks.forEach(
    ({
      id,
      userId,
      hiddenWord: {
        value,
        card: { nativeLanguageId, foreignLanguageId },
      },
      type,
      status,
      createdAt,
      correctAnswers,
      receivedAnswer,
    }) => {
      let task = {
        id,
        userId,
        hiddenWord: value,
        nativeLanguageId,
        foreignLanguageId,
        type,
        status,
        createdAt,
      } as TaskDTO;
      if (correctAnswers) {
        task = { ...task, correctAnswers, receivedAnswer };
      }

      changedTasks.push(task);
    },
  );

  return changedTasks;
};

export const getTasksAndTheirNumber = ([tasks, count]: [tasks: Task[], count: number]): { count:number; tasks:TaskDTO[] } => {
  if (!tasks.length) {
    return { count, tasks: [] };
  }

  return { count, tasks: changeTasksStructure(tasks) };
};
