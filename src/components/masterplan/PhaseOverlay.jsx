import { memo, useRef } from 'react';

// Interactive SVG layer above the plan image, in image pixels. Everything outside the
// selected phase is dimmed by one even-odd path with the phase cut out of it.
function PhaseOverlay({ phases, selectedId, hoveredId, image, width, height, onSelect, onHover }) {
  const selected = phases.find((p) => p.id === selectedId);
  // keep the last cut-out so the dim can fade out after the selection is cleared
  const last = useRef(null);
  if (selected) last.current = selected;

  return (
    <g>
      {last.current && (
        <>
          {/* the selected phase in the plan's original colours (only shown when a style tones the plan) */}
          <clipPath id="mp-pop-clip">
            <path d={last.current.d} />
          </clipPath>
          <image className={`mp-plan-pop ${selected ? 'is-on' : ''}`} href={image} x="0" y="0" width={width} height={height} clipPath="url(#mp-pop-clip)" />
        </>
      )}
      {last.current && (
        <path
          className={`mp-dim ${selected ? 'is-on' : ''}`}
          d={`M0 0H${width}V${height}H0Z${last.current.d}`}
          fillRule="evenodd"
        />
      )}
      {phases.map((p, i) => (
        <polygon
          key={p.id}
          style={{ '--i': i }}
          points={p.points}
          className={`phase-shape ${p.id === selectedId ? 'is-selected' : ''} ${p.id === hoveredId && p.id !== selectedId ? 'is-hovered' : ''}`}
          onClick={() => onSelect(p.id)}
          onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(p.id)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && onHover(null)}
        />
      ))}
    </g>
  );
}

export default memo(PhaseOverlay);
