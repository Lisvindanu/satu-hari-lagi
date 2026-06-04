import { useRef, useCallback, useState } from 'react';

export default function useSpeedrun() {
  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(null);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(null);
  }, []);

  const stop = useCallback(() => {
    if (!startTimeRef.current) return 0;
    const ms = Date.now() - startTimeRef.current;
    setElapsed(ms);
    startTimeRef.current = null;
    return ms;
  }, []);

  const format = useCallback((ms) => {
    if (ms == null) return '--:--';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }, []);

  return { start, stop, elapsed, format };
}
