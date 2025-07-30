import { useState, useEffect } from "react";

interface UseCountUpProps {
  targetValue: number;
  duration?: number;
  startOnMount?: boolean;
  formatFn?: (value: number) => string;
  key?: string | number; // Add key property to force reset when dependencies change
}

/**
 * Custom hook for creating count-up animations
 * @param targetValue The final value to count up to
 * @param duration Duration of the animation in milliseconds (default: 2000ms)
 * @param startOnMount Whether to start the animation when the component mounts (default: true)
 * @param formatFn Optional function to format the displayed value
 * @returns Object containing the current count value and a function to restart the animation
 */
export function useCountUp({
  targetValue,
  duration = 2000,
  startOnMount = true,
  formatFn,
  key,
}: UseCountUpProps) {
  const [count, setCount] = useState(0);
  const [shouldStart, setShouldStart] = useState(startOnMount);

  // Function to restart the animation
  const startAnimation = () => {
    setCount(0);
    setShouldStart(true);
  };
  
  // Reset animation when key changes
  useEffect(() => {
    if (key !== undefined) {
      setCount(0);
      setShouldStart(true);
    }
  }, [key]);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsedTime = performance.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother animation (ease-in-out)
      const easeInOutQuad = (t: number) => 
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      const currentCount = Math.round(targetValue * easeInOutQuad(progress));
      setCount(currentCount);
      
      if (progress >= 1) {
        clearInterval(interval);
        setShouldStart(false);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [targetValue, duration, shouldStart]);

  // Format the count value if a format function is provided
  const displayValue = formatFn ? formatFn(count) : count;

  return { value: count, displayValue, startAnimation };
}

export default useCountUp;
