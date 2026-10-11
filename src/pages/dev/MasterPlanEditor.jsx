import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS } from '../../data/projects.js';
import ImageCropper from './ImageCropper.jsx';

// DEV ONLY (route /dev/masterplan-editor, not registered in production builds).
// Draw and adjust master-plan phase boundaries and pins on the plan image:
//   - Select tool: drag a point or the pin, drag a "+" on an edge to add a point,
//     right-click (or Delete) a point to remove it, click a shape to select its phase.
//   - Draw tool (D): click to add points to the selected phase. "Clear" first to redraw from scratch.
//   - Pan by dragging the background, zoom with the wheel (or the buttons).
//   - Images (per phase): "Panel image" crops a photo to the info panel's 16:10 and saves it;
//     "Plan overlay" crops any image and lets you drag / scale / rotate it onto its exact area.
//     Cropped files are saved to public/images/phases (dev server only).
//   - Ctrl+Z undoes. Edits are kept as a draft in this browser; "Copy" gives the code to paste
//     into the plan's data file (e.g. src/data/playaMasterPlan.js). Nothing is written to disk.

const PLANS = PROJECTS; // projects without a plan get an upload screen
const DRAFT = (key) => `gd-mpeditor-${key}`;
const META = (key) => `gd-mpeditor-meta-${key}`; // phases added / deleted but not yet saved
const rect = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const num = (n) => Math.round(n);
const pinOf = (p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : p);

const baseOf = (plan) =>
  Object.fromEntries(
    plan.phases.map((p) => {
      const polygon = (p.polygon ?? (p.region ? rect(p.region) : [])).map(([x, y]) => [x, y]);
      const xs = polygon.map((q) => q[0]);
      const ys = polygon.map((q) => q[1]);
      const centre = polygon.length
        ? { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 }
        : { x: plan.width / 2, y: plan.height / 2 };
      return [p.id, { polygon, pin: p.pin ? pinOf(p.pin) : centre, ...(p.image ? { image: p.image } : {}), ...(p.overlay ? { overlay: p.overlay } : {}) }];
    }),
  );

const readDraft = (key, store = DRAFT) => {
  try {
    return JSON.parse(localStorage.getItem(store(key)));
  } catch {
    return null;
  }
};

const snippet = (id, e) => {
  const o = e.overlay;
  return [
    `// ${id}`,
    `polygon: [${e.polygon.map(([x, y]) => `[${num(x)}, ${num(y)}]`).join(', ')}],`,
    `pin: { x: ${num(e.pin.x)}, y: ${num(e.pin.y)} },`,
    e.image && `image: '${e.image}',`,
    o && `overlay: { src: '${o.src}', x: ${num(o.x)}, y: ${num(o.y)}, w: ${num(o.w)}, h: ${num(o.h)}, rotate: ${+o.rotate.toFixed(1)}, opacity: ${+o.opacity.toFixed(2)} },`,
  ]
    .filter(Boolean)
    .join('\n');
};

async function upload(blob, name) {
  const r = await fetch(`/__dev/upload?name=${encodeURIComponent(name)}`, { method: 'POST', body: blob });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? 'upload failed');
  return (await r.json()).path;
}

export default function MasterPlanEditor() {
  const [projectKey, setProjectKey] = useState(() => {
    const k = new URLSearchParams(window.location.search).get('project');
    return PLANS.some((p) => p.key === k) ? k : PLANS[0]?.key;
  });
  const plan = PLANS.find((p) => p.key === projectKey)?.plan;
  const [shapes, setShapes] = useState(null);
  const [list, setList] = useState([]); // [{ id, title, number, isNew? }] in display order
  const [deleted, setDeleted] = useState([]); // ids of saved phases to remove on save
  const autoPin = useRef(new Set()); // new phases whose pin follows the drawn area
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState('select');
  const [view, setView] = useState(null);
  const [copied, setCopied] = useState('');
  const [cropping, setCropping] = useState(null); // { kind: 'panel' | 'overlay', file }
  const [status, setStatus] = useState('');
  const history = useRef([]);
  const ready = Boolean(shapes && view);
  const svgRef = useRef(null);
  const drag = useRef(null);

  // load plan + any saved draft
  useEffect(() => {
    if (!plan) return;
    const base = baseOf(plan);
    const meta = readDraft(projectKey, META);
    const items = meta?.list ?? plan.phases.map((p) => ({ id: p.id, title: p.title, number: p.number }));
    const merged = { ...base, ...(readDraft(projectKey) ?? {}) };
    items.forEach((it) => {
      merged[it.id] ??= { polygon: [], pin: { x: plan.width / 2, y: plan.height / 2 } };
    });
    setShapes(merged);
    setList(items);
    setDeleted(meta?.deleted ?? []);
    autoPin.current = new Set(items.filter((it) => it.isNew).map((it) => it.id));
    setSelected(items[0]?.id);
    setView([0, 0, plan.width, plan.height]);
    history.current = [];
    setTool('select');
  }, [projectKey, plan]);

  useEffect(() => {
    if (shapes) {
      try {
        localStorage.setItem(DRAFT(projectKey), JSON.stringify(shapes));
      } catch {
        /* draft is a convenience only */
      }
    }
  }, [shapes, projectKey]);

  useEffect(() => {
    if (!shapes) return;
    try {
      localStorage.setItem(META(projectKey), JSON.stringify({ list, deleted }));
    } catch {
      /* draft is a convenience only */
    }
  }, [list, deleted, shapes, projectKey]);

  const commit = useCallback((fn) => {
    setShapes((s) => {
      history.current.push(s);
      if (history.current.length > 100) history.current.shift();
      return fn(s);
    });
  }, []);
  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (prev) setShapes(prev);
  }, []);
  const update = (id, patch) => setShapes((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  // pointer -> image coordinates
  const toImage = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [p.x, p.y];
  };
  const unit = () => (view && svgRef.current ? view[2] / svgRef.current.clientWidth : 1); // image px per screen px

  const zoomAt = useCallback(
    (fx, fy, factor) =>
      setView((v) => {
        if (!v) return v;
        const w = Math.min(plan.width * 1.5, Math.max(40, v[2] * factor));
        const k = w / v[2];
        return [fx - (fx - v[0]) * k, fy - (fy - v[1]) * k, w, v[3] * k];
      }),
    [plan],
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      zoomAt(p.x, p.y, e.deltaY > 0 ? 1.15 : 1 / 1.15);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt, plan, ready]);

  // ---- drag handling (window-level so fast moves never lose the pointer) ----
  const startDrag = (e, d) => {
    e.stopPropagation();
    e.preventDefault();
    if (!d.noHistory) history.current.push(shapes);
    drag.current = { ...d, moved: false };
    const move = (ev) => {
      const cur = drag.current;
      if (!cur) return;
      cur.moved = true;
      if (cur.kind === 'pan') {
        const k = unit();
        setView((v) => [cur.view[0] - (ev.clientX - cur.x) * k, cur.view[1] - (ev.clientY - cur.y) * k, v[2], v[3]]);
        return;
      }
      const [x, y] = toImage(ev);
      const cx = Math.min(plan.width, Math.max(0, x));
      const cy = Math.min(plan.height, Math.max(0, y));
      if (cur.kind === 'vertex') {
        setShapes((s) => {
          const polygon = s[cur.id].polygon.map((q, i) => (i === cur.index ? [cx, cy] : q));
          return { ...s, [cur.id]: { ...s[cur.id], polygon } };
        });
      } else if (cur.kind === 'pin') update(cur.id, { pin: { x: cx, y: cy } });
      else if (cur.kind.startsWith('ov')) {
        setShapes((s) => {
          const o = s[cur.id].overlay;
          let next = o;
          if (cur.kind === 'ovMove') next = { ...o, x: x + cur.dx, y: y + cur.dy };
          else if (cur.kind === 'ovScale') {
            const r = (-o.rotate * Math.PI) / 180;
            const lx = (x - o.x) * Math.cos(r) - (y - o.y) * Math.sin(r);
            const w = Math.max(20, Math.abs(lx) * 2);
            next = { ...o, w, h: (w * o.h) / o.w };
          } else {
            let deg = (Math.atan2(y - o.y, x - o.x) * 180) / Math.PI + 90;
            if (deg > 180) deg -= 360;
            for (const snap of [-90, 0, 90, 180]) if (Math.abs(deg - snap) < 2) deg = snap;
            next = { ...o, rotate: deg };
          }
          return { ...s, [cur.id]: { ...s[cur.id], overlay: next } };
        });
      }
    };
    const up = () => {
      const cur = drag.current;
      drag.current = null;
      if (cur && !cur.moved && !cur.noHistory) history.current.pop(); // nothing changed: no undo step
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onBackgroundDown = (e) => {
    if (e.button !== 0) return;
    const start = { x: e.clientX, y: e.clientY };
    if (tool === 'draw' && selected) {
      // a click adds a point, a drag pans
      const moveCheck = (ev) => {
        if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 4) {
          window.removeEventListener('pointermove', moveCheck);
          window.removeEventListener('pointerup', upCheck);
          startDrag(ev, { kind: 'pan', x: start.x, y: start.y, view });
        }
      };
      const upCheck = (ev) => {
        window.removeEventListener('pointermove', moveCheck);
        window.removeEventListener('pointerup', upCheck);
        const [x, y] = toImage(ev);
        commit((s) => ({ ...s, [selected]: { ...s[selected], polygon: [...s[selected].polygon, [x, y]] } }));
      };
      window.addEventListener('pointermove', moveCheck);
      window.addEventListener('pointerup', upCheck);
      return;
    }
    startDrag(e, { kind: 'pan', x: start.x, y: start.y, view });
  };

  const removePoint = (id, index) => {
    if (shapes[id].polygon.length <= 3) return;
    commit((s) => ({ ...s, [id]: { ...s[id], polygon: s[id].polygon.filter((_, i) => i !== index) } }));
  };

  // leaving the draw tool: a freshly drawn phase gets its pin in the middle of its area
  const finishDraw = useCallback(() => {
    setTool('select');
    setShapes((s) => {
      const e = s[selected];
      if (!e || !autoPin.current.has(selected) || e.polygon.length < 3) return s;
      const xs = e.polygon.map((q) => q[0]);
      const ys = e.polygon.map((q) => q[1]);
      return { ...s, [selected]: { ...e, pin: { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 } } };
    });
  }, [selected]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.('input, textarea, select')) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key.toLowerCase() === 'd') {
        if (tool === 'draw') finishDraw();
        else setTool('draw');
      } else if (e.key === 'Escape') finishDraw();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, tool, finishDraw]);

  const addPhase = () => {
    let n = list.length + 1;
    while (list.some((it) => it.id === `phase-${n}`) || plan.phases.some((p) => p.id === `phase-${n}`)) n += 1;
    const id = `phase-${n}`;
    commit((s) => ({ ...s, [id]: { polygon: [], pin: { x: plan.width / 2, y: plan.height / 2 } } }));
    setList((l) => [...l, { id, title: `New phase ${n}`, number: '', isNew: true }]);
    setDeleted((d) => d.filter((x) => x !== id));
    autoPin.current.add(id);
    setSelected(id);
    setTool('draw');
  };

  const deletePhase = () => {
    const item = list.find((it) => it.id === selected);
    if (!item || !window.confirm(`Delete "${item.title}"? Its area, pin and details are removed when you save.`)) return;
    const rest = list.filter((it) => it.id !== selected);
    setList(rest);
    if (plan.phases.some((p) => p.id === selected)) setDeleted((d) => [...d, selected]);
    setSelected(rest[0]?.id ?? null);
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setCopied('Copy failed: select the text and copy it manually');
    }
  };

  // Writes every phase's shape, pin and images to src/data/overrides/<project>.json (dev server).
  const saveToProject = async () => {
    const phases = Object.fromEntries(
      list.map(({ id, title, number, isNew }) => {
        const e = shapes[id];
        return [
          id,
          {
            ...(isNew ? { title, number, status: '', body: '', highlights: [], delivery: '', startingPrice: '', units: [] } : {}),
            polygon: e.polygon.map(([x, y]) => [num(x), num(y)]),
            pin: { x: num(e.pin.x), y: num(e.pin.y) },
            ...(e.image ? { image: e.image } : {}),
            ...(e.overlay ? { overlay: e.overlay } : {}),
          },
        ];
      }),
    );
    deleted.forEach((id) => {
      phases[id] = null;
    });
    try {
      const r = await fetch(`/__dev/save-project?key=${encodeURIComponent(projectKey)}`, {
        method: 'POST',
        body: JSON.stringify({ plan: { phases, order: list.map((it) => it.id) } }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? 'save failed');
      setCopied('Saved to project');
      if (list.some((it) => it.isNew) || deleted.length) {
        // added / deleted phases change the plan itself: reload it from the saved project
        localStorage.removeItem(META(projectKey));
        window.location.assign(`?project=${projectKey}`);
      }
    } catch (err) {
      setCopied(`Save failed: ${err.message}`);
    }
    setTimeout(() => setCopied(''), 2200);
  };

  const pickFile = (e, kind) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) setCropping({ kind, file });
  };

  const onCropSaved = async (blob, dims) => {
    const { kind } = cropping;
    const id = selected;
    setCropping(null);
    try {
      setStatus('Saving…');
      if (kind === 'panel') {
        const path = await upload(blob, `${projectKey}-${id}.jpg`);
        commit((s) => ({ ...s, [id]: { ...s[id], image: path } }));
        setStatus('Panel image saved');
      } else {
        const path = await upload(blob, `${projectKey}-${id}-overlay.webp`);
        commit((s) => {
          const e = s[id];
          const xs = e.polygon.map((q) => q[0]);
          const ys = e.polygon.map((q) => q[1]);
          const w = Math.max(40, Math.max(...xs) - Math.min(...xs));
          const overlay = { src: path, x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2, w, h: (w * dims.height) / dims.width, rotate: 0, opacity: 0.9 };
          return { ...s, [id]: { ...e, overlay } };
        });
        setStatus('Overlay saved: drag it into place');
      }
    } catch (err) {
      setStatus(`Save failed: ${err.message} (is the dev server running?)`);
    }
  };

  const output = useMemo(() => {
    if (!shapes) return { one: '', all: '' };
    return { one: selected && shapes[selected] ? snippet(selected, shapes[selected]) : '', all: list.map((it) => snippet(it.id, shapes[it.id])).join('\n\n') };
  }, [shapes, selected, list]);

  if (!plan) return <PlanSetup projectKey={projectKey} onProject={setProjectKey} />;
  if (!shapes || !view) return null;
  const u = unit();
  const sel = selected ? shapes[selected] : null;
  const reset = () => setView([0, 0, plan.width, plan.height]);
  const btn = 'px-3 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase border border-white/20 hover:bg-white hover:text-black transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row">
      <aside className="lg:w-[340px] flex-none border-b lg:border-b-0 lg:border-r border-white/10 p-5 flex flex-col gap-4 lg:h-screen lg:overflow-y-auto">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">Dev tool</div>
          <h1 className="text-lg font-light tracking-wide">Master plan editor</h1>
        </div>
        <select value={projectKey} onChange={(e) => setProjectKey(e.target.value)} className="bg-black border border-white/20 px-3 py-2 text-sm">
          {PLANS.map((p) => (
            <option key={p.key} value={p.key}>{p.name}{p.plan ? '' : ' (no plan yet)'}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button type="button" onClick={() => setTool('select')} className={`${btn} flex-1 ${tool === 'select' ? '!bg-white !text-black' : ''}`}>Select</button>
          <button type="button" onClick={() => (tool === 'draw' ? finishDraw() : setTool('draw'))} className={`${btn} flex-1 ${tool === 'draw' ? '!bg-white !text-black' : ''}`}>{tool === 'draw' ? 'Done (Esc)' : 'Draw (D)'}</button>
          <button type="button" onClick={undo} className={btn}>Undo</button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => zoomAt(view[0] + view[2] / 2, view[1] + view[3] / 2, 1 / 1.4)} className={btn}>+</button>
          <button type="button" onClick={() => zoomAt(view[0] + view[2] / 2, view[1] + view[3] / 2, 1.4)} className={btn}>&minus;</button>
          <button type="button" onClick={reset} className={`${btn} flex-1`}>Fit</button>
        </div>
        <p className="text-[11px] leading-relaxed text-white/45">
          {tool === 'draw'
            ? 'Click the plan to add points to the selected phase. Drag to pan. Press Esc when done.'
            : 'Drag a point or the pin. Drag a "+" on an edge to add a point; right-click a point to delete it.'}
        </p>

        <ol className="border-t border-white/10">
          {list.map((p, i) => (
            <li key={p.id} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setSelected(p.id)}
                className={`w-full text-left px-2 py-2.5 flex items-center gap-3 text-[12px] ${selected === p.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className="w-6 text-white/40 tabular-nums">{p.number || String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 truncate">{p.title}</span>
                <span className="text-white/30 tabular-nums">{shapes[p.id].polygon.length} pts</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <button type="button" onClick={addPhase} className={`${btn} flex-1`}>+ Add phase</button>
          <button type="button" onClick={deletePhase} disabled={!sel} className={btn}>Delete phase</button>
        </div>

        {sel && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button type="button" onClick={() => commit((s) => ({ ...s, [selected]: { ...s[selected], polygon: [] } }))} className={btn}>Clear</button>
              <button type="button" onClick={() => commit((s) => ({ ...s, [selected]: baseOf(plan)[selected] }))} className={btn}>Revert phase</button>
            </div>
            <div className="border border-white/10 p-3 flex flex-col gap-2">
              <div className="text-[10px] tracking-[0.24em] uppercase text-white/40">Images</div>
              <label className={`${btn} text-center cursor-pointer`}>
                Panel image (16:10)&hellip;
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e, 'panel')} />
              </label>
              {sel.image && (
                <div className="flex items-center gap-2">
                  <img src={sel.image} alt="" className="w-20 aspect-[16/10] object-cover border border-white/15" />
                  <span className="flex-1 min-w-0 truncate text-[10px] text-white/45">{sel.image}</span>
                  <button type="button" onClick={() => commit((s) => ({ ...s, [selected]: { ...s[selected], image: undefined } }))} className="text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white">Remove</button>
                </div>
              )}
              <label className={`${btn} text-center cursor-pointer`}>
                Plan overlay&hellip;
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e, 'overlay')} />
              </label>
              {sel.overlay && (
                <div className="flex flex-col gap-2 text-[11px] text-white/60">
                  <label className="flex items-center gap-3">
                    Opacity
                    <input type="range" min="0.1" max="1" step="0.05" value={sel.overlay.opacity} onChange={(e) => update(selected, { overlay: { ...sel.overlay, opacity: +e.target.value } })} className="flex-1" />
                  </label>
                  <div className="flex items-center justify-between tabular-nums">
                    <span>{num(sel.overlay.w)} &times; {num(sel.overlay.h)} px &middot; {sel.overlay.rotate.toFixed(1)}&deg;</span>
                    <span className="flex gap-3">
                      <button type="button" onClick={() => commit((s) => ({ ...s, [selected]: { ...s[selected], overlay: { ...s[selected].overlay, rotate: 0 } } }))} className="uppercase tracking-[0.18em] text-white/40 hover:text-white">Level</button>
                      <button type="button" onClick={() => commit((s) => ({ ...s, [selected]: { ...s[selected], overlay: undefined } }))} className="uppercase tracking-[0.18em] text-white/40 hover:text-white">Remove</button>
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/35">Drag the image to place it, the square to scale, the circle to rotate.</p>
                </div>
              )}
              <div className="text-[11px] text-champagne min-h-4">{status}</div>
            </div>
            <textarea readOnly value={output.one} rows={6} className="w-full bg-black border border-white/15 p-2 font-mono text-[11px] text-white/80" onFocus={(e) => e.target.select()} />
            <div className="flex gap-2">
              <button type="button" onClick={() => copy(output.one, 'Phase code copied')} className={`${btn} flex-1`}>Copy phase</button>
              <button type="button" onClick={() => copy(output.all, 'All phases copied')} className={`${btn} flex-1`}>Copy all</button>
            </div>
            <button type="button" onClick={saveToProject} className={`${btn} w-full bg-white text-black`}>Save to project</button>
            <div className="text-[11px] text-champagne h-4">{copied}</div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard every edit for this plan and go back to the data file?')) {
                  localStorage.removeItem(DRAFT(projectKey));
                  setShapes(baseOf(plan));
                  history.current = [];
                }
              }}
              className="text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-white text-left"
            >
              Discard all edits
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 min-w-0 h-[70vh] lg:h-screen">
        <svg
          ref={svgRef}
          viewBox={view.join(' ')}
          className={`w-full h-full bg-black select-none touch-none ${tool === 'draw' ? 'cursor-crosshair' : 'cursor-grab'}`}
          onPointerDown={onBackgroundDown}
          onContextMenu={(e) => e.preventDefault()}
        >
          <image href={plan.image} x="0" y="0" width={plan.width} height={plan.height} />
          {list.map((p) => {
            const o = shapes[p.id].overlay;
            return (
              o && (
                <image
                  key={`ov-${p.id}`}
                  href={o.src}
                  x={o.x - o.w / 2}
                  y={o.y - o.h / 2}
                  width={o.w}
                  height={o.h}
                  preserveAspectRatio="none"
                  transform={`rotate(${o.rotate} ${o.x} ${o.y})`}
                  opacity={o.opacity}
                  className="pointer-events-none"
                />
              )
            );
          })}
          {list.map((p) => {
            const e = shapes[p.id];
            const on = p.id === selected;
            if (e.polygon.length < 2) return null;
            const pts = e.polygon.map((q) => q.join(',')).join(' ');
            return (
              <g key={p.id}>
                {e.polygon.length >= 3 ? (
                  <polygon
                    points={pts}
                    fill={on ? 'rgba(255,209,102,0.22)' : 'rgba(255,255,255,0.06)'}
                    stroke={on ? '#ffd166' : 'rgba(255,255,255,0.7)'}
                    strokeWidth={(on ? 2 : 1.5) * u}
                    strokeDasharray={on ? undefined : `${6 * u} ${4 * u}`}
                    onPointerDown={(ev) => {
                      if (tool !== 'select') return;
                      ev.stopPropagation();
                      setSelected(p.id);
                    }}
                    className={tool === 'select' ? 'cursor-pointer' : ''}
                  />
                ) : (
                  <polyline points={pts} fill="none" stroke="#ffd166" strokeWidth={2 * u} />
                )}
              </g>
            );
          })}

          {/* overlay handles for the selected phase */}
          {sel?.overlay && tool === 'select' && (
            <g transform={`rotate(${sel.overlay.rotate} ${sel.overlay.x} ${sel.overlay.y})`}>
              <rect
                x={sel.overlay.x - sel.overlay.w / 2}
                y={sel.overlay.y - sel.overlay.h / 2}
                width={sel.overlay.w}
                height={sel.overlay.h}
                fill="transparent"
                stroke="#5ec8ff"
                strokeWidth={1.5 * u}
                strokeDasharray={`${6 * u} ${4 * u}`}
                className="cursor-move"
                onPointerDown={(ev) => {
                  if (ev.button !== 0) return;
                  const [x, y] = toImage(ev);
                  startDrag(ev, { kind: 'ovMove', id: selected, dx: sel.overlay.x - x, dy: sel.overlay.y - y });
                }}
              />
              <line x1={sel.overlay.x} y1={sel.overlay.y - sel.overlay.h / 2} x2={sel.overlay.x} y2={sel.overlay.y - sel.overlay.h / 2 - 26 * u} stroke="#5ec8ff" strokeWidth={1.2 * u} />
              <circle
                cx={sel.overlay.x}
                cy={sel.overlay.y - sel.overlay.h / 2 - 26 * u}
                r={6 * u}
                fill="#5ec8ff"
                stroke="#000"
                strokeWidth={1.5 * u}
                className="cursor-grab"
                onPointerDown={(ev) => ev.button === 0 && startDrag(ev, { kind: 'ovRotate', id: selected })}
              />
              <rect
                x={sel.overlay.x + sel.overlay.w / 2 - 6 * u}
                y={sel.overlay.y + sel.overlay.h / 2 - 6 * u}
                width={12 * u}
                height={12 * u}
                fill="#5ec8ff"
                stroke="#000"
                strokeWidth={1.5 * u}
                className="cursor-nwse-resize"
                onPointerDown={(ev) => ev.button === 0 && startDrag(ev, { kind: 'ovScale', id: selected })}
              />
            </g>
          )}

          {/* handles for the selected phase */}
          {sel &&
            sel.polygon.map((q, i) => {
              const nxt = sel.polygon[(i + 1) % sel.polygon.length];
              const mid = [(q[0] + nxt[0]) / 2, (q[1] + nxt[1]) / 2];
              return (
                <g key={i}>
                  {tool === 'select' && sel.polygon.length >= 3 && (
                    <g
                      className="cursor-copy"
                      onPointerDown={(ev) => {
                        history.current.push(shapes);
                        setShapes((s) => {
                          const polygon = [...s[selected].polygon];
                          polygon.splice(i + 1, 0, mid);
                          return { ...s, [selected]: { ...s[selected], polygon } };
                        });
                        startDrag(ev, { kind: 'vertex', id: selected, index: i + 1, noHistory: true });
                      }}
                    >
                      <circle cx={mid[0]} cy={mid[1]} r={6 * u} fill="rgba(0,0,0,0.6)" stroke="#ffd166" strokeWidth={1 * u} />
                      <path d={`M${mid[0] - 3 * u} ${mid[1]}h${6 * u}M${mid[0]} ${mid[1] - 3 * u}v${6 * u}`} stroke="#ffd166" strokeWidth={1.2 * u} />
                    </g>
                  )}
                  <circle
                    cx={q[0]}
                    cy={q[1]}
                    r={6 * u}
                    fill="#ffd166"
                    stroke="#000"
                    strokeWidth={1.5 * u}
                    className="cursor-move"
                    onPointerDown={(ev) => (ev.button === 0 && tool === 'select' ? startDrag(ev, { kind: 'vertex', id: selected, index: i }) : ev.stopPropagation())}
                    onContextMenu={(ev) => {
                      ev.preventDefault();
                      removePoint(selected, i);
                    }}
                  />
                </g>
              );
            })}

          {/* pins */}
          {list.map((p) => {
            const e = shapes[p.id];
            const on = p.id === selected;
            return (
              <g
                key={`pin-${p.id}`}
                className="cursor-move"
                onPointerDown={(ev) => {
                  if (tool !== 'select' || ev.button !== 0) return ev.stopPropagation();
                  setSelected(p.id);
                  startDrag(ev, { kind: 'pin', id: p.id });
                }}
              >
                <circle cx={e.pin.x} cy={e.pin.y} r={13 * u} fill={on ? '#fff' : 'rgba(0,0,0,0.8)'} stroke={on ? '#000' : 'rgba(255,255,255,0.5)'} strokeWidth={1.5 * u} />
                <text x={e.pin.x} y={e.pin.y} textAnchor="middle" dominantBaseline="central" fontSize={11 * u} fontWeight="700" fill={on ? '#000' : '#fff'} className="pointer-events-none">
                  {p.number || String(list.indexOf(p) + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>
      </main>
      {cropping && (
        <ImageCropper
          file={cropping.file}
          aspect={cropping.kind === 'panel' ? 16 / 10 : null}
          maxWidth={cropping.kind === 'panel' ? 1600 : 2048}
          type={cropping.kind === 'panel' ? 'image/jpeg' : 'image/webp'}
          title={cropping.kind === 'panel' ? 'Panel image' : 'Plan overlay'}
          onSave={onCropSaved}
          onCancel={() => setCropping(null)}
        />
      )}
    </div>
  );
}

// A project with no master plan yet: upload the plan image, then draw its phases in the editor.
function PlanSetup({ projectKey, onProject }) {
  const [msg, setMsg] = useState('');
  const project = PLANS.find((p) => p.key === projectKey);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type];
    if (!ext) return setMsg('Use a PNG, JPG or WebP image.');
    try {
      setMsg('Uploading…');
      const dims = await new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
          URL.revokeObjectURL(url);
        };
        img.onerror = () => reject(new Error('could not read the image'));
        img.src = url;
      });
      const path = await upload(file, `${projectKey}-masterplan.${ext}`);
      const r = await fetch(`/__dev/save-project?key=${encodeURIComponent(projectKey)}`, {
        method: 'POST',
        body: JSON.stringify({
          plan: {
            image: path,
            ...dims,
            alt: `Master plan of ${project.name}`,
            caption: `${project.name} · master plan`,
            note: 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.',
            phases: {},
          },
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? 'save failed');
      window.location.assign(`?project=${projectKey}`);
    } catch (err) {
      setMsg(`Failed: ${err.message} (is the dev server running?)`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="text-[10px] tracking-[0.28em] uppercase text-white/40">Dev tool</div>
        <h1 className="text-lg font-light tracking-wide">Master plan editor</h1>
        <select value={projectKey} onChange={(e) => onProject(e.target.value)} className="bg-black border border-white/20 px-3 py-2 text-sm">
          {PLANS.map((p) => (
            <option key={p.key} value={p.key}>{p.name}{p.plan ? '' : ' (no plan yet)'}</option>
          ))}
        </select>
        <p className="text-sm leading-relaxed text-white/60">
          {project.name} has no master plan yet. Upload the plan image (PNG, JPG or WebP); you can then draw its phases on it.
        </p>
        <label className="px-3 py-3 text-center text-[11px] font-semibold tracking-[0.14em] uppercase bg-white text-black cursor-pointer">
          Upload master plan image&hellip;
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFile} />
        </label>
        <div className="text-[11px] text-champagne min-h-4">{msg}</div>
      </div>
    </div>
  );
}
