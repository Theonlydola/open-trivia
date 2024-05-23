import { IQuestion } from "../../queries";

export type IAnswer = "correct" | "incorrect";

export type IQuestionProps = {
  question: IQuestion;
  onAnswer: (answer: IAnswer) => void;
  onCountdownReset: (elapsedTime: number) => void;
  onCountdownFinished: (elapsedTime: number) => void;
};
