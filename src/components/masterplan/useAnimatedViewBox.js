import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Animates an SVG viewBox ([x, y, w, h]) toward `target` (keep the array reference
// stable between renders). Jumps straight there when reduced motion is requested.
// `log` interpolates the size exponentially, so a very large zoom (country -> one site)
// looks like a constant-speed dive instead of rushing at the end; the origin follows the
// zoom fraction so the point being zoomed on stays put on screen.
export default function useAnimatedViewBox(target, duration = 1000, log = false) {
  const [vb, setVb] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (prefersReducedMotion()) {
      current.current = target;
      setVb(target);
      return undefined;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(t);
      let next;
      if (log && from[2] !== target[2]) {
        const w = from[2] * Math.pow(target[2] / from[2], e);
        const s = (from[2] - w) / (from[2] - target[2]);
        next = [
          from[0] + (target[0] - from[0]) * s,
          from[1] + (target[1] - from[1]) * s,
          w,
          from[3] * Math.pow(target[3] / from[3], e),
        ];
      } else {
        next = from.map((f, i) => f + (target[i] - f) * e);
      }
      current.current = next;
      setVb(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, log]);

  return vb.join(' ');
}
