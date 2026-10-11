import { useEffect, useMemo, useState } from 'react';
import { DESTINATIONS, PROJECTS } from '../../data/projects.js';
import ProjectMap from '../../components/map/ProjectMap.jsx';

// DEV ONLY (route /dev/home-map-styles, not registered in production builds).
// Try looks for the home page "Our Footprint" map live. The choices are passed to the real
// ProjectMap as its `look` prop; the home page itself passes none and stays as it is.

const STORE = 'gd-homemap-styles';

const GROUPS = [
  {
    key: 'base', title: 'Base map',
    options: [
      ['mapbox://styles/mapbox/satellite-streets-v12', 'Satellite + labels', 'Current default'],
      ['mapbox://styles/mapbox/satellite-v9', 'Satellite, clean', 'Imagery only, no roads or labels'],
      ['mapbox://styles/mapbox/dark-v11', 'Dark', 'Black vector map, very on-brand'],
      ['mapbox://styles/mapbox/navigation-night-v1', 'Night', 'Dark blue-grey with road detail'],
      ['mapbox://styles/mapbox/light-v11', 'Light', 'Pale grey map'],
      ['mapbox://styles/mapbox/outdoors-v12', 'Terrain', 'Topographic, shows the coast and desert'],
    ],
  },
  {
    key: 'tone', title: 'Satellite tone', note: 'Only affects the satellite base maps',
    options: [
      ['natural', 'Natural', 'As supplied'],
      ['muted', 'Muted', 'Softer colour'],
      ['mono', 'Monochrome', 'Black and white'],
      ['dark', 'Dark', 'Desaturated and dimmed'],
    ],
  },
  {
    key: 'planTone', title: 'Master plan on the map',
    options: [
      ['original', 'Original colours', 'Current'],
      ['muted', 'Muted', 'Softer, blends with the map'],
      ['mono', 'Monochrome', 'Black and white'],
    ],
  },
  {
    key: 'area', title: 'Project area highlight',
    options: [
      ['fill', 'Outline + light fill', 'Current'],
      ['line', 'Outline only', 'Crisp line, no fill'],
      ['glow', 'Glow', 'Wide soft halo'],
      ['solid', 'Solid tint', 'Stronger fill'],
    ],
  },
  {
    key: 'pins', title: 'Pins',
    options: [
      ['dot', 'Dot', 'Current'],
      ['ring', 'Ring', 'Hollow, accent outline'],
      ['bold', 'Bold', 'Larger, wide pulse'],
    ],
  },
  {
    key: 'labels', title: 'Labels',
    options: [
      ['caps', 'Spaced capitals', 'Current'],
      ['title', 'Title case', 'Softer, easier to read'],
      ['large', 'Large capitals', 'Bigger and wider'],
    ],
  },
];

const ACCENTS = [
  ['#F5F4F0', 'Champagne'],
  ['#D4B77A', 'Gold'],
  ['#C48B5C', 'Bronze'],
  ['#6FC3B5', 'Teal'],
  ['#E8A0A0', 'Rose'],
  ['#8FB8FF', 'Sky'],
];

const DEFAULTS = { base: GROUPS[0].options[0][0], tone: 'natural', planTone: 'original', area: 'fill', pins: 'dot', labels: 'caps', accent: '#F5F4F0' };

const PRESETS = [
  ['Current', DEFAULTS],
  ['A · Dark & luxe', { base: 'mapbox://styles/mapbox/dark-v11', tone: 'natural', planTone: 'muted', area: 'glow', pins: 'ring', labels: 'large', accent: '#D4B77A' }],
  ['B · Muted satellite', { base: 'mapbox://styles/mapbox/satellite-streets-v12', tone: 'dark', planTone: 'muted', area: 'line', pins: 'bold', labels: 'title', accent: '#D4B77A' }],
  ['C · Clean light', { base: 'mapbox://styles/mapbox/light-v11', tone: 'natural', planTone: 'original', area: 'solid', pins: 'dot', labels: 'title', accent: '#C48B5C' }],
];

const load = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE)) };
  } catch {
    return DEFAULTS;
  }
};

function Group({ title, note, options, value, onChange }) {
  return (
    <fieldset className="mb-7">
      <legend className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-1">{title}</legend>
      {note && <p className="text-[11px] text-white/30 mb-2">{note}</p>}
      <div className="flex flex-col gap-1.5 mt-2">
        {options.map(([id, label, hint]) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={`text-left px-4 py-2.5 border transition-colors ${value === id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}
          >
            <span className="block text-[13px] font-medium text-white">{label}</span>
            <span className="block text-[11px] text-white/45 mt-0.5">{hint}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function HomeMapStyles() {
  const [s, setS] = useState(load);
  const [zoomed, setZoomed] = useState(null);
  const [focus, setFocus] = useState(null);
  const [copied, setCopied] = useState(false);
  const set = (patch) => setS((cur) => ({ ...cur, ...patch }));

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {
      /* private mode */
    }
  }, [s]);

  // the same camera behaviour as the home page
  const selectPin = (id) => {
    setFocus(null);
    setZoomed((z) => (z === id ? null : id));
  };
  const selectProject = (key) => {
    if (focus === key) return setFocus(null);
    setZoomed(PROJECTS.find((p) => p.key === key).destination);
    setFocus(key);
  };

  const { base, ...rest } = s;
  const look = useMemo(() => ({ base, ...rest }), [base, s.tone, s.planTone, s.area, s.pins, s.labels, s.accent]); // eslint-disable-line react-hooks/exhaustive-deps
  const summary = JSON.stringify(s, null, 2);
  const copy = () => {
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050505] p-6 order-2 lg:order-none">
        <h1 className="text-lg font-light tracking-wide mb-1">Home map styles</h1>
        <p className="text-xs text-white/45 mb-6">Pick options and watch the map. Choices are remembered. Changing the base map reloads it.</p>

        <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">Presets</div>
        <div className="grid grid-cols-2 gap-1.5 mb-7">
          {PRESETS.map(([name, p]) => (
            <button key={name} type="button" onClick={() => set(p)} className="px-3 py-2.5 border border-white/15 text-[11px] tracking-wide hover:border-white hover:bg-white/10 transition-colors">
              {name}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-3">Go to</div>
        <div className="flex flex-wrap gap-1.5 mb-7">
          <button type="button" onClick={() => (setZoomed(null), setFocus(null))} className="px-3 py-2 border border-white/15 text-[11px] hover:border-white">All Egypt</button>
          {DESTINATIONS.map((d) => (
            <button key={d.id} type="button" onClick={() => (setFocus(null), setZoomed(d.id))} className="px-3 py-2 border border-white/15 text-[11px] hover:border-white">{d.name}</button>
          ))}
          {PROJECTS.filter((p) => p.plan).map((p) => (
            <button key={p.key} type="button" onClick={() => selectProject(p.key)} className="px-3 py-2 border border-champagne/30 text-[11px] hover:border-white">{p.name}</button>
          ))}
        </div>

        {GROUPS.map((g) => (
          <Group key={g.key} title={g.title} note={g.note} options={g.options} value={s[g.key]} onChange={(v) => set({ [g.key]: v })} />
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
        <pre className="mt-3 text-[11px] leading-relaxed text-white/40 whitespace-pre-wrap break-all">{summary}</pre>
      </aside>

      <main className="min-w-0 p-5 md:p-10 order-1 lg:order-none">
        <p className="text-[11px] tracking-[0.24em] uppercase text-white/40 mb-4">Click a pin to zoom in · click it again to zoom out · Ctrl + scroll to zoom</p>
        <div className="relative h-[70vh] min-h-[460px] lg:h-[calc(100vh-110px)] overflow-hidden rounded-[2px] border border-white/10 bg-[#050505]">
          <ProjectMap key={base} zoomed={zoomed} focus={focus} look={look} onSelectDestination={selectPin} onSelectProject={selectProject} />
        </div>
      </main>
    </div>
  );
}
