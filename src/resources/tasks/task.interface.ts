export interface ITask {
  id: number;
  userId: number;
  hiddenWordId: number;
  type: string;
  status: string;
  correctAnswers: string[] | null;
  receivedAnswer: string | null;
  createdAt: Date;
  updatedAt: Date;
}
