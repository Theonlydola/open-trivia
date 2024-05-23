import { MouseEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useScoreContext, useSessionContext } from "../../contexts";
import { useFetchCategories } from "../../queries";
import { useNavigate } from "react-router-dom";
import { ErrorPage, Loading } from "../common";

export function Categories() {
  const navigate = useNavigate();
  const { sessionToken } = useSessionContext();
  const { data: categories, status } = useFetchCategories({
    enabled: !!sessionToken,
  });
  const { playedCategories, onScoreChange } = useScoreContext();
  const [currentCategory, setCurrentCategory] = useState<number>(-1);

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentCategory(+event.currentTarget.name);
  }

  function onSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onScoreChange?.("playedCategories", [...playedCategories, currentCategory]);
    navigate("/quiz");
  }

  useEffect(() => {
    return () => {
      setCurrentCategory(-1);
    };
  }, []);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorPage />;

  return (
    <Container>
      <h1>Questions Categories</h1>
      <CategoriesGrid>
        {categories?.trivia_categories.map(({ id, name }) => (
          <CategoryCell
            key={id}
            name={String(id)}
            onClick={onClick}
            selected={currentCategory === id}
            disabled={playedCategories?.includes(id)}
          >
            {name}
          </CategoryCell>
        ))}
      </CategoriesGrid>
      <Button onClick={onSubmit} disabled={currentCategory === -1}>
        START
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: none;
    h1 {
      font-size: x-large;
    }
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCell = styled.button<{ selected?: boolean }>`
  padding: 2rem;
  background-color: ${(props) =>
    props.selected ? props.theme.base200 : props.theme.base100};
  color: black;
  border-radius: 8px;
  text-align: center;
  text-overflow: ellipsis;
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
    padding: 1rem;
  }
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid;
  outline: none;
  padding: 2rem;
  cursor: pointer;
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
