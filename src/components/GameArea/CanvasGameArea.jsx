import { useRef, useEffect } from "react";
import { useGame } from "../../hooks";
import { getDefaultConfig } from "../../config/gameConfig";
import "./CanvasGameArea.css";

/**
 * CanvasGameArea - Main game canvas component
 * Uses the new game architecture with separated game loop
 */
export function CanvasGameArea({ onJumpReady, scrollContainerRef }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Pass containerRef to parent for scroll control
  useEffect(() => {
    if (containerRef.current && scrollContainerRef) {
      scrollContainerRef.current = containerRef.current;
    }
  }, [scrollContainerRef]);

  // Initialize game with default configuration
  const config = getDefaultConfig();
  const { isLoading, jumpChicken } = useGame(canvasRef, config, containerRef);

  // Notify parent when jump function is ready
  useEffect(() => {
    if (!isLoading && jumpChicken && onJumpReady) {
      onJumpReady(jumpChicken);
    }
  }, [isLoading, jumpChicken, onJumpReady]);

  // Handle mouse drag scrolling directly on the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = "grab";
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="canvas-game-container">
      {isLoading && (
        <div className="game-loading">
          <p>Loading game assets...</p>
        </div>
      )}
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
}
