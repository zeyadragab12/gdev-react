import { useEffect, useMemo, useState } from 'react';
import { PROJECTS } from '../../data/projects.js';

// DEV ONLY (route /dev/projects, not registered in production builds).
// Edit the content of every project: basics, overview, lifestyle, amenities, unit types, and
// each master-plan phase (name, status, description, highlights, unit types, delivery status,
// starting price). "Save" writes src/data/overrides/<project>.json through the dev server and
// the site picks it up immediately; commit that file to ship the change. "Reset" deletes it
// and goes back to the defaults in src/data/projects.js. Phase shapes and pins are drawn in
// /dev/masterplan-editor (linked from the Phases tab).

const lines = (a) => (a ?? []).join('\n');
const unlines = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean);
const clone = (v) => JSON.parse(JSON.stringify(v));

const snapshot = (p) => ({
  name: p.name,
  location: p.location,
  category: p.category,
  tagline: p.tagline,
  overview: clone(p.overview ?? []),
  lifestyle: clone(p.lifestyle ?? []),
  amenities: clone(p.amenities ?? []),
  units: clone(p.units ?? []),
  plan: p.plan
    ? {
        caption: p.plan.caption ?? '',
        note: p.plan.note ?? '',
        deleted: [], // saved phases removed in this session
        phases: p.plan.phases.map((ph) => ({
          id: ph.id,
          number: ph.number ?? '',
          title: ph.title ?? '',
          status: ph.status ?? '',
          body: ph.body ?? '',
          highlights: clone(ph.highlights ?? []),
          delivery: ph.delivery ?? '',
          startingPrice: ph.startingPrice ?? '',
          units: clone(ph.units ?? []),
        })),
      }
    : null,
});

const toPayload = (d) => {
  const { plan, ...rest } = d;
  if (!plan) return rest;
  const { phases, deleted, ...planRest } = plan;
  const patches = Object.fromEntries(phases.map(({ id, isNew, ...patch }) => [id, patch]));
  deleted.forEach((id) => {
    patches[id] = null;
  });
  return { ...rest, plan: { ...planRest, phases: patches, order: phases.map((ph) => ph.id) } };
};

const input = 'w-full bg-black border border-white/15 px-3 py-2 text-sm text-white/90 focus:border-champagne outline-none';
const btn = 'px-3 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase border border-white/20 hover:bg-white hover:text-black transition-colors';
const tiny = 'text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">{label}</span>
      {children}
    </label>
  );
}

const Text = ({ label, value, onChange, ...rest }) => (
  <Field label={label}>
    <input className={input} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
  </Field>
);

const Area = ({ label, value, onChange, rows = 3, hint }) => (
  <Field label={hint ? `${label} (${hint})` : label}>
    <textarea className={`${input} leading-relaxed`} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  </Field>
);

// A list of rows with add / remove. `blank` is a new empty row, `render(row, set)` draws one.
function Rows({ title, rows, onChange, blank, render }) {
  const setRow = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/60">{title}</h3>
        <button type="button" className={tiny} onClick={() => onChange([...rows, blank])}>+ Add</button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="border border-white/10 p-3 space-y-3">
          {render(row, (patch) => setRow(i, patch))}
          <div className="flex gap-4">
            <button type="button" className={tiny} disabled={i === 0} onClick={() => onChange(move(rows, i, -1))}>Up</button>
            <button type="button" className={tiny} disabled={i === rows.length - 1} onClick={() => onChange(move(rows, i, 1))}>Down</button>
            <button type="button" className={`${tiny} ml-auto`} onClick={() => onChange(rows.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const move = (rows, i, d) => {
  const next = [...rows];
  [next[i], next[i + d]] = [next[i + d], next[i]];
  return next;
};

export default function ProjectEditor() {
  const [key, setKey] = useState(PROJECTS[0].key);
  const [tab, setTab] = useState('project');
  const [phaseId, setPhaseId] = useState(null);
  const [draft, setDraft] = useState(() => snapshot(PROJECTS[0]));
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');

  const project = useMemo(() => PROJECTS.find((p) => p.key === key), [key]);

  useEffect(() => {
    setDraft(snapshot(project));
    setPhaseId(project.plan?.phases[0]?.id ?? null);
    setDirty(false);
    setMsg('');
  }, [project]);

  useEffect(() => {
    const warn = (e) => dirty && e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };
  const setPlan = (patch) => set({ plan: { ...draft.plan, ...patch } });
  const setPhase = (patch) => setPlan({ phases: draft.plan.phases.map((p) => (p.id === phaseId ? { ...p, ...patch } : p)) });

  const call = async (method, body) => {
    const r = await fetch(`/__dev/save-project?key=${encodeURIComponent(key)}`, { method, body });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? 'request failed');
  };
  const save = async () => {
    try {
      await call('POST', JSON.stringify(toPayload(draft)));
      setDirty(false);
      setMsg('Saved. The site now shows these changes.');
    } catch (e) {
      setMsg(`Save failed: ${e.message}`);
    }
  };
  const reset = async () => {
    if (!window.confirm(`Discard all saved edits for ${project.name} and go back to the code defaults?`)) return;
    try {
      await call('DELETE');
      setMsg('Reset. Reloading defaults…');
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      setMsg(`Reset failed: ${e.message}`);
    }
  };
  const pickProject = (k) => {
    if (dirty && !window.confirm('You have unsaved changes. Switch project and lose them?')) return;
    setKey(k);
  };

  const addPhase = () => {
    const ids = new Set([...draft.plan.phases.map((p) => p.id), ...project.plan.phases.map((p) => p.id)]);
    let n = draft.plan.phases.length + 1;
    while (ids.has(`phase-${n}`)) n += 1;
    const next = { id: `phase-${n}`, isNew: true, number: '', title: `New phase ${n}`, status: '', body: '', highlights: [], delivery: '', startingPrice: '', units: [] };
    setPlan({ phases: [...draft.plan.phases, next], deleted: draft.plan.deleted.filter((id) => id !== next.id) });
    setPhaseId(next.id);
  };
  const deletePhase = () => {
    if (!window.confirm(`Delete "${phase.title}"? It is removed from the master plan when you save.`)) return;
    const rest = draft.plan.phases.filter((p) => p.id !== phaseId);
    const wasSaved = project.plan.phases.some((p) => p.id === phaseId);
    setPlan({ phases: rest, deleted: wasSaved ? [...draft.plan.deleted, phaseId] : draft.plan.deleted });
    setPhaseId(rest[0]?.id ?? null);
  };

  const phase = draft.plan?.phases.find((p) => p.id === phaseId);
  const tabs = [['project', 'Project'], ['units', 'Unit types'], ['phases', 'Master plan phases']];

  return (
    <div className="min-h-screen bg-black text-white font-light">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/95 px-5 py-3">
        <h1 className="text-[11px] font-semibold tracking-[0.28em] uppercase text-champagne">Project editor</h1>
        <select className={`${input} !w-auto`} value={key} onChange={(e) => pickProject(e.target.value)}>
          {PROJECTS.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
        <a className={tiny} href={`/community/${key}`} target="_blank" rel="noreferrer">View page</a>
        <span className="text-[11px] text-champagne">{dirty ? 'Unsaved changes' : msg}</span>
        <div className="ml-auto flex gap-2">
          <button type="button" className={btn} onClick={reset}>Reset to defaults</button>
          <button type="button" className={`${btn} bg-white text-black`} onClick={save} disabled={!dirty}>Save</button>
        </div>
      </header>

      <nav className="flex gap-6 border-b border-white/10 px-5">
        {tabs.filter(([id]) => id !== 'phases' || draft.plan).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={`py-3 text-[11px] font-semibold tracking-[0.2em] uppercase border-b-2 ${tab === id ? 'border-champagne text-white' : 'border-transparent text-white/45 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        {tab === 'project' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Name" value={draft.name} onChange={(v) => set({ name: v })} />
              <Text label="Location" value={draft.location} onChange={(v) => set({ location: v })} />
              <Text label="Category" value={draft.category} onChange={(v) => set({ category: v })} />
              <Text label="Tagline" value={draft.tagline} onChange={(v) => set({ tagline: v })} />
            </div>
            <Area label="Overview" hint="one paragraph per line break" rows={7}
              value={draft.overview.join('\n\n')} onChange={(v) => set({ overview: v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} />
            <Rows title="Lifestyle" rows={draft.lifestyle} blank={{ title: '', body: '' }} onChange={(lifestyle) => set({ lifestyle })}
              render={(r, up) => (
                <>
                  <Text label="Title" value={r.title} onChange={(v) => up({ title: v })} />
                  <Area label="Text" value={r.body} onChange={(v) => up({ body: v })} />
                </>
              )} />
            <Rows title="Amenities" rows={draft.amenities} blank={{ icon: 'park', label: '' }} onChange={(amenities) => set({ amenities })}
              render={(r, up) => (
                <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                  <Text label="Label" value={r.label} onChange={(v) => up({ label: v })} />
                  <Text label="Icon" value={r.icon} onChange={(v) => up({ icon: v })} />
                </div>
              )} />
          </>
        )}

        {tab === 'units' && (
          <Rows title="Unit types" rows={draft.units} blank={{ type: '', body: '', highlights: [] }} onChange={(units) => set({ units })}
            render={(r, up) => (
              <>
                <Text label="Unit type" value={r.type} onChange={(v) => up({ type: v })} />
                <Area label="Description" value={r.body} onChange={(v) => up({ body: v })} />
                <Area label="Highlights" hint="one per line" rows={3} value={lines(r.highlights)} onChange={(v) => up({ highlights: unlines(v) })} />
              </>
            )} />
        )}

        {tab === 'phases' && draft.plan && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Plan caption" value={draft.plan.caption} onChange={(v) => setPlan({ caption: v })} />
              <Text label="Disclaimer note" value={draft.plan.note} onChange={(v) => setPlan({ note: v })} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {draft.plan.phases.map((p) => (
                <button key={p.id} type="button" onClick={() => setPhaseId(p.id)}
                  className={`${btn} ${p.id === phaseId ? 'bg-white text-black' : ''}`}>
                  {p.number} {p.title}
                </button>
              ))}
              <button type="button" className={btn} onClick={addPhase}>+ Add phase</button>
              <a className={`${tiny} ml-auto`} href={`/dev/masterplan-editor?project=${key}`}>Draw areas and pins →</a>
            </div>
            {draft.plan.phases.some((p) => p.isNew) && (
              <p className="text-[11px] leading-relaxed text-white/50">
                New phases stay off the public plan until you save here and then draw their area in the master plan editor.
              </p>
            )}
            {phase && (
              <section className="space-y-4 border border-white/10 p-4">
                <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
                  <Text label="Number" value={phase.number} onChange={(v) => setPhase({ number: v })} />
                  <Text label="Phase name" value={phase.title} onChange={(v) => setPhase({ title: v })} />
                </div>
                <Text label="Status line" value={phase.status} onChange={(v) => setPhase({ status: v })} placeholder="Phase 01 · Arrival" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Text label="Delivery status" value={phase.delivery} onChange={(v) => setPhase({ delivery: v })} placeholder="Under construction · Q4 2027" />
                  <Text label="Starting price" value={phase.startingPrice} onChange={(v) => setPhase({ startingPrice: v })} placeholder="EGP 18.5M" />
                </div>
                <Area label="Description" value={phase.body} onChange={(v) => setPhase({ body: v })} />
                <Area label="Highlights" hint="one per line" rows={3} value={lines(phase.highlights)} onChange={(v) => setPhase({ highlights: unlines(v) })} />
                <Rows title="Unit types in this phase" rows={phase.units} blank={{ name: '', beds: '', area: '' }} onChange={(units) => setPhase({ units })}
                  render={(r, up) => (
                    <div className="grid gap-3 sm:grid-cols-[1fr_7rem_8rem]">
                      <Text label="Unit type" value={r.name} onChange={(v) => up({ name: v })} />
                      <Text label="Bedrooms" value={r.beds} onChange={(v) => up({ beds: v })} placeholder="4 BR" />
                      <Text label="Area" value={r.area} onChange={(v) => up({ area: v })} placeholder="280 m²" />
                    </div>
                  )} />
                <button type="button" className={tiny} onClick={deletePhase}>Delete this phase</button>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
