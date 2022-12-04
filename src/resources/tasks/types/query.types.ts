import { BaseQueyWithLanguageId } from '../../../types';

export type GetTasksQuery = BaseQueyWithLanguageId & { taskStatus?: string };
export type GetStatisticsQuery = { fromDate?: Date; toDate?: Date; languagesIds?: number[] };
