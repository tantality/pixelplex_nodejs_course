export type CreateCardBody = { nativeWords: string[]; foreignLanguageId: number; foreignWords: string[] };
export type UpdateCardBody = Partial<CreateCardBody>;
