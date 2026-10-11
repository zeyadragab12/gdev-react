import { useCallback, useEffect, useRef } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Drives the map camera without React re-rendering: it writes the SVG viewBox and the
// pin positions straight to the DOM. `pinPoints[i]` is the image position of the i-th
// child of `pinsRef`; `size` is the frame in px. Pins keep a constant on-screen size.
export default function useMapCamera({ svgRef, pinsRef, size, pinPoints }) {
  const view = useRef(null);
  const frame = useRef(0);
  const sizeRef = useRef(size);
  const pointsRef = useRef(pinPoints);
  sizeRef.current = size;
  pointsRef.current = pinPoints;

  const apply = useCallback(
    (v) => {
      view.current = v;
      svgRef.current?.setAttribute('viewBox', v.join(' '));
      const pins = pinsRef.current?.children;
      if (!pins) return;
      const k = sizeRef.current.w / v[2];
      for (let i = 0; i < pins.length; i += 1) {
        const { x, y } = pointsRef.current[i];
        pins[i].style.transform = `translate3d(${(x - v[0]) * k}px, ${(y - v[1]) * k}px, 0)`;
      }
    },
    [svgRef, pinsRef],
  );

  const cancel = useCallback(() => cancelAnimationFrame(frame.current), []);

  // Zoom is interpolated on a log scale and the centre linearly, so zooming in or out
  // feels even instead of rushing at the start.
  const flyTo = useCallback(
    (to, ms = 1000) => {
      cancel();
      const from = view.current;
      if (!from || reducedMotion()) {
        apply(to);
        return;
      }
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / ms);
        const e = easeInOutCubic(t);
        const w = from[2] * Math.pow(to[2] / from[2], e);
        const h = (w * to[3]) / to[2];
        const cx = (from[0] + from[2] / 2) * (1 - e) + (to[0] + to[2] / 2) * e;
        const cy = (from[1] + from[3] / 2) * (1 - e) + (to[1] + to[3] / 2) * e;
        apply(t < 1 ? [cx - w / 2, cy - h / 2, w, h] : to);
        if (t < 1) frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    },
    [apply, cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { apply, flyTo, cancel, get: () => view.current };
}
