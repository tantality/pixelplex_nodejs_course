export type WithBaseQuery = {
  search?: string;
  offset: number;
  limit: number;
  sortDirection: string;
  sortBy: string;
};

export type BaseQueyWithLanguageId = WithBaseQuery & { languageId?: number | string };
