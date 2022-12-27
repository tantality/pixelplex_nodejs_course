import { TASK_STATUS } from '../types';

export const getTaskStatus = (correctAnswers: string[], receivedAnswer: string): string => {
  const isReceivedAnswerCorrect = correctAnswers.includes(receivedAnswer);
  if (isReceivedAnswerCorrect) {
    return TASK_STATUS.CORRECT;
  } else {
    return TASK_STATUS.INCORRECT;
  }
};