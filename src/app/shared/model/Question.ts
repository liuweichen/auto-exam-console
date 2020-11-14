import { Answer } from './Answer';

export interface Question {
  id: number;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
  answerList: Answer[];
}
