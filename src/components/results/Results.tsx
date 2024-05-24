import { MouseEvent } from "react";
import styled from "styled-components";
import { useScoreContext, useSessionContext } from "../../contexts";
import { resetCookies } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { BarChart, LineChart, PieChart } from "./charts";

export function Results() {
  const navigate = useNavigate();
  const { playerName } = useSessionContext();
  const { score, playedCategories, totalTimeSpent, timeSpentPerQuestion } =
    useScoreContext();
  const wrongAnswers = playedCategories.reduce(
    (accumlator, { wrongAnswers }) => wrongAnswers + accumlator,
    0
  );
  const skipped = playedCategories.reduce(
    (accumlator, { skippedQuestions }) => skippedQuestions + accumlator,
    0
  );

  const correctAnswersArray = playedCategories.map(
    ({ correctAnswers }) => correctAnswers
  );

  const wrongAnswersArray = playedCategories.map(
    ({ wrongAnswers }) => -wrongAnswers
  );

  const skippedQuestions = playedCategories.map(
    ({ skippedQuestions }) => -skippedQuestions
  );

  function onNewGame(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    resetCookies();
    navigate("/");
    location.reload();
  }

  const minutes = Math.floor(totalTimeSpent / 60);
  const remainingSeconds = totalTimeSpent % 60;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  const time = `${paddedMinutes}m : ${paddedSeconds}s`;

  return (
    <Container>
      Player Name: {playerName}
      <ContainerGrid>
        <Card>
          <h2>Time</h2>
          <h1>{time}</h1>
        </Card>
        <Card>
          <PieChart
            title="Answers"
            data={[
              { name: "Correct", value: score / 10 },
              { name: "Wrong", value: wrongAnswers },
              { name: "Skipped", value: skipped },
            ]}
          />
        </Card>
        <Card>
          <BarChart
            data={[
              {
                name: playedCategories[0].name?.substring(0, 10),
                data: correctAnswersArray,
              },
              {
                name: playedCategories[1].name?.substring(0, 10),
                data: wrongAnswersArray,
              },
              {
                name: playedCategories[2].name?.substring(0, 10),
                data: skippedQuestions,
              },
            ]}
            title="Answers"
            xaxisLabel="Categories"
            yaxisLabel="Values"
          />
        </Card>
        <Card>
          <LineChart
            data={[{ name: "Time Per Answer", data: timeSpentPerQuestion }]}
            title="Time Spent Per Question"
            xaxisLabel="Time"
            yaxisLabel="seconds"
          />
        </Card>
      </ContainerGrid>
      <BtnContainer>
        <Button onClick={onNewGame}>New Game</Button>
      </BtnContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 3rem;
  height: 100vh;
`;
const ContainerGrid = styled.div`
  display: grid;
  gap: 2rem;
  height: 80%;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    height: auto;
    gap: 0;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  border: 1px solid;
  outline: none;
  margin-top: 1rem;
  background-color: ${(props) => props.theme.base100};
  color: black;
  &:hover {
    background-color: ${(props) => props.theme.base};
  }
  @media (max-width: 768px) {
    padding: 0.5 0;
    h1 {
      font-size: x-large;
    }

    h2 {
      font-size: large;
    }
  }
`;

const Button = styled.button<{ selected?: boolean }>`
  border-radius: 0.5rem;
  border: 1px solid;
  outline: none;
  padding: 0.5rem 0;
  cursor: pointer;
  margin-top: 2rem;
  width: 9rem;
  height: 4rem;
  background-color: ${(props) =>
    props.selected ? props.theme.base200 : props.theme.base100};
  color: black;
  &:hover {
    background-color: ${(props) =>
      props.selected ? props.theme.base200 : props.theme.base};
  }
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
