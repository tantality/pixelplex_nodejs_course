import { TASK_STATUS } from '../types';

export const getAnswerStatus = (correctAnswers: string[], receivedAnswer: string): string => {
  const isReceivedAnswerCorrect = correctAnswers.includes(receivedAnswer);
  return isReceivedAnswerCorrect ? TASK_STATUS.CORRECT : TASK_STATUS.INCORRECT;
};
