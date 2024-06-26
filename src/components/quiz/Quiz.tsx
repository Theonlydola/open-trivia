import { useEffect, useState, MouseEvent } from "react";
import { DIFFICULTY, useScoreContext, useSessionContext } from "../../contexts";
import { IQuestion, useFetchQuestions } from "../../queries";
import styled from "styled-components";
import { Question } from "./Question";
import { ErrorPage, Loading } from "../common";
import { IAnswer } from "./Quiz.types";
import { useNavigate } from "react-router-dom";

export function Quiz() {
  const navigate = useNavigate();
  const ScoreContext = useScoreContext();
  const { sessionToken, difficulty } = useSessionContext();
  const {
    maxQuestions,
    playedCategories,
    score,
    timeSpentPerQuestion,
    totalTimeSpent,
    maxCategories,
    onScoreChange,
  } = ScoreContext;

  const shouldFetchQuestions =
    maxQuestions &&
    sessionToken &&
    difficulty &&
    playedCategories[playedCategories?.length - 1];

  const { data, status } = useFetchQuestions(
    {
      amount: maxQuestions,
      token: sessionToken,
      category: playedCategories[playedCategories?.length - 1].id,
      difficulty: difficulty as DIFFICULTY,
    },
    {
      onError: (e) => console.log(e.message),
      refetchOnWindowFocus: false,
      enabled: !!shouldFetchQuestions,
    }
  );

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<IQuestion[] | undefined>();
  const [shouldReset, setShouldReset] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setQuestions(data?.results);
    }
  }, [data?.results, status]);

  function proceed() {
    if (!questions) return;
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
    else {
      if (playedCategories.length >= maxCategories - 1) navigate("/results");
      else navigate("/categories");
    }
  }

  function onCountdownReset(elapsedTime: number) {
    onScoreChange?.("timeSpentPerQuestion", [
      ...timeSpentPerQuestion,
      elapsedTime,
    ]);
    onScoreChange?.("totalTimeSpent", totalTimeSpent + elapsedTime);
  }

  function onCountdownFinished(elapsedTime: number) {
    const currentCategory = playedCategories.pop();
    onScoreChange?.("playedCategories", [
      ...playedCategories,
      {
        ...currentCategory,
        skippedQuestions: (currentCategory?.skippedQuestions || 0) + 1,
      },
    ]);
    onScoreChange?.("timeSpentPerQuestion", [
      ...timeSpentPerQuestion,
      elapsedTime,
    ]);
    onScoreChange?.("totalTimeSpent", totalTimeSpent + elapsedTime);
    proceed();
  }

  function onAnswer(answer: IAnswer) {
    const currentCategory = playedCategories.pop();
    if (answer === "correct") {
      onScoreChange?.("score", score + 10);
      onScoreChange?.("playedCategories", [
        ...playedCategories,
        {
          ...currentCategory,
          correctAnswers: (currentCategory?.correctAnswers || 0) + 1,
        },
      ]);
    } else {
      onScoreChange?.("playedCategories", [
        ...playedCategories,
        {
          ...currentCategory,
          wrongAnswers: (currentCategory?.wrongAnswers || 0) + 1,
        },
      ]);
    }
    proceed();
  }

  function onSkip(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setShouldReset(true);
    const currentCategory = playedCategories.pop();
    onScoreChange?.("playedCategories", [
      ...playedCategories,
      {
        ...currentCategory,
        skippedQuestions: (currentCategory?.skippedQuestions || 0) + 1,
      },
    ]);
    proceed();
  }

  function onNext(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!questions) return;
    setShouldReset(true);
    const [removedItem] = questions.splice(currentQuestion, 1);
    questions.push(removedItem);
    setQuestions([...questions]);
  }

  window.onbeforeunload = function () {
    return "Category progress will be lost if you leave the page, are you sure?";
  };

  if (status === "loading" || !questions) return <Loading />;
  if (status === "error") return <ErrorPage />;

  return (
    <Container>
      {questions && (
        <Question
          question={questions[currentQuestion]}
          onAnswer={onAnswer}
          shouldReset={shouldReset}
          onChangeShouldReset={setShouldReset}
          onCountdownFinished={onCountdownFinished}
          onCountdownReset={onCountdownReset}
        />
      )}
      <BtnsGrid>
        <Button onClick={onSkip}>Skip</Button>
        <Button
          disabled={currentQuestion === questions.length - 1}
          onClick={onNext}
        >
          Next
        </Button>
      </BtnsGrid>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 5rem 2rem;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: none;
    justify-content: start;
  }
`;

const BtnsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid;
  outline: none;
  padding: 1rem 2rem;
  cursor: pointer;
  text-transform: capitalize;
  margin-top: 1rem;
  background-color: ${(props) => props.theme.base100};
  color: black;
  &:hover {
    background-color: ${(props) => props.theme.base};
  }
  &:disabled {
    color: gray;
    transform: none;
    cursor: auto;
    &:hover {
      background-color: ${(props) => props.theme.base100};
    }
  }
`;
