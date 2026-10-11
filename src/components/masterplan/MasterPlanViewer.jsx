import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PhaseOverlay from './PhaseOverlay.jsx';
import PhaseControls from './PhaseControls.jsx';
import fitView, { clampView, zoomView } from './fitView.js';
import useMapCamera from './useMapCamera.js';

const MAX_ZOOM = 7; // relative to the full-plan view
const DRAG_THRESHOLD = 6; // px before a press becomes a pan (so taps still select)

// A custom image (detail plan, render, aerial) placed over its exact area of the plan; it
// fades in when its phase is selected. `overlay`: { src, x, y, w, h, rotate?, opacity? }, x/y = centre.
const PlanOverlayImage = memo(function PlanOverlayImage({ overlay, visible }) {
  const { src, x, y, w, h, rotate = 0, opacity = 1 } = overlay;
  return (
    <image
      href={src}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      preserveAspectRatio="none"
      className="pointer-events-none"
      style={{ opacity: visible ? opacity : 0, transition: 'opacity 700ms ease' }}
    />
  );
});

const Pins = memo(function Pins({ phases, selectedId, hoveredId, pinsRef, onSelect, onHover }) {
  return (
    <div ref={pinsRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {phases.map((p) => {
        const selected = p.id === selectedId;
        const hovered = p.id === hoveredId;
        return (
          <button
            key={p.id}
            type="button"
            aria-label={`${p.number} ${p.title}`}
            aria-pressed={selected}
            onClick={() => onSelect(p.id)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(p.id)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && onHover(null)}
            onFocus={() => onHover(p.id)}
            onBlur={() => onHover(null)}
            className="mp-focus group pointer-events-auto absolute left-0 top-0 -ml-[15px] -mt-[15px] will-change-transform"
          >
            <span
              data-state={selected ? 'selected' : hovered ? 'hovered' : 'idle'}
              className={`mp-pin-dot flex w-[30px] h-[30px] items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-all duration-300 ${
                selected
                  ? 'scale-125 border-white bg-white text-black'
                  : hovered
                    ? 'scale-110 border-champagne bg-champagne text-black'
                    : `border-white/40 bg-black/80 text-white ${selectedId ? 'opacity-60' : ''}`
              }`}
            >
              {p.number}
            </span>
            <span
              className={`pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 border border-glass-strong bg-black/80 backdrop-blur-sm text-[10px] font-semibold tracking-[0.2em] uppercase text-white transition-opacity duration-300 ${
                hovered && !selected ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {p.title}
            </span>
          </button>
        );
      })}
    </div>
  );
});

// The plan image with the interactive overlay. The camera (an SVG viewBox) flies to the
// selected phase and back; the visitor can also drag, pinch and zoom it freely.
// `bottomInset` is the fraction of the frame covered by the mobile sheet.
export default function MasterPlanViewer({ plan, phases, selectedId, hoveredId, bottomInset = 0, onSelect, onHover, onReset, children }) {
  const frameRef = useRef(null);
  const svgRef = useRef(null);
  const pinsRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [zoomed, setZoomed] = useState(false);

  const bounds = useMemo(() => [plan.width, plan.height], [plan]);
  const pinPoints = useMemo(() => phases.map((p) => p.pin), [phases]);
  const cam = useMapCamera({ svgRef, pinsRef, size, pinPoints });

  useLayoutEffect(() => {
    const el = frameRef.current;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const aspect = size.w / size.h;
  const home = useMemo(() => (size.w ? fitView([0, 0, plan.width, plan.height], 0.02, aspect, bounds) : null), [size.w, aspect, plan, bounds]);
  const target = useMemo(() => {
    if (!home) return null;
    const phase = phases.find((p) => p.id === selectedId);
    if (!phase) return home;
    return phase.zoom ? zoomView(home, phase.center, phase.zoom, aspect, bounds, bottomInset) : fitView(phase.bbox, 0.1, aspect, bounds, bottomInset);
  }, [home, phases, selectedId, aspect, bounds, bottomInset]);

  const insetRef = useRef(bottomInset);
  insetRef.current = bottomInset;
  const homeRef = useRef(home);
  homeRef.current = home;

  // fly to the target whenever the selection (or the frame) changes; the first one jumps
  useLayoutEffect(() => {
    if (!target) return;
    if (cam.get()) cam.flyTo(target);
    else cam.apply(target);
    setZoomed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // ---- free pan / zoom ----
  const pointers = useRef(new Map());
  const press = useRef({ x: 0, y: 0, moved: false });

  const zoomAbout = useCallback(
    (fx, fy, factor, animate = false) => {
      const v = cam.get();
      const h = homeRef.current;
      if (!v || !h) return;
      // never zoom past MAX_ZOOM, but a view that is already past it (a small phase) just stops
      const w = Math.min(h[2], Math.max(Math.min(h[2] / MAX_ZOOM, v[2]), v[2] / factor));
      const k = v[2] / size.w;
      const px = v[0] + fx * k;
      const py = v[1] + fy * k;
      const nk = w / size.w;
      const next = clampView([px - fx * nk, py - fy * nk, w, (w * v[3]) / v[2]], bounds, insetRef.current);
      if (animate) cam.flyTo(next, 350);
      else cam.apply(next);
      setZoomed(w < h[2] - 1);
    },
    [cam, size.w, bounds],
  );

  const panBy = useCallback(
    (dx, dy) => {
      const v = cam.get();
      if (!v) return;
      const k = v[2] / size.w;
      cam.apply(clampView([v[0] - dx * k, v[1] - dy * k, v[2], v[3]], bounds, insetRef.current));
    },
    [cam, size.w, bounds],
  );

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cam.cancel();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) press.current = { x: e.clientX, y: e.clientY, moved: false };
    else press.current.moved = true;
  };
  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const rect = frameRef.current.getBoundingClientRect();
    if (pointers.current.size === 1) {
      if (!press.current.moved && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > DRAG_THRESHOLD) {
        press.current.moved = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (press.current.moved) panBy(e.clientX - prev.x, e.clientY - prev.y);
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.entries()].map(([id, pt]) => (id === e.pointerId ? { x: e.clientX, y: e.clientY } : pt));
      const [pa, pb] = [...pointers.current.values()];
      const factor = Math.hypot(a.x - b.x, a.y - b.y) / (Math.hypot(pa.x - pb.x, pa.y - pb.y) || 1);
      zoomAbout((a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top, factor);
      panBy((a.x + b.x - pa.x - pb.x) / 2, (a.y + b.y - pa.y - pb.y) / 2);
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (press.current.moved) setZoomed((z) => z || cam.get()[2] < homeRef.current[2] - 1);
  };
  const onPointerEnd = (e) => {
    pointers.current.delete(e.pointerId);
    // the click that ends a drag fires right after pointerup; clear the flag after it
    if (!pointers.current.size) setTimeout(() => { press.current.moved = false; }, 0);
  };

  // Ctrl/Cmd + wheel (and trackpad pinch) zooms; a plain wheel keeps scrolling the page
  useEffect(() => {
    const el = frameRef.current;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAbout(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0022));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAbout]);

  // a press that turned into a drag must not select the phase under the pointer
  const select = useCallback(
    (id) => {
      if (!press.current.moved) onSelect(id);
    },
    [onSelect],
  );

  // dev aid: Alt+click copies the image coordinates, for tracing polygons
  const onClickCapture = (e) => {
    if (!import.meta.env.DEV || !e.altKey) return;
    const v = cam.get();
    const rect = frameRef.current.getBoundingClientRect();
    const k = v[2] / size.w;
    const pt = `[${Math.round(v[0] + (e.clientX - rect.left) * k)}, ${Math.round(v[1] + (e.clientY - rect.top) * k)}]`;
    e.stopPropagation();
    navigator.clipboard?.writeText(pt);
    console.info('master plan point', pt);
  };

  const canReset = selectedId != null || zoomed;

  return (
    <div
      ref={frameRef}
      className="mp-frame relative h-[min(78svh,640px)] lg:h-[min(82vh,860px)] overflow-hidden bg-[var(--mp-bg,#060606)] select-none"
      style={{ touchAction: canReset ? 'none' : 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={onClickCapture}
    >
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" role="group" aria-label={plan.alt}>
        <image className="mp-plan-image" href={plan.image} x="0" y="0" width={plan.width} height={plan.height} />
        {phases.map((p) => p.overlay && <PlanOverlayImage key={p.id} overlay={p.overlay} visible={p.id === selectedId} />)}
        <PhaseOverlay phases={phases} selectedId={selectedId} hoveredId={hoveredId} image={plan.image} width={plan.width} height={plan.height} onSelect={select} onHover={onHover} />
      </svg>
      <Pins phases={phases} selectedId={selectedId} hoveredId={hoveredId} pinsRef={pinsRef} onSelect={select} onHover={onHover} />

      <button
        type="button"
        onClick={onReset}
        tabIndex={canReset ? 0 : -1}
        className={`mp-focus absolute left-4 top-4 md:left-6 md:top-5 inline-flex items-center gap-3 px-4 py-2.5 border border-glass-strong bg-black/75 backdrop-blur-sm text-[11px] font-semibold tracking-[0.2em] uppercase text-white/85 hover:text-black hover:bg-champagne transition-all duration-500 ${
          canReset ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
        }`}
      >
        <span aria-hidden="true">&larr;</span> Full plan
      </button>
      <div className="absolute right-4 top-4 md:right-6 md:top-5">
        <PhaseControls onZoomIn={() => zoomAbout(size.w / 2, size.h / 2, 1.7, true)} onZoomOut={() => zoomAbout(size.w / 2, size.h / 2, 1 / 1.7, true)} />
      </div>
      <div className={`pointer-events-none absolute left-4 bottom-4 md:left-6 md:bottom-5 text-[10px] tracking-[0.24em] uppercase text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] transition-opacity duration-500 ${selectedId && bottomInset ? 'opacity-0' : ''}`}>
        {plan.caption}
        {canReset && <span className="hidden lg:inline text-white/45"> &middot; drag to pan &middot; Ctrl + scroll to zoom</span>}
      </div>
      {children}
    </div>
  );
}
