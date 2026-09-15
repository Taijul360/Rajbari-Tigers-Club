import { useEffect, useRef } from 'react';

export function useRenderLog(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    // Only log if it's not the very first mount or if we want to trace updates
    if (renderCount.current > 1) {
      console.log(`[Performance] ${componentName} rendered in ${timeSinceLastRender.toFixed(2)}ms (Render #${renderCount.current})`);
    }
    
    lastRenderTime.current = performance.now();
  }); // No dependency array to run on every render
}
