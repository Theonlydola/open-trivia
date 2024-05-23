import { useContext } from "react";
import { SessionContext } from "./SessionProvider";
import { ScoreContext } from "./ScoreProvider";

export function useSessionContext() {
  return useContext(SessionContext);
}

export function useScoreContext() {
  return useContext(ScoreContext);
}
