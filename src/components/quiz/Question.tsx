import { useEffect, useState, MouseEvent } from "react";
import styled from "styled-components";
import { IQuestionProps } from "./Quiz.types";
import { Countdown } from "./Countdown";
import { DIFFICULTY } from "../../contexts";

function getRandomInt() {
  return Math.floor(Math.random() * (3 - 0 + 1));
}

const TIME_LIMIT = {
  [DIFFICULTY.EASY]: 1.5,
  [DIFFICULTY.MEDIUM]: 1,
  [DIFFICULTY.HARD]: 0.5,
};

export function Question({
  question: { difficulty, type, question, correct_answer, incorrect_answers },
  shouldReset,
  onAnswer,
  onChangeShouldReset,
  onCountdownReset,
  onCountdownFinished,
}: IQuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  difficulty === "easy";
  const [timer, setTimer] = useState(TIME_LIMIT[difficulty]);

  useEffect(() => {
    onChangeShouldReset(false);
    if (type === "boolean") {
      setAllAnswers(["True", "False"]);
    } else {
      if (incorrect_answers?.length < 4) {
        const randomPos = getRandomInt();
        incorrect_answers.splice(randomPos, 0, correct_answer);
      }
      setAllAnswers(incorrect_answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, correct_answer, incorrect_answers, difficulty]);

  useEffect(() => {
    if (!answer) return;
    if (answer === correct_answer) {
      onAnswer("correct");
    } else {
      onAnswer("incorrect");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onChangeShouldReset(true);
    setTimer(TIME_LIMIT[difficulty]);
    setAnswer(event.currentTarget.name);
  }

  function _onCountdownFinished(elapsedTime: number) {
    onChangeShouldReset(true);
    onCountdownFinished(elapsedTime);
  }

  return (
    <>
      <Countdown
        targetTimeInMinutes={timer}
        shouldReset={shouldReset}
        onReset={onCountdownReset}
        onFinish={_onCountdownFinished}
      />
      {/* Bad Security Practice but, easiest to allow HTML entities in strings */}
      <H2 dangerouslySetInnerHTML={{ __html: `${question}` }} />
      <AnswersGrid>
        {allAnswers.map((answer, index) => (
          <AnswerCell key={`answer-${index}`} name={answer} onClick={onClick}>
            {answer}
          </AnswerCell>
        ))}
      </AnswersGrid>
    </>
  );
}

const H2 = styled.h2`
  text-align: center;
  min-height: 10%;
  padding: 0rem 8rem;
  @media (max-width: 768px) {
    min-height: 30%;
    padding: 0rem;
  }
`;

const AnswersGrid = styled.div`
  display: grid;
  min-height: 20%;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  @media (max-width: 768px) {
    min-height: 30%;
  }
`;

const AnswerCell = styled.button<{ selected?: boolean }>`
  min-width: 12rem;
  padding: 1rem 2rem;
  background-color: ${(props) =>
    props.selected ? props.theme.base200 : props.theme.base100};
  color: black;
  border-radius: 8px;
  text-align: center;
  text-transform: capitalize;
  cursor: pointer;
  &:disabled {
    color: gray;
    transform: none;
    cursor: auto;
    &:hover {
      background-color: ${(props) => props.theme.base100};
    }
  }
  &:hover {
    background-color: ${(props) =>
      props.selected ? props.theme.base200 : props.theme.base};
  }
  @media (max-width: 768px) {
    min-width: 8rem;
    padding: 1rem 0.5rem;
  }
`;
