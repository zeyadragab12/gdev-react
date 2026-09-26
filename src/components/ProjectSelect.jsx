import { useEffect, useId, useRef, useState } from 'react';
import { DESTINATIONS, PROJECTS } from '../data/projects.js';

const EXIT_MS = 220;
const PANEL_MAX = 340;

// Flat option list (drives keyboard navigation); `group` starts a destination header.
const OPTIONS = [
  { value: '', name: 'Not sure yet', meta: 'Help me choose' },
  ...DESTINATIONS.flatMap((d) =>
    PROJECTS.filter((p) => p.destination === d.id).map((p, i) => ({
      value: p.name,
      name: p.name,
      meta: p.category,
      image: p.image,
      group: i === 0 ? d.name : null,
    })),
  ),
];

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Thumb({ option, size = 'w-10 h-10' }) {
  if (!option.image) {
    return (
      <span className={`${size} flex-none rounded-full border border-champagne/40 flex items-center justify-center text-champagne/80 text-sm`} aria-hidden="true">
        ?
      </span>
    );
  }
  return <span className={`${size} flex-none rounded-full bg-cover bg-center ring-1 ring-champagne/25`} style={{ backgroundImage: `url('${option.image}')` }} aria-hidden="true" />;
}

// Custom listbox replacing <select> for "Project of Interest". Submits via a hidden input.
// Opens upward when there isn't room below inside the nearest [data-dropdown-bounds] (or the viewport).
export default function ProjectSelect({ name = 'project', label, labelClass }) {
  const id = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [state, setState] = useState('closed'); // closed | open | closing
  const [upward, setUpward] = useState(false);
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(0);

  const isOpen = state === 'open';
  const current = OPTIONS[selected];

  const openPanel = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    const bounds = rootRef.current.closest('[data-dropdown-bounds]')?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight };
    const below = bounds.bottom - rect.bottom;
    const above = rect.top - bounds.top;
    setUpward(below < PANEL_MAX && above > below);
    setActive(selected);
    setState('open');
  };

  const closePanel = (refocus = true) => {
    setState((s) => (s === 'open' ? 'closing' : s));
    if (refocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (state !== 'closing') return;
    const t = setTimeout(() => setState('closed'), EXIT_MS);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus();
    const onPointerDown = (e) => !rootRef.current.contains(e.target) && closePanel(false);
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  // keep the keyboard-active option in view
  useEffect(() => {
    if (isOpen) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, isOpen]);

  const choose = (i) => {
    setSelected(i);
    closePanel();
  };

  const onListKeyDown = (e) => {
    const keys = {
      ArrowDown: () => setActive((a) => Math.min(a + 1, OPTIONS.length - 1)),
      ArrowUp: () => setActive((a) => Math.max(a - 1, 0)),
      Home: () => setActive(0),
      End: () => setActive(OPTIONS.length - 1),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => closePanel(),
      Tab: () => closePanel(false),
    };
    if (!keys[e.key]) return;
    if (e.key !== 'Tab') e.preventDefault();
    e.stopPropagation(); // keep Escape from also closing the surrounding modal
    keys[e.key]();
  };

  const onTriggerKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openPanel();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={current.value} />
      <span id={`${id}-label`} className={labelClass}>
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (isOpen ? closePanel() : openPanel())}
        onKeyDown={onTriggerKeyDown}
        className={`group w-full flex items-center gap-3 py-2.5 border-b text-left transition-colors duration-300 ${
          isOpen ? 'border-champagne' : 'border-glass-strong hover:border-white/40'
        }`}
      >
        <span key={current.value} className="animate-fade-in">
          <Thumb option={current} size="w-7 h-7" />
        </span>
        <span id={`${id}-value`} key={`v-${current.value}`} className="flex-1 min-w-0 animate-fade-up">
          <span className="block truncate text-[15px] font-light text-white">{current.name}</span>
        </span>
        <span className={`hidden sm:block text-[10px] tracking-[0.18em] uppercase transition-colors ${isOpen ? 'text-champagne' : 'text-white/35'}`}>
          {current.meta}
        </span>
        <span className={`w-8 h-8 flex-none rounded-full border flex items-center justify-center transition-colors duration-300 ${isOpen ? 'border-champagne bg-champagne text-black' : 'border-glass-strong text-white/70 group-hover:border-champagne/50'}`}>
          <Chevron open={isOpen} />
        </span>
      </button>

      {state !== 'closed' && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
          style={{ maxHeight: PANEL_MAX }}
          className={`absolute z-20 left-0 right-0 overflow-y-auto no-scrollbar outline-none py-2 bg-[#0e0e0e]/95 backdrop-blur-xl border border-glass-strong shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ${
            upward ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
          } ${state === 'closing' ? 'select-panel-out' : 'select-panel-in'}`}
        >
          {OPTIONS.map((opt, i) => {
            const isSelected = selected === i;
            const isActive = active === i;
            return (
              <li key={opt.value || 'none'} role="presentation">
                {opt.group && (
                  <div className="select-option px-5 pt-4 pb-2 flex items-center gap-3 text-[10px] font-semibold tracking-[0.28em] uppercase text-champagne/60" style={{ animationDelay: `${i * 28}ms` }}>
                    {opt.group}
                    <span className="flex-1 h-px bg-glass" />
                  </div>
                )}
                <div
                  id={`${id}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className="select-option relative flex items-center gap-4 px-5 py-2.5 cursor-pointer"
                  style={{ animationDelay: `${i * 28}ms` }}
                >
                  <span className={`absolute inset-y-1 left-2 right-2 bg-champagne/[0.07] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-[2px] bg-champagne transition-all duration-300 ${isActive ? 'h-7' : 'h-0'}`} />
                  <span className={`relative transition-transform duration-300 ${isActive ? 'scale-105' : ''}`}>
                    <Thumb option={opt} />
                  </span>
                  <span className="relative flex-1 min-w-0">
                    <span className={`block truncate text-[14px] font-light uppercase tracking-[0.08em] transition-colors duration-200 ${isSelected || isActive ? 'text-champagne' : 'text-white/85'}`}>
                      {opt.name}
                    </span>
                    <span className="block text-[10px] tracking-[0.18em] uppercase text-white/40 mt-0.5">{opt.meta}</span>
                  </span>
                  <span className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-champagne text-black scale-100' : 'scale-0'}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
