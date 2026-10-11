import { useEffect, useRef, useState } from 'react';

// Vertical timeline: the line fills as the page scrolls, and each entry slides in from the right (right -> left)
// when it reaches the viewport. Falls back to a static, fully visible list for reduced-motion users.
export default function StoryTimeline({ items }) {
  const listRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [seen, setSeen] = useState(() => new Set());
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // line fill: how far the viewport's focus line (60% down the screen) has travelled through the list
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = listRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const focus = window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, (focus - top) / height)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // entries slide in once, the first time they scroll into view
  useEffect(() => {
    const nodes = listRef.current?.querySelectorAll('[data-idx]');
    if (!nodes?.length || !('IntersectionObserver' in window)) {
      setSeen(new Set(items.map((_, i) => i)));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = Number(e.target.dataset.idx);
          setSeen((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
          io.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  return (
    <ol ref={listRef} className="relative pl-10 md:pl-[200px]">
      {/* track + fill */}
      <span aria-hidden="true" className="absolute left-[11px] md:left-[171px] top-2 bottom-2 w-px bg-glass-strong" />
      <span
        aria-hidden="true"
        className="absolute left-[11px] md:left-[171px] top-2 bottom-2 w-px bg-champagne origin-top will-change-transform"
        style={{ transform: `scaleY(${still ? 1 : progress})` }}
      />

      {items.map((m, i) => {
        const visible = still || seen.has(i);
        return (
          <li key={m.year} data-idx={i} className="relative pb-16 md:pb-24 last:pb-0">
            {/* year, pinned left of the line on desktop */}
            <div
              className={`md:absolute md:-left-[200px] md:w-[150px] md:text-right mb-3 md:mb-0 text-[28px] md:text-[44px] font-extralight leading-none transition-colors duration-700 ${
                visible ? 'text-champagne' : 'text-white/20'
              }`}
            >
              {m.year}
            </div>
            {/* node on the line */}
            <span
              aria-hidden="true"
              className={`absolute -left-[34px] top-1.5 md:top-3 w-[11px] h-[11px] rounded-full border transition-all duration-700 ${
                visible ? 'bg-champagne border-champagne scale-125' : 'bg-black border-white/30'
              }`}
            />
            <div
              className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
              }`}
            >
              <h3 className="text-xl md:text-[28px] font-light mb-3">{m.title}</h3>
              <p className="text-[15px] md:text-base leading-[1.8] text-muted font-light max-w-[600px]">{m.text}</p>
              {m.note && <p className="mt-4 text-[11px] tracking-[0.22em] uppercase text-champagne/70">{m.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
