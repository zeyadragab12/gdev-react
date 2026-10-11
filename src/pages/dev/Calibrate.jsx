import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PROJECTS } from '../../data/projects.js';
import { PROJECT_GEO } from '../../data/projectGeo.js';
import { clippedPlanUrl, footprint, hasBoundary, mapPlan, metresBetween } from '../../components/map/geo.js';

// DEV ONLY (route /dev/calibrate, not registered in production builds).
// Lay a project's master plan over the satellite map and line it up with the real ground, and trace its boundary:
//   - drag the round handle to move the plan,
//   - drag the square corner handle to scale and rotate it (the plan is never stretched),
//   - "Draw boundary": click around the edge of the land to trace the real site outline (drag points to adjust,
//     right-click a point to delete it),
//   - then copy the generated entry into src/data/projectGeo.js.

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/satellite-streets-v12';
const DRAFT_KEY = (key) => `gd-calibrate-${key}`;
const KEYS = PROJECTS.filter((p) => PROJECT_GEO[p.key]).map((p) => p.key);
// any plan image works as the placeholder the image source starts with
const FIRST_PLAN = PROJECTS.map((p) => mapPlan(p, PROJECT_GEO[p.key])).find(Boolean);

const round = (n, d) => +n.toFixed(d);
const readDraft = (key) => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY(key)));
  } catch {
    return null;
  }
};
const startGeo = (key) => ({ ...PROJECT_GEO[key], ...(readDraft(key) ?? {}) });

function handleEl(kind) {
  const el = document.createElement('div');
  el.style.cssText =
    kind === 'center'
      ? 'width:22px;height:22px;border-radius:50%;background:rgba(245,244,240,.25);border:2px solid #f5f4f0;box-shadow:0 0 0 1px #000;cursor:move'
      : 'width:18px;height:18px;background:#f5f4f0;border:2px solid #000;cursor:nwse-resize';
  el.title = kind === 'center' ? 'Drag to move the plan' : 'Drag to scale and rotate the plan';
  el.addEventListener('click', (e) => e.stopPropagation()); // a click on a handle must not add a boundary point
  return el;
}

function vertexEl(n) {
  const el = document.createElement('div');
  el.style.cssText =
    'width:16px;height:16px;border-radius:50%;background:#ffd166;border:2px solid #000;cursor:move;display:grid;place-items:center;font:700 8px/1 sans-serif;color:#000';
  el.title = `Point ${n}: drag to move, right-click to delete`;
  el.textContent = String(n);
  el.addEventListener('click', (e) => e.stopPropagation());
  return el;
}

export default function Calibrate() {
  const box = useRef(null);
  const mapRef = useRef(null);
  const centerMarker = useRef(null);
  const cornerMarker = useRef(null);
  const dragging = useRef(null);
  const [ready, setReady] = useState(false);
  const [key, setKey] = useState(KEYS[0]);
  const [geo, setGeo] = useState(() => startGeo(KEYS[0]));
  const [opacity, setOpacity] = useState(0.7);
  const [copied, setCopied] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [clip, setClip] = useState(true); // preview: show the plan only inside the boundary
  const drawingRef = useRef(false);
  drawingRef.current = drawing;
  const vertexMarkers = useRef([]);

  const project = PROJECTS.find((p) => p.key === key);
  const plan = mapPlan(project, PROJECT_GEO[key]); // static data: the tool never edits mapImage
  const aspect = plan ? plan.height / plan.width : (geo.heightKm ?? geo.widthKm) / geo.widthKm;
  const fp = useMemo(() => footprint(geo, plan), [geo, plan]);
  const geoRef = useRef(geo);
  geoRef.current = geo;
  const aspectRef = useRef(aspect);
  aspectRef.current = aspect;

  // map + handles, created once
  useEffect(() => {
    const map = new mapboxgl.Map({ container: box.current, style: STYLE, center: geoRef.current.center, zoom: 14, dragRotate: false, pitchWithRotate: false });
    mapRef.current = map;
    window.__gdMap = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    map.touchZoomRotate.disableRotation();

    centerMarker.current = new mapboxgl.Marker({ element: handleEl('center'), draggable: true }).setLngLat(geoRef.current.center).addTo(map);
    cornerMarker.current = new mapboxgl.Marker({ element: handleEl('corner'), draggable: true }).setLngLat(geoRef.current.center).addTo(map);

    centerMarker.current.on('dragstart', () => (dragging.current = 'center'));
    centerMarker.current.on('drag', () => {
      const { lng, lat } = centerMarker.current.getLngLat();
      setGeo((g) => ({ ...g, center: [lng, lat] }));
    });
    cornerMarker.current.on('dragstart', () => (dragging.current = 'corner'));
    cornerMarker.current.on('drag', () => {
      const { lng, lat } = cornerMarker.current.getLngLat();
      setGeo((g) => {
        const ar = aspectRef.current;
        const [e, n] = metresBetween(g.center, [lng, lat]);
        const bearing = (Math.atan2(e, n) * 180) / Math.PI;
        const corner0 = (Math.atan2(1, ar) * 180) / Math.PI; // bearing of the top-right corner when the plan is unrotated
        let rotation = bearing - corner0;
        rotation = ((((rotation + 180) % 360) + 360) % 360) - 180;
        const widthKm = (2 * Math.hypot(e, n)) / Math.sqrt(1 + ar * ar) / 1000;
        return { ...g, rotation, widthKm };
      });
    });
    const release = () => (dragging.current = null);
    centerMarker.current.on('dragend', release);
    cornerMarker.current.on('dragend', release);

    map.on('load', () => {
      map.addSource('plan', { type: 'image', url: FIRST_PLAN.image, coordinates: [[0, 1], [1, 1], [1, 0], [0, 0]] });
      map.addLayer({ id: 'plan', type: 'raster', source: 'plan', paint: { 'raster-opacity': 0.7, 'raster-fade-duration': 0 } });
      map.addSource('frame', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'frame', type: 'line', source: 'frame', paint: { 'line-color': '#f5f4f0', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
      map.addSource('boundary', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'boundary-fill', type: 'fill', source: 'boundary', filter: ['==', '$type', 'Polygon'], paint: { 'fill-color': '#ffd166', 'fill-opacity': 0.12 } });
      map.addLayer({ id: 'boundary-line', type: 'line', source: 'boundary', filter: ['==', '$type', 'LineString'], paint: { 'line-color': '#ffd166', 'line-width': 2.5 } });
      map.on('click', (e) => {
        if (!drawingRef.current) return;
        setGeo((g) => ({ ...g, outline: [...(g.outline ?? []), [e.lngLat.lng, e.lngLat.lat]] }));
      });
      map.doubleClickZoom.disable(); // double-clicking while tracing must not zoom
      setReady(true);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // switching project: load its geo (draft first) and swap the plan image
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    const next = startGeo(key);
    setGeo(next);
    const src = map.getSource('plan');
    if (plan) {
      src.updateImage({ url: plan.image, coordinates: footprint(next, plan).corners });
      map.setLayoutProperty('plan', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('plan', 'visibility', 'none'); // no plan image yet: calibrate the square outline only
    }
    map.fitBounds(footprint(next, plan).bounds, { padding: 90, duration: 0, maxZoom: 17 }); // whole plan in view, so both handles are reachable
  }, [ready, key]);

  // draw the current footprint, move the handles, store a draft
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (plan) map.getSource('plan').setCoordinates(fp.corners);
    map.getSource('frame').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [...fp.corners, fp.corners[0]] } });
    const pts = geo.outline ?? [];
    const features = [];
    if (pts.length >= 3) features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[...pts, pts[0]]] } });
    if (pts.length >= 2) features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: pts.length >= 3 ? [...pts, pts[0]] : pts } });
    map.getSource('boundary').setData({ type: 'FeatureCollection', features });
    if (dragging.current !== 'center') centerMarker.current.setLngLat(geo.center);
    if (dragging.current !== 'corner') cornerMarker.current.setLngLat(fp.corners[1]);
    try {
      localStorage.setItem(DRAFT_KEY(key), JSON.stringify(geo));
    } catch {
      /* drafts are a convenience only */
    }
  }, [ready, fp, geo, key, plan]);

  // one draggable marker per boundary point
  useEffect(() => {
    if (!ready) return;
    const pts = geo.outline ?? [];
    const ms = vertexMarkers.current;
    while (ms.length < pts.length) {
      const i = ms.length;
      const m = new mapboxgl.Marker({ element: vertexEl(i + 1), draggable: true }).setLngLat(pts[i]).addTo(mapRef.current);
      m.on('dragstart', () => (dragging.current = `v${i}`));
      m.on('drag', () => {
        const { lng, lat } = m.getLngLat();
        setGeo((g) => ({ ...g, outline: g.outline.map((q, k) => (k === i ? [lng, lat] : q)) }));
      });
      m.on('dragend', () => (dragging.current = null));
      m.getElement().addEventListener('contextmenu', (e) => {
        e.preventDefault();
        setGeo((g) => ({ ...g, outline: g.outline.filter((_, k) => k !== i) }));
      });
      ms.push(m);
    }
    while (ms.length > pts.length) ms.pop().remove();
    ms.forEach((m, i) => {
      if (dragging.current !== `v${i}`) m.setLngLat(pts[i]);
    });
  }, [ready, geo.outline]);

  useEffect(() => {
    if (ready) mapRef.current.getCanvas().style.cursor = drawing ? 'crosshair' : '';
  }, [ready, drawing]);

  // the plan image shown on the map: cut to the boundary when there is one (not while drawing, so the
  // surroundings stay visible), otherwise the full image. Debounced: it re-renders a canvas.
  const clipOn = clip && !drawing && hasBoundary(geo);
  const clipKey = clipOn ? JSON.stringify([geo.outline, geo.center, geo.widthKm, geo.rotation]) : '';
  const shownUrl = useRef(null);
  useEffect(() => {
    if (!ready || !plan) return undefined;
    let stale = false;
    const t = setTimeout(async () => {
      const g = geoRef.current;
      let url = plan.image;
      if (clipOn) {
        try {
          url = await clippedPlanUrl(g, plan);
        } catch {
          url = plan.image;
        }
      }
      if (stale || !mapRef.current) return;
      if (shownUrl.current?.startsWith('blob:')) URL.revokeObjectURL(shownUrl.current);
      shownUrl.current = url;
      mapRef.current.getSource('plan').updateImage({ url, coordinates: footprint(g, plan).corners });
    }, 250);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [ready, key, plan, clipOn, clipKey]);

  useEffect(() => {
    if (ready) mapRef.current.setPaintProperty('plan', 'raster-opacity', opacity);
  }, [ready, opacity]);

  const [verified, setVerified] = useState(false);
  const line = useMemo(() => {
    const parts = [];
    if (geo.mapImage) parts.push(`mapImage: { src: '${geo.mapImage.src}', width: ${geo.mapImage.width}, height: ${geo.mapImage.height} }`);
    parts.push(`center: [${round(geo.center[0], 7)}, ${round(geo.center[1], 7)}]`, `widthKm: ${round(geo.widthKm, 3)}`);
    if (!plan) parts.push(`heightKm: ${round(geo.heightKm ?? geo.widthKm, 3)}`);
    parts.push(`rotation: ${round(geo.rotation ?? 0, 2)}`, `verified: ${verified}`);
    const name = key.includes('-') ? `'${key}'` : key;
    const pts = geo.outline ?? [];
    if (pts.length < 3) return `${name}: { ${parts.join(', ')} },`;
    const ring = pts.map((q) => `    [${round(q[0], 7)}, ${round(q[1], 7)}],`).join('\n');
    return `${name}: {\n  ${parts.join(', ')},\n  outline: [\n${ring}\n  ],\n},`;
  }, [geo, key, plan, verified]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* the line is also selectable in the box below */
    }
  };
  const resetDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY(key));
    } catch {
      /* ignore */
    }
    setDrawing(false);
    setGeo({ ...PROJECT_GEO[key] });
  };
  const points = geo.outline?.length ?? 0;
  const set = (patch) => setGeo((g) => ({ ...g, ...patch }));
  const field = 'w-full bg-black border border-white/20 px-2 py-1.5 text-white tabular-nums outline-none focus:border-champagne';

  return (
    <div className="flex h-screen bg-black text-[13px] text-white">
      <aside className="flex w-[340px] flex-none flex-col gap-5 overflow-y-auto border-r border-white/10 p-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Dev tool</div>
          <h1 className="mt-1 text-lg font-light uppercase tracking-[0.1em] text-champagne">Plan calibration</h1>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-white/60">Project</span>
          <select value={key} onChange={(e) => setKey(e.target.value)} className={field}>
            {KEYS.map((k) => {
              const p = PROJECTS.find((x) => x.key === k);
              return (
                <option key={k} value={k}>
                  {p.name}
                  {mapPlan(p, PROJECT_GEO[k]) ? '' : ' (no plan image yet)'}
                </option>
              );
            })}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-white/60">Plan opacity · {Math.round(opacity * 100)}%</span>
          <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(+e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Width (km)</span>
            <input type="number" step="0.01" min="0.05" value={round(geo.widthKm, 3)} onChange={(e) => set({ widthKm: Math.max(0.05, +e.target.value) })} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Rotation (°)</span>
            <input type="number" step="0.5" value={round(geo.rotation ?? 0, 2)} onChange={(e) => set({ rotation: +e.target.value })} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Latitude</span>
            <input type="number" step="0.0001" value={round(geo.center[1], 7)} onChange={(e) => set({ center: [geo.center[0], +e.target.value] })} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-white/60">Longitude</span>
            <input type="number" step="0.0001" value={round(geo.center[0], 7)} onChange={(e) => set({ center: [+e.target.value, geo.center[1]] })} className={field} />
          </label>
        </div>
        {plan && (
          <div className="text-white/50">
            Height follows the image: {round(geo.widthKm * aspect, 2)} km (aspect {round(aspect, 3)}).
          </div>
        )}

        <div className="flex flex-col gap-2 border border-white/10 p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-[0.18em] text-[#ffd166]">Site boundary</span>
            <span className="text-white/50">
              {points} {points === 1 ? 'point' : 'points'}
            </span>
          </div>
          <div className="text-white/55">
            {drawing
              ? 'Click around the edge of the land, point by point. 3 or more points make the area.'
              : points >= 3
                ? 'Boundary drawn. Drag a point to adjust it, right-click a point to delete it.'
                : 'Trace the real edge of the site on the satellite image.'}
          </div>
          {points >= 3 && plan && (
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" checked={clip} onChange={(e) => setClip(e.target.checked)} />
              <span>Show the plan only inside the boundary</span>
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDrawing((d) => !d)}
              className={`px-3 py-2 font-semibold ${drawing ? 'bg-[#ffd166] text-black' : 'border border-[#ffd166]/60 text-[#ffd166] hover:bg-[#ffd166]/10'}`}
            >
              {drawing ? 'Finish drawing' : points ? 'Add more points' : 'Draw boundary'}
            </button>
            <button type="button" disabled={!points} onClick={() => set({ outline: (geo.outline ?? []).slice(0, -1) })} className="border border-white/25 px-3 py-2 hover:border-champagne disabled:opacity-30">
              Undo point
            </button>
            <button
              type="button"
              disabled={!points}
              onClick={() => {
                setDrawing(false);
                set({ outline: [] });
              }}
              className="border border-white/25 px-3 py-2 hover:border-champagne disabled:opacity-30"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => mapRef.current?.fitBounds(fp.bounds, { padding: 90, duration: 1000, maxZoom: 17 })} className="border border-white/25 px-3 py-2 hover:border-champagne">
            Fit view
          </button>
          <button type="button" onClick={resetDraft} className="border border-white/25 px-3 py-2 hover:border-champagne">
            Reset to saved
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span>Mark as verified (hides “Indicative location”)</span>
          </label>
          <div className="text-white/60">Paste this over the project’s entry in src/data/projectGeo.js:</div>
          <textarea readOnly value={line} rows={points >= 3 ? 9 : 4} onFocus={(e) => e.target.select()} className="w-full resize-none border border-white/20 bg-black p-2 font-mono text-[12px] text-champagne" />
          <button type="button" onClick={copy} className="border border-champagne/60 px-4 py-2.5 font-semibold uppercase tracking-[0.2em] text-champagne hover:bg-champagne/10">
            {copied ? 'Copied' : 'Copy line'}
          </button>
          <div className="text-white/40">Edits are kept in this browser as a draft, so you can switch projects freely.</div>
        </div>
      </aside>
      <div ref={box} className="h-full flex-1" />
    </div>
  );
}
