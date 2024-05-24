export enum DIFFICULTY {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type IPlayedCategory = {
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  name: string;
  id: number;
};
