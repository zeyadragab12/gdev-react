import { memo, useEffect, useRef } from 'react';

// Phase list. Desktop: the panel on the right, the selected phase expands in place with
// its details (`detail`). Mobile: a row of chips above the plan.
function PhaseSelector({ phases, selectedId, hoveredId, detail, onSelect, onHover }) {
  const scroller = useRef(null);

  // bring the opened phase to the top of the panel (scrolls the panel, never the page)
  useEffect(() => {
    const el = scroller.current?.querySelector('[data-active="true"]');
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.current.scrollTo({ top: el.offsetTop - 56, behavior: smooth ? 'smooth' : 'auto' });
  }, [selectedId]);

  return (
    <nav ref={scroller} aria-label="Master plan phases" className="relative order-first lg:order-none border-b lg:border-b-0 lg:border-l border-glass bg-[#050505] lg:h-[min(82vh,860px)] lg:overflow-y-auto">
      <ul className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar p-3">
        {phases.map((p) => (
          <li key={p.id} className="flex-none">
            <button
              type="button"
              aria-pressed={p.id === selectedId}
              onClick={() => onSelect(p.id)}
              className={`mp-focus px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase border transition-colors ${
                p.id === selectedId ? 'border-champagne bg-champagne text-black' : 'border-glass-strong text-white/70'
              }`}
            >
              {p.number} · {p.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden lg:block px-7 pt-7 pb-4 text-[11px] font-semibold tracking-[0.24em] uppercase text-muted">Select a zone or phase to zoom in</div>
      <ol className="hidden lg:block">
        {phases.map((p) => {
          const active = p.id === selectedId;
          return (
            <li key={p.id} data-active={active} className="border-t border-glass last:border-b">
              <button
                type="button"
                aria-expanded={active}
                onClick={() => onSelect(p.id)}
                onPointerEnter={() => onHover(p.id)}
                onPointerLeave={() => onHover(null)}
                className={`mp-focus flex w-full items-center gap-5 px-7 py-4 text-left transition-colors duration-300 ${
                  active ? 'bg-white/[0.05]' : hoveredId === p.id ? 'bg-white/[0.03]' : 'hover:bg-white/[0.025]'
                }`}
              >
                <span
                  className={`flex-none w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-semibold tabular-nums transition-colors duration-300 ${
                    active ? 'border-white bg-white text-black' : hoveredId === p.id ? 'border-champagne text-champagne' : 'border-glass-strong text-white/60'
                  }`}
                >
                  {p.number}
                </span>
                <span className={`text-[13px] font-medium uppercase tracking-[0.14em] leading-snug ${active ? 'text-white' : 'text-white/70'}`}>{p.title}</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  {active && <div className="px-7 pb-8 pt-2">{detail}</div>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default memo(PhaseSelector);
