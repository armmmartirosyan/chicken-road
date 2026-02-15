import { useEffect, useRef } from "react";

/**
 * useResponsiveCanvas - Custom hook to make canvas responsive
 * Automatically resizes canvas to fit container while maintaining aspect ratio
 */
export function useResponsiveCanvas(
  canvasRef,
  containerRef,
  gameRef,
  options = {},
) {
  const resizeTimeoutRef = useRef(null);
  const {
    maintainAspectRatio = false,
    aspectRatio = 16 / 9,
    onResize = null,
  } = options;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const handleResize = () => {
      // Clear previous timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize to avoid too many updates
      resizeTimeoutRef.current = setTimeout(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        const containerRect = container.getBoundingClientRect();
        let width = containerRect.width;
        let height = containerRect.height;

        if (maintainAspectRatio) {
          const containerAspect = width / height;
          if (containerAspect > aspectRatio) {
            width = height * aspectRatio;
          } else {
            height = width / aspectRatio;
          }
        }

        // Update canvas display size (CSS)
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Notify game of resize if available
        const game = gameRef?.current;
        if (game && typeof game.resize === "function") {
          // Note: We don't change canvas.width/canvas.height here
          // because that would clear the canvas and affect world coordinates
          // The game will handle scaling if needed
        }

        // Call custom resize callback
        if (onResize) {
          onResize(width, height);
        }
      }, 100);
    };

    // Initial resize
    handleResize();

    // Setup resize observer for more accurate detection
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Fallback to window resize event
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    canvasRef,
    containerRef,
    gameRef,
    maintainAspectRatio,
    aspectRatio,
    onResize,
  ]);
}
