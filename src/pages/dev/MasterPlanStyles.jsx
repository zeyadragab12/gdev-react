import { useEffect, useMemo, useState } from 'react';
import { PROJECTS } from '../../data/projects.js';
import MasterPlanSection from '../../components/masterplan/MasterPlanSection.jsx';

// DEV ONLY (route /dev/masterplan-styles, not registered in production builds).
// Try master-plan looks live on the real plans. The choices set data-mp-* attributes and
// --mp-accent on a wrapper; the matching CSS is at the end of src/index.css.

const PLANS = PROJECTS.filter((p) => p.plan);
const STORE = 'gd-mpstyles';

const GROUPS = [
  {
    key: 'image', title: 'Plan image',
    options: [
      ['original', 'Original', 'Full-colour artwork, as supplied'],
      ['dark', 'Dark luxe', 'Desaturated and darkened, warm tint'],
      ['muted', 'Muted', 'Softer colour, a little darker'],
      ['mono', 'Monochrome', 'Black and white, high contrast'],
      ['paper', 'Light paper', 'Cream background, soft colour'],
    ],
  },
  {
    key: 'phase', title: 'Phase areas',
    options: [
      ['outline', 'Outline on hover', 'Current: nothing until you hover'],
      ['tint', 'Tinted', 'Always-visible soft accent tint'],
      ['glow', 'Dashed + glow', 'Dashed outlines, glowing on hover'],
      ['coded', 'Colour-coded', 'Each phase gets its own colour'],
    ],
  },
  {
    key: 'pin', title: 'Pins',
    options: [
      ['default', 'Current', 'Black numbered circle'],
      ['gold', 'Accent badge', 'Filled accent with a halo'],
      ['ring', 'Glass ring', 'Thin ring, number inside'],
      ['dot', 'Minimal dot', 'Small dot, no number'],
    ],
  },
  {
    key: 'frame', title: 'Map frame',
    options: [
      ['none', 'Plain', 'No frame'],
      ['framed', 'Framed + vignette', 'Hairline border, darkened edges'],
    ],
  },
];

const ACCENTS = [
  ['#F5F4F0', 'Champagne'],
  ['#D4B77A', 'Gold'],
  ['#C48B5C', 'Bronze'],
  ['#7A5C2E', 'Deep bronze'],
  ['#6FC3B5', 'Teal'],
  ['#E8A0A0', 'Rose'],
];

const DEFAULTS = { project: PLANS[0]?.key, image: 'original', phase: 'outline', pin: 'default', frame: 'none', accent: '#F5F4F0' };

const PRESETS = [
  ['Current', { image: 'original', phase: 'outline', pin: 'default', frame: 'none', accent: '#F5F4F0' }],
  ['A · Dark & luxe', { image: 'dark', phase: 'glow', pin: 'gold', frame: 'framed', accent: '#D4B77A' }],
  ['B · Light paper', { image: 'paper', phase: 'tint', pin: 'ring', frame: 'framed', accent: '#7A5C2E' }],
  ['C · Keep colour', { image: 'original', phase: 'coded', pin: 'dot', frame: 'none', accent: '#F5F4F0' }],
];

const load = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE)) };
  } catch {
    return DEFAULTS;
  }
};

function Group({ title, options, value, onChange }) {
  return (
    <fieldset className="mb-7">
      <legend className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">{title}</legend>
      <div className="flex flex-col gap-1.5">
        {options.map(([id, label, hint]) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={`text-left px-4 py-3 border transition-colors ${
              value === id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <span className="block text-[13px] font-medium text-white">{label}</span>
            <span className="block text-[11px] text-white/45 mt-0.5">{hint}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function MasterPlanStyles() {
  const [s, setS] = useState(load);
  const [copied, setCopied] = useState(false);
  const set = (patch) => setS((cur) => ({ ...cur, ...patch }));

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {
      /* private mode */
    }
  }, [s]);

  const project = PLANS.find((p) => p.key === s.project) ?? PLANS[0];
  const summary = useMemo(() => JSON.stringify({ image: s.image, phase: s.phase, pin: s.pin, frame: s.frame, accent: s.accent }, null, 2), [s]);

  const copy = () => {
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050505] p-6">
        <h1 className="text-lg font-light tracking-wide mb-1">Master plan styles</h1>
        <p className="text-xs text-white/45 mb-6">Pick options and watch the plan on the right. Choices are remembered.</p>

        <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">Presets</div>
        <div className="grid grid-cols-2 gap-1.5 mb-7">
          {PRESETS.map(([name, p]) => (
            <button key={name} type="button" onClick={() => set(p)} className="px-3 py-2.5 border border-white/15 text-[11px] tracking-wide hover:border-white hover:bg-white/10 transition-colors">
              {name}
            </button>
          ))}
        </div>

        <fieldset className="mb-7">
          <legend className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">Project</legend>
          <select value={s.project} onChange={(e) => set({ project: e.target.value })} className="w-full bg-black border border-white/20 px-3 py-2.5 text-sm">
            {PLANS.map((p) => (
              <option key={p.key} value={p.key}>{p.name}</option>
            ))}
          </select>
        </fieldset>

        {GROUPS.map((g) => (
          <Group key={g.key} title={g.title} options={g.options} value={s[g.key]} onChange={(v) => set({ [g.key]: v })} />
        ))}

        <fieldset className="mb-7">
          <legend className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">Accent colour</legend>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map(([c, name]) => (
              <button
                key={c}
                type="button"
                title={name}
                aria-label={name}
                aria-pressed={s.accent === c}
                onClick={() => set({ accent: c })}
                style={{ background: c }}
                className={`w-9 h-9 rounded-full border-2 ${s.accent === c ? 'border-white scale-110' : 'border-white/20'} transition-transform`}
              />
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={copy} className="w-full px-4 py-3 border border-white/30 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors">
          {copied ? 'Copied' : 'Copy my choices'}
        </button>
        <pre className="mt-3 text-[11px] leading-relaxed text-white/40 whitespace-pre-wrap">{summary}</pre>
      </aside>

      <main
        key={project.key}
        data-mp-image={s.image}
        data-mp-phase={s.phase}
        data-mp-pin={s.pin}
        data-mp-frame={s.frame}
        style={{ '--mp-accent': s.accent }}
        className="min-w-0"
      >
        <MasterPlanSection plan={project.plan} />
      </main>
    </div>
  );
}
