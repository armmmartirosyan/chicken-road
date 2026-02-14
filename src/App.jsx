import { useState, useCallback } from "react";
import "./App.css";
import { Header, GameArea, ControlPanel } from "./components";

export default function App() {
  const [balance, setBalance] = useState(1000000);
  const [betAmount, setBetAmount] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy");
  const [gameState, setGameState] = useState("idle"); // idle, playing, won, lost
  const [currentLane, setCurrentLane] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [multipliers] = useState([1.01, 1.03, 1.06, 1.1, 1.15, 1.19]);

  // Get crash probability based on difficulty
  const getCrashProbability = useCallback(() => {
    const probabilities = {
      Easy: 0.15,
      Medium: 0.3,
      Hard: 0.5,
      Hardcore: 0.75,
    };
    return probabilities[difficulty] || 0.15;
  }, [difficulty]);

  // Handle play button click
  const handlePlay = useCallback(() => {
    if (gameState === "playing") {
      // Cashout
      const winAmount = betAmount * currentMultiplier;
      setBalance((prev) => prev + winAmount);
      setGameState("won");
      setTimeout(() => {
        setGameState("idle");
        setCurrentLane(0);
        setCurrentMultiplier(1);
      }, 2000);
    } else {
      // Start new game
      if (balance < betAmount) {
        alert("Insufficient balance!");
        return;
      }
      setBalance((prev) => prev - betAmount);
      setGameState("playing");
      setCurrentLane(0);
      setCurrentMultiplier(1);
    }
  }, [gameState, betAmount, currentMultiplier, balance]);

  // Handle lane click to move chicken
  const handleLaneClick = useCallback(
    (laneIndex) => {
      if (gameState !== "playing") return;
      if (laneIndex !== currentLane + 1) return; // Can only move to next lane

      const crashProb = getCrashProbability();
      const crashed = Math.random() < crashProb;

      if (crashed) {
        // Game over - hit by car
        setGameState("lost");
        setTimeout(() => {
          setGameState("idle");
          setCurrentLane(0);
          setCurrentMultiplier(1);
        }, 2000);
      } else {
        // Successfully moved to next lane
        const newLane = laneIndex;
        const newMultiplier = multipliers
          .slice(0, newLane + 1)
          .reduce((acc, m) => acc * m, 1);
        setCurrentLane(newLane);
        setCurrentMultiplier(newMultiplier);

        // Auto cashout if reached the top
        if (newLane === multipliers.length - 1) {
          setTimeout(() => {
            const winAmount = betAmount * newMultiplier;
            setBalance((prev) => prev + winAmount);
            setGameState("won");
            setTimeout(() => {
              setGameState("idle");
              setCurrentLane(0);
              setCurrentMultiplier(1);
            }, 2000);
          }, 500);
        }
      }
    },
    [gameState, currentLane, getCrashProbability, multipliers, betAmount],
  );

  return (
    <div className="app-container">
      <Header balance={balance} />
      <GameArea
        multipliers={multipliers}
        currentLane={currentLane}
        gameState={gameState}
        onLaneClick={handleLaneClick}
      />
      <ControlPanel
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onPlay={handlePlay}
        gameState={gameState}
        currentMultiplier={currentMultiplier}
        disabled={gameState === "playing"}
      />
    </div>
  );
}
