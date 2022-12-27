import { ITask } from '.';

export type CreateTaskBody = Pick<ITask, 'type'> & { foreignLanguageId: number };
export type UpdateTaskBody = { answer: string };
