import { useState, useEffect } from "react";

type ICountdownProps = {
  targetTimeInMinutes: number;
  onReset?: (elapsedTimeInMinutes: number) => void;
  onFinish?: (elapsedTimeInMinutes: number) => void;
  shouldReset?: boolean;
};

export function Countdown({
  targetTimeInMinutes,
  onReset,
  onFinish,
  shouldReset,
}: ICountdownProps) {
  const [countDown, setCountDown] = useState(targetTimeInMinutes * 60000);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountDown((prevCountDown) => {
        const newCountDown = Math.max(prevCountDown - 1000, 0);
        setElapsedTime(elapsedTime + 1);
        if (newCountDown === 0) {
          if (onFinish) onFinish(elapsedTime);
        }
        return newCountDown;
      });
    }, 1000);

    if (shouldReset) {
      clearInterval(intervalId);
      onReset?.(elapsedTime);
      setElapsedTime(0);
      setCountDown(targetTimeInMinutes * 60000);
    }

    return () => clearInterval(intervalId);
  }, [targetTimeInMinutes, onReset, shouldReset, elapsedTime, onFinish]);

  const minutes = Math.floor(countDown / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const timeDisplay =
    minutes > 0
      ? `${minutes.toString().padStart(2, "0")}m ${seconds
          .toString()
          .padStart(2, "0")}s`
      : `${seconds.toString().padStart(2, "0")}s`;

  return (
    <div>
      {countDown > 0 ? <p>{timeDisplay}</p> : <p>Countdown Finished!</p>}
    </div>
  );
}
