import { useState, useEffect } from "react";
import "./index.css";

export function ControlPanel({
  betAmount,
  setBetAmount,
  difficulty,
  setDifficulty,
  onPlay,
  gameState = "idle",
  currentMultiplier = 1,
  disabled = false,
}) {
  const [sliderValue, setSliderValue] = useState(1);

  const betOptions = [0.5, 1, 2, 7];
  const difficultyLevels = ["Easy", "Medium", "Hard", "Hardcore"];

  // Sync slider value with bet amount
  useEffect(() => {
    setSliderValue(betAmount);
  }, [betAmount]);

  const handleSliderChange = (value) => {
    const newValue = parseFloat(value);
    setSliderValue(newValue);
    setBetAmount(newValue);
  };

  const isPlaying = gameState === "playing";
  const buttonText = isPlaying ? "Cashout" : "Play";
  const potentialWin = (betAmount * currentMultiplier).toFixed(2);

  return (
    <div className="control-panel">
      <div className="control-panel-content">
        {/* Bet Amount and Slider Section */}
        <div className="bet-section">
          <div className="slider-container">
            <button
              className="slider-label"
              onClick={() => !disabled && handleSliderChange(0.1)}
              disabled={disabled}
            >
              MIN
            </button>
            <div className="slider-wrapper">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={sliderValue}
                onChange={(e) => handleSliderChange(e.target.value)}
                className="slider"
                disabled={disabled}
              />
              <div className="slider-value">{sliderValue.toFixed(1)}</div>
            </div>
            <button
              className="slider-label"
              onClick={() => !disabled && handleSliderChange(10)}
              disabled={disabled}
            >
              MAX
            </button>
          </div>

          <div className="bet-buttons">
            {betOptions.map((amount) => (
              <button
                key={amount}
                className={`bet-button ${betAmount === amount ? "active" : ""}`}
                onClick={() => !disabled && setBetAmount(amount)}
                disabled={disabled}
              >
                {amount} 💲
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="difficulty-section">
          <div className="section-header">
            <span>Difficulty</span>
          </div>
          <div className="difficulty-buttons">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                className={`difficulty-button ${difficulty === level ? "active" : ""}`}
                onClick={() => !disabled && setDifficulty(level)}
                disabled={disabled}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Chance Indicator */}
        <div className="chance-section">
          <div className="section-header">
            <span>
              {isPlaying
                ? `Current Win: ${potentialWin} 💲`
                : "Chance of being shot down"}
            </span>
          </div>
          <div className="chance-bar">
            <div
              className={`chance-fill ${isPlaying ? "playing" : ""}`}
              style={{
                width: isPlaying
                  ? "100%"
                  : difficulty === "Easy"
                    ? "20%"
                    : difficulty === "Medium"
                      ? "40%"
                      : difficulty === "Hard"
                        ? "60%"
                        : "80%",
              }}
            ></div>
          </div>
        </div>

        {/* Play Button */}
        <button
          className={`play-button ${isPlaying ? "cashout" : ""}`}
          onClick={onPlay}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
