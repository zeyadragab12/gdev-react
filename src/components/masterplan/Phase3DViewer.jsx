import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import { Vector3 } from 'three';
import ModelLoader from './ModelLoader.jsx';

const HOME = { position: [4.4, 2.8, 5.4], target: [0, 0.9, 0] };
const MIN_DIST = 3;
const MAX_DIST = 12;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

// ---- inside the canvas -------------------------------------------------------

// Smooth camera moves for "reset" and the zoom buttons, exposed through `api`.
function CameraRig({ api }) {
  const { camera, controls, invalidate } = useThree();
  const move = useRef(null);

  useEffect(() => {
    const go = (toPos, toTarget) => {
      if (!controls) return;
      if (reducedMotion()) {
        camera.position.copy(toPos);
        controls.target.copy(toTarget);
        controls.update();
        invalidate();
        return;
      }
      move.current = { t: 0, fromPos: camera.position.clone(), fromTarget: controls.target.clone(), toPos, toTarget };
      invalidate();
    };
    api.current = {
      reset: () => go(new Vector3(...HOME.position), new Vector3(...HOME.target)),
      zoom: (factor) => {
        const target = controls.target.clone();
        const offset = camera.position.clone().sub(target);
        offset.setLength(Math.min(MAX_DIST, Math.max(MIN_DIST, offset.length() * factor)));
        go(target.clone().add(offset), target);
      },
    };
    return () => {
      api.current = null;
    };
  }, [api, camera, controls, invalidate]);

  useFrame((_, dt) => {
    const m = move.current;
    if (!m || !controls) return;
    m.t = Math.min(1, m.t + dt / 0.8);
    const e = 1 - Math.pow(1 - m.t, 3);
    camera.position.lerpVectors(m.fromPos, m.toPos, e);
    controls.target.lerpVectors(m.fromTarget, m.toTarget, e);
    controls.update();
    if (m.t < 1) invalidate();
    else move.current = null;
  });
  return null;
}

function Scene({ phase, controlsApi, spinning, onInteract, onReady }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#ffffff', '#3a3a3a', 0.9]} />
      <directionalLight position={[6, 9, 5]} intensity={1.6} />
      <directionalLight position={[-5, 4, -6]} intensity={0.5} />
      <Suspense fallback={null}>
        <ModelLoader url={phase.modelUrl} scale={phase.modelScale ?? 1} position={phase.modelPosition} onReady={onReady} />
      </Suspense>
      {/* quiet ground disc so the model does not float */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.85} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        minDistance={MIN_DIST}
        maxDistance={MAX_DIST}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.04}
        target={HOME.target}
        autoRotate={spinning}
        autoRotateSpeed={1.2}
        onStart={onInteract}
      />
      <CameraRig api={controlsApi} />
    </>
  );
}

// ---- UI chrome ---------------------------------------------------------------

class ViewerBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}

const iconBtn =
  'mp-focus group relative w-11 h-11 rounded-full border border-glass-strong bg-black/70 backdrop-blur-sm text-white/80 hover:text-black hover:bg-champagne hover:border-champagne transition-colors flex items-center justify-center';

function IconButton({ label, onClick, active, btnRef, children }) {
  return (
    <button ref={btnRef} type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`${iconBtn} ${active ? '!bg-champagne !text-black' : ''}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full mr-3 whitespace-nowrap px-2.5 py-1.5 bg-black/85 border border-glass text-[10px] tracking-[0.18em] uppercase text-white/85 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 transition-all duration-200"
      >
        {label}
      </span>
    </button>
  );
}

const svg = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true };
const Icons = {
  rotate: <svg {...svg}><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" /></svg>,
  plus: <svg {...svg}><path d="M12 5v14M5 12h14" /></svg>,
  minus: <svg {...svg}><path d="M5 12h14" /></svg>,
  reset: <svg {...svg}><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5" /></svg>,
  full: <svg {...svg}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>,
  exit: <svg {...svg}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>,
  close: <svg {...svg}><path d="M6 6l12 12M18 6L6 18" /></svg>,
};

function LoadingState({ label }) {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0a0a0a]" role="status" aria-live="polite">
      <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/75">Loading {label}&hellip;</div>
      <div className="w-48 h-px bg-white/15 overflow-hidden">
        <div className="h-full bg-champagne transition-[width] duration-300" style={{ width: `${Math.max(6, progress)}%` }} />
      </div>
    </div>
  );
}

// Reusable 3D viewer for one phase. Mount it only once the visitor asks for it: the
// three.js bundle and the model are fetched on demand, and everything is released
// when it unmounts.
//   phase: { label, title, modelUrl, modelScale?, modelPosition?, modelConcept? }
export default function Phase3DViewer({ phase, onClose }) {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const controlsApi = useRef(null);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled;

  const onReady = useCallback(() => setReady(true), []);
  const onInteract = useCallback(() => {
    setInteracted(true);
    setSpinning(false);
  }, []);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    setLeaving(true);
    window.setTimeout(onClose, reducedMotion() ? 0 : 280);
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const onFs = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  };

  const touch = coarsePointer();

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={`${phase.title} in 3D`}
      onKeyDown={(e) => e.key === 'Escape' && !document.fullscreenElement && close()}
      className={`${leaving ? 'mp-exit' : 'mp-enter'} absolute inset-0 z-20 bg-[#0a0a0a] overflow-hidden`}
    >
      <ViewerBoundary
        fallback={() => (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center" role="alert">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/80">The 3D view could not be loaded</p>
            <p className="text-sm font-light text-white/50">Please try again later. The 2D master plan is still available.</p>
          </div>
        )}
      >
        <Canvas
          frameloop={spinning ? 'always' : 'demand'}
          dpr={[1, touch ? 1.5 : 2]}
          camera={{ position: HOME.position, fov: 38, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          aria-label={`Interactive 3D model of ${phase.title}`}
        >
          <Scene phase={phase} controlsApi={controlsApi} spinning={spinning} onInteract={onInteract} onReady={onReady} />
        </Canvas>
        {!ready && <LoadingState label={phase.label} />}
      </ViewerBoundary>

      <div className="absolute left-4 top-4 md:left-6 md:top-5 text-[11px] font-semibold tracking-[0.24em] uppercase text-white/80 pointer-events-none">
        <span className="text-champagne">{phase.label}</span> &middot; 3D view
        {phase.modelConcept && (
          <span className="block mt-1.5 text-[9px] tracking-[0.22em] text-white/55">Illustrative 3D Concept</span>
        )}
      </div>

      <div className="absolute right-3 top-3 md:right-5 md:top-5 flex flex-col gap-2 items-end">
        <IconButton label="Close 3D view" onClick={close} btnRef={closeRef}>{Icons.close}</IconButton>
        <IconButton label="Auto rotate" active={spinning} onClick={() => setSpinning((s) => !s)}>{Icons.rotate}</IconButton>
        <IconButton label="Zoom in" onClick={() => controlsApi.current?.zoom(0.75)}>{Icons.plus}</IconButton>
        <IconButton label="Zoom out" onClick={() => controlsApi.current?.zoom(1.33)}>{Icons.minus}</IconButton>
        <IconButton label="Reset camera" onClick={() => controlsApi.current?.reset()}>{Icons.reset}</IconButton>
        {canFullscreen && (
          <IconButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>
            {fullscreen ? Icons.exit : Icons.full}
          </IconButton>
        )}
      </div>

      {ready && !interacted && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <p className="px-5 py-2.5 border border-glass-strong bg-black/70 backdrop-blur-sm text-[10px] tracking-[0.24em] uppercase text-white/80 text-center">
            Drag to rotate &middot; {touch ? 'Pinch' : 'Scroll'} to zoom
          </p>
        </div>
      )}
    </div>
  );
}
