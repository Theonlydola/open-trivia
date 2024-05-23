import { ChangeEvent, MouseEvent } from "react";
import styled from "styled-components";
import { DIFFICULTY, useSessionContext } from "../../contexts";

export function Home() {
  const {
    playerName,
    difficulty,
    onDifficultyChange,
    onPlayerNameChange,
    onSaveSession,
  } = useSessionContext();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    onPlayerNameChange?.(event.target.value);
  }

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onDifficultyChange?.(event.currentTarget.name as DIFFICULTY);
  }

  async function onSubmit() {
    onSaveSession?.();
  }

  return (
    <Container>
      <InfoCard>
        <TextInput
          required
          name="playerName"
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={onChange}
        />
        <BtnsContainer>
          <Button
            name={DIFFICULTY.EASY}
            onClick={onClick}
            selected={difficulty === DIFFICULTY.EASY}
          >
            Easy
          </Button>
          <Button
            name={DIFFICULTY.MEDIUM}
            onClick={onClick}
            selected={difficulty === DIFFICULTY.MEDIUM}
          >
            Medium
          </Button>
          <Button
            name={DIFFICULTY.HARD}
            onClick={onClick}
            selected={difficulty === DIFFICULTY.HARD}
          >
            Hard
          </Button>
        </BtnsContainer>
        <Button disabled={!difficulty || !playerName} onClick={onSubmit}>
          Play
        </Button>
      </InfoCard>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border-radius: 16px;
  padding: 3rem;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: none;
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #d9d9d9;
  align-items: center;
  border-radius: 16px;
  padding: 3rem;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BtnsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TextInput = styled.input`
  width: 100%;
  height: 2rem;
  padding: 0.5rem;
  outline: 0;
  border: 2px solid white;
  border-radius: 0.5rem;
  line-height: 2rem;
  background-color: ${(props) => props.theme.base};
  color: black;
`;

const Button = styled.button<{ selected?: boolean }>`
  border-radius: 0.5rem;
  border: 1px solid;
  outline: none;
  padding: 0.5rem 0;
  cursor: pointer;
  margin-top: 1rem;
  width: 6rem;
  height: 3rem;
  background-color: ${(props) =>
    props.selected ? props.theme.base200 : props.theme.base100};
  color: black;
  &:hover {
    background-color: ${(props) =>
      props.selected ? props.theme.base200 : props.theme.base};
  }
  &:disabled {
    color: gray;
    cursor: auto;
  }
`;
