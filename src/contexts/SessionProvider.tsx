import { ReactNode, createContext, useState } from "react";
import { CookieNameOptions, getCookie, setCookie } from "../helpers";
import { DIFFICULTY } from "./contexts.types";
import { useCreateSession } from "../queries";
import { useNavigate } from "react-router-dom";

type ISession = {
  playerName: string;
  difficulty: string;
  sessionToken: string | undefined;
  onPlayerNameChange?: (playerName: string) => void;
  onDifficultyChange?: (difficulty: DIFFICULTY) => void;
  onSessionTokenChange?: (token: string) => void;
  onSaveSession?: () => void;
};

export const SessionContext = createContext<ISession>({
  playerName: "",
  difficulty: DIFFICULTY.MEDIUM,
  sessionToken: "",
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [sessionToken, setSessionToken] = useState<string | undefined>(
    getCookie(CookieNameOptions.sessionToken)
  );
  const [playerName, setPlayerName] = useState<string>(
    getCookie(CookieNameOptions.playerName) as string
  );
  const [difficulty, setDifficulty] = useState<string>(
    getCookie(CookieNameOptions.difficulty) as DIFFICULTY
  );

  const createSession = useCreateSession({
    enabled: false,
    manual: true,
    onSuccess: (data) => {
      setSessionToken(data.token);
      setCookie({ name: CookieNameOptions.sessionToken, value: data.token });
      setCookie({
        name: CookieNameOptions.playerName,
        value: playerName as string,
      });
      setCookie({ name: CookieNameOptions.difficulty, value: difficulty });
      navigate("/categories");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const session = {
    playerName,
    difficulty,
    sessionToken,
    onPlayerNameChange,
    onDifficultyChange,
    onSessionTokenChange,
    onSaveSession,
  };

  function onPlayerNameChange(playerName: string) {
    setPlayerName(playerName);
  }

  function onDifficultyChange(difficulty: DIFFICULTY) {
    setDifficulty(difficulty);
  }

  function onSessionTokenChange(token: string) {
    setSessionToken(token);
  }

  async function onSaveSession() {
    if (playerName && difficulty) {
      createSession.fetchQuery("createSession");
    }
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
