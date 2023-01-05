export type GetTasksQuery = {
  search?: string;
  offset: number;
  limit: number;
  sortDirection: string;
  sortBy: string;
  languageId?: number;
  taskStatus?: string;
};

export type GetStatisticsQuery = { fromDate?: Date; toDate?: Date; languageIds?: number[] };
