import { CarIcon } from "../GameAssets";
import { AnimatedChicken } from "../AnimatedChicken";
import "./index.css";

export function GameArea({ multipliers, currentLane = 0, gameState = "idle", onLaneClick }) {
  return (
    <div className="game-area">
      {/* Left sidebar - Stats panel */}
      <div className="stats-sidebar">
        <div className="stats-panel">
          <div className="stat-item">
            <span className="stat-label">Live wins</span>
          </div>
          <div className="stat-item online">
            <span className="online-indicator"></span>
            <span className="stat-label">Online: 11615</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <img src="/logo.png" alt="User" />
            </div>
            <span className="username">Turquoise Ch...</span>
          </div>
        </div>
      </div>

      {/* Main game field - vertical layout */}
      <div className="game-field">
        {/* Top decoration - trees and grass */}
        <div className="top-decoration">
          <div className="grass"></div>
          <div className="tree">🌳</div>
        </div>

        {/* Vertical road with horizontal lanes */}
        <div className="road-vertical">
          {/* Road lanes from top to bottom (multipliers reversed) */}
          {[...multipliers].reverse().map((multiplier, index) => {
            const actualLaneIndex = multipliers.length - 1 - index;
            const isCurrentLane = actualLaneIndex === currentLane;
            const isPassed = actualLaneIndex < currentLane;
            const isNext = actualLaneIndex === currentLane + 1;
            const isClickable = gameState === "playing" && isNext;

            return (
              <div
                key={index}
                className={`lane-horizontal ${isClickable ? "clickable" : ""} ${isCurrentLane ? "current" : ""} ${isPassed ? "passed" : ""}`}
                onClick={() => isClickable && onLaneClick(actualLaneIndex)}
              >
                <div className="lane-divider-horizontal"></div>
                <div
                  className={`multiplier-circle ${isCurrentLane ? "active" : ""} ${isPassed ? "completed" : ""}`}
                >
                  <div className="inner-circle">
                    <span>{multiplier}x</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Car moving horizontally across lanes */}
          <div className={`car-container-moving ${gameState === "lost" ? "crash" : ""}`}>
            <CarIcon />
          </div>

          {/* Show chicken on current lane when playing */}
          {gameState === "playing" && currentLane > 0 && (
            <div
              className="chicken-on-lane"
              style={{
                bottom: `${(currentLane / multipliers.length) * 100}%`,
              }}
            >
              <AnimatedChicken animation="idle" />
            </div>
          )}
        </div>

        {/* Bottom - Chicken starting position */}
        <div className="bottom-section">
          <div className="grass bottom-grass"></div>
          <div className={`chicken-position ${gameState === "lost" ? "dead" : ""} ${gameState === "won" ? "celebrating" : ""}`}>
            <AnimatedChicken animation="idle" />
          </div>
          {gameState === "lost" && (
            <div className="game-message lost">Game Over!</div>
          )}
          {gameState === "won" && (
            <div className="game-message won">You Won!</div>
          )}
        </div>
      </div>
    </div>
  );
}
