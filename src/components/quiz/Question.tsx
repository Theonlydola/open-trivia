import { useEffect, useState, MouseEvent } from "react";
import styled from "styled-components";
import { IQuestionProps } from "./Quiz.types";

function getRandomInt() {
  return Math.floor(Math.random() * (3 - 0 + 1));
}

export function Question({
  question: { type, question, correct_answer, incorrect_answers },
  onAnswer,
}: IQuestionProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (type === "boolean") {
      setAllAnswers(["True", "False"]);
    } else {
      if (incorrect_answers?.length < 4) {
        const randomPos = getRandomInt();
        incorrect_answers.splice(randomPos, 0, correct_answer);
      }
      setAllAnswers(incorrect_answers);
    }
  }, [type, correct_answer, incorrect_answers]);

  useEffect(() => {
    if (answer) {
      if (answer === correct_answer) {
        onAnswer("correct");
      } else {
        onAnswer("incorrect");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setAnswer(event.currentTarget.name);
  }
  return (
    <>
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
