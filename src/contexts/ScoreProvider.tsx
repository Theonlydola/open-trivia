import { ReactNode, createContext, useEffect, useState } from "react";
import { CookieNameOptions, getObjectCookie, setCookie } from "../helpers";
import { useNavigate } from "react-router-dom";

type IScore = {
  playedCategories: number[];
  score: number;
  wrongAnswers: number;
  skipped: number;
  maxCategories: number;
  maxQuestions: number;
  totalTimeSpent: number;
  onScoreChange?: (entity: keyof IScore, value: unknown) => void;
};

export const ScoreContext = createContext<IScore>({
  playedCategories: [],
  score: 0,
  wrongAnswers: 0,
  skipped: 0,
  maxCategories: 3,
  maxQuestions: 3,
  totalTimeSpent: 0,
});

export function ScoreProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const obj: IScore = getObjectCookie(CookieNameOptions.score);
  const _score: IScore = {
    playedCategories: obj?.playedCategories || [],
    score: obj?.score || 0,
    wrongAnswers: obj?.wrongAnswers || 0,
    skipped: obj?.skipped || 0,
    totalTimeSpent: obj?.totalTimeSpent || 0,
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
