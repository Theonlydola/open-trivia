import { ReactNode, createContext, useEffect, useState } from "react";
import { CookieNameOptions, getObjectCookie, setCookie } from "../helpers";

type IScore = {
  playedCategories: number[];
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
});

export function ScoreProvider({ children }: { children: ReactNode }) {
  const obj: IScore = getObjectCookie(CookieNameOptions.score);
  const _score: IScore = {
    playedCategories: obj?.["playedCategories"] || [],
    score: obj?.["score"] || 0,
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

  function onScoreChange(entity: keyof IScore, value: unknown) {
    setScore({ ...score, [entity]: value });
  }

  return (
    <ScoreContext.Provider value={score}>{children}</ScoreContext.Provider>
  );
}
