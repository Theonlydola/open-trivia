import { ReactNode, createContext, useEffect, useState } from "react";
import { CookieNameOptions, getObjectCookie, setCookie } from "../helpers";
import { useNavigate } from "react-router-dom";
import { IPlayedCategory } from "./contexts.types";

type IScore = {
  playedCategories: IPlayedCategory[];
  totalTimeSpent: number;
  timeSpentPerQuestion: number[];
  score: number;
  maxCategories: number;
  maxQuestions: number;
  onScoreChange?: (entity: keyof IScore, value: unknown) => void;
};

export const ScoreContext = createContext<IScore>({
  playedCategories: [],
  score: 0,
  maxCategories: 3,
  maxQuestions: 3,
  totalTimeSpent: 0,
  timeSpentPerQuestion: [],
});

export function ScoreProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const cookieObj: IScore = getObjectCookie(CookieNameOptions.score);
  const _score: IScore = {
    playedCategories: cookieObj?.playedCategories || [],
    score: cookieObj?.score || 0,
    totalTimeSpent: cookieObj?.totalTimeSpent || 0,
    timeSpentPerQuestion: cookieObj?.timeSpentPerQuestion || [],
    maxCategories: 3,
    maxQuestions: 3,
    onScoreChange,
  };

  const [score, setScore] = useState<IScore>(_score);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onScoreChange, ...restScore } = score;
    setCookie({
      name: CookieNameOptions.score,
      value: JSON.stringify(restScore),
    });
  }, [score]);

  useEffect(() => {
    if (score.playedCategories.length >= score.maxCategories)
      navigate("/results");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onScoreChange(entity: keyof IScore, value: unknown) {
    setScore((prevState) => ({ ...prevState, [entity]: value }));
  }

  return (
    <ScoreContext.Provider value={score}>{children}</ScoreContext.Provider>
  );
}
