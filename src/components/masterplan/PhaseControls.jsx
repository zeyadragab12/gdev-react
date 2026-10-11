const btn =
  'mp-focus w-10 h-10 flex items-center justify-center border border-glass-strong bg-black/70 backdrop-blur-sm text-white/80 hover:text-black hover:bg-champagne transition-colors';

// Minimal zoom controls. Pan with drag; pinch on touch, Ctrl/Cmd + scroll with a mouse.
export default function PhaseControls({ onZoomIn, onZoomOut }) {
  return (
    <div className="flex flex-col" role="group" aria-label="Zoom">
      <button type="button" onClick={onZoomIn} aria-label="Zoom in" className={btn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 1v12M1 7h12" /></svg>
      </button>
      <button type="button" onClick={onZoomOut} aria-label="Zoom out" className={`${btn} border-t-0`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 7h12" /></svg>
      </button>
    </div>
  );
}
