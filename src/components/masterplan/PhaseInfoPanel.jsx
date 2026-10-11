const label = 'text-[11px] font-semibold tracking-[0.24em] uppercase text-muted mb-3';
const ghost =
  'mp-focus px-5 py-3.5 border border-glass-strong text-[11px] font-semibold tracking-[0.22em] uppercase text-white/75 hover:text-black hover:bg-champagne hover:border-champagne transition-colors';

// Details of the selected phase: inside the list on desktop, in the bottom sheet on mobile.
export default function PhaseInfoPanel({ phase, plan, index, total, showHeading, onBack, onStep }) {
  return (
    <aside aria-label={`${phase.title} details`} className="mp-sheet">
      {showHeading && (
        <header className="mb-5">
          <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-champagne/80 mb-2">{phase.status}</div>
          <h3 className="text-[22px] font-extralight uppercase tracking-[0.04em] leading-[1.15]">{phase.title}</h3>
        </header>
      )}
      {!showHeading && <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-champagne/80 mb-3">{phase.status}</div>}

      <dl className="grid grid-cols-2 gap-6">
        <div>
          <dt className={label}>Delivery status</dt>
          <dd className="text-sm font-light text-white/80">{phase.delivery || 'To be announced'}</dd>
        </div>
        <div>
          <dt className={label}>Starting price</dt>
          <dd className="text-sm font-light text-white/80">{phase.startingPrice || 'On request'}</dd>
        </div>
      </dl>

      {phase.units?.length > 0 && (
        <div className="mt-6">
          <div className={label}>Unit types</div>
          <ul className="border-t border-glass">
            {phase.units.map((u) => (
              <li key={u.name} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-glass">
                <span className="text-sm font-light text-white/85">{u.name}</span>
                <span className="text-xs text-white/50 tabular-nums text-right">{[u.beds, u.area].filter(Boolean).join(' · ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 flex items-stretch gap-3">
        <button type="button" onClick={onBack} className={`${ghost} flex-1`}>
          Back to master plan
        </button>
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous phase" className={ghost}>
          &larr;
        </button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next phase" className={ghost}>
          &rarr;
        </button>
      </div>
      <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-white/35 tabular-nums">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
      {plan.note && <p className="mt-3 text-[11px] leading-relaxed text-white/40">{plan.note}</p>}
    </aside>
  );
}
