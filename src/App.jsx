import { useState, useCallback, useRef } from "react";
import "./App.css";
import { Header, GameArea, ControlPanel } from "./components";

export default function App() {
  const [balance, setBalance] = useState(1000000);
  const [betAmount, setBetAmount] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy"); // Easy, Medium, Hard, Hardcore
  const [gameState, setGameState] = useState("idle"); // idle, playing, won, lost
  const [score, setScore] = useState(0);
  const [jumpChickenFn, setJumpChickenFn] = useState(null);
  const scrollContainerRef = useRef(null);

  // Handle when jump function is ready from game
  const handleJumpReady = useCallback((jumpFn) => {
    setJumpChickenFn(() => jumpFn);
  }, []);

  // Handle play/go button click
  const handlePlay = useCallback(() => {
    if (gameState === "idle") {
      // Start new game
      if (balance < betAmount) {
        alert("Insufficient balance!");
        return;
      }
      setBalance((prev) => prev - betAmount);
      setGameState("playing");
      setScore(0);

      // Automatically jump to first road line when game starts
      if (jumpChickenFn) {
        setTimeout(() => {
          const success = jumpChickenFn();
          if (success) {
            setScore(1); // First jump counts as score
          }
        }, 100); // Small delay to ensure game state is updated
      }
    } else if (gameState === "playing") {
      // Jump chicken
      if (jumpChickenFn) {
        const success = jumpChickenFn();
        if (success) {
          setScore((prev) => prev + 1);
        }
      }
    }
  }, [gameState, betAmount, balance, jumpChickenFn]);

  return (
    <div className="app-container">
      <Header balance={balance} />
      <GameArea
        onJumpReady={handleJumpReady}
        scrollContainerRef={scrollContainerRef}
      />
      <ControlPanel
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onPlay={handlePlay}
        gameState={gameState}
        score={score}
        disabled={gameState === "playing"}
      />
    </div>
  );
}
