import { TaskDTO } from '../task.dto';

export type CreateTaskCommon = Pick<TaskDTO, 'id' | 'nativeLanguageId' | 'foreignLanguageId' | 'type'> & { word: string };
