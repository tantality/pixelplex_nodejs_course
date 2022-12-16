import { LanguageDTO } from '../../languages/language.dto';
import { TaskDTO } from '../task.dto';

export type GetStatisticsCommon = { language: LanguageDTO; answers: { correct: number; incorrect: number } }[];
export type CreateTaskCommon = Pick<TaskDTO, 'id' | 'nativeLanguageId' | 'foreignLanguageId' | 'type'> & { word: string };
