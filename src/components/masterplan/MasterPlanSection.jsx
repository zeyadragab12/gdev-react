import { useCallback, useEffect, useMemo, useState } from 'react';
import useReveal from '../../hooks/useReveal.js';
import MasterPlanViewer from './MasterPlanViewer.jsx';
import PhaseSelector from './PhaseSelector.jsx';
import PhaseInfoPanel from './PhaseInfoPanel.jsx';
import normalizePhases from './normalizePhases.js';

const SHEET = 0.46; // share of the map the mobile sheet covers

function Eyebrow({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-4 mb-6 md:mb-8 ${className}`}>
      <span className="w-10 h-px bg-champagne/60" />
      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">{children}</span>
    </div>
  );
}

function useDesktop() {
  const query = '(min-width: 1024px)';
  const [on, setOn] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return on;
}

// Interactive master plan. `plan` shape: see src/data/playaMasterPlan.js.
//   { image, width, height, alt, caption, note?, phases: Phase[] }
//   Phase: { id, number?, title, status, body, polygon | region, pin?, center?, zoom?,
//            image?, overlay?, highlights?, units? }
export default function MasterPlanSection({ plan }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const revealRef = useReveal();
  const desktop = useDesktop();

  const phases = useMemo(() => normalizePhases(plan), [plan]);
  const index = phases.findIndex((p) => p.id === selectedId);
  const phase = phases[index] ?? null;

  // clicking the selected phase again zooms back out
  const select = useCallback((id) => setSelectedId((cur) => (cur === id ? null : id)), []);
  const reset = useCallback(() => {
    setSelectedId(null);
    setHoveredId(null);
  }, []);
  const step = useCallback(
    (dir) => setSelectedId(phases[(Math.max(index, 0) + dir + phases.length) % phases.length].id),
    [phases, index],
  );

  const info = phase && (
    <PhaseInfoPanel phase={phase} plan={plan} index={index} total={phases.length} showHeading={!desktop} onBack={reset} onStep={step} />
  );

  return (
    <section
      id="masterplan"
      ref={revealRef}
      aria-labelledby="masterplan-title"
      className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px]"
      onKeyDown={(e) => e.key === 'Escape' && selectedId && reset()}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
        <div>
          <Eyebrow className="reveal">Master Plan</Eyebrow>
          <h2 id="masterplan-title" className="reveal [transition-delay:120ms] text-[30px] md:text-[48px] font-extralight uppercase tracking-[0.04em] leading-[1.1]">
            Explore <span className="text-champagne/55">the community</span>
          </h2>
        </div>
        <p className="reveal [transition-delay:200ms] max-w-[420px] text-sm md:text-[15px] font-light leading-[1.8] text-white/60">
          Select a phase on the plan, or from the list, to zoom in and see what it holds.
        </p>
      </div>

      <div className="reveal-img border border-glass bg-[#060606] grid grid-cols-1 lg:grid-cols-[1fr_400px]">
        <MasterPlanViewer
          plan={plan}
          phases={phases}
          selectedId={selectedId}
          hoveredId={hoveredId}
          bottomInset={!desktop && phase ? SHEET : 0}
          onSelect={select}
          onHover={setHoveredId}
          onReset={reset}
        >
          {!desktop && phase && (
            <div
              key={phase.id}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain border-t border-glass-strong bg-[#050505]/95 backdrop-blur-md px-5 pt-3 pb-8"
              style={{ height: `${SHEET * 100}%` }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25" aria-hidden="true" />
              {info}
            </div>
          )}
        </MasterPlanViewer>

        <PhaseSelector phases={phases} selectedId={selectedId} hoveredId={hoveredId} detail={desktop ? info : null} onSelect={select} onHover={setHoveredId} />
      </div>
    </section>
  );
}
