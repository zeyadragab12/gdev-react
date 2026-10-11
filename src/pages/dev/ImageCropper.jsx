import { useEffect, useRef, useState } from 'react';

// DEV ONLY. Modal cropper used by the master plan editor.
//   file     the File chosen by the user
//   aspect   width / height to lock the crop to, or null for a free crop
//   maxWidth longest output width in px (larger crops are scaled down)
//   type     'image/jpeg' | 'image/webp' (webp keeps transparency)
//   onSave(blob, { width, height })   onCancel()
const MIN = 30;

export default function ImageCropper({ file, aspect, maxWidth, type, title, onSave, onCancel }) {
  const [img, setImg] = useState(null);
  const [view, setView] = useState({ w: 0, h: 0 }); // displayed image size
  const [crop, setCrop] = useState(null); // in displayed px
  const wrap = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    let stale = false;
    im.onload = () => {
      if (stale) return;
      const k = Math.min((window.innerWidth * 0.8) / im.naturalWidth, (window.innerHeight * 0.66) / im.naturalHeight, 1);
      const w = im.naturalWidth * k;
      const h = im.naturalHeight * k;
      setView({ w, h });
      let cw = w * 0.9;
      let ch = h * 0.9;
      if (aspect) {
        cw = Math.min(w, h * aspect) * 0.95;
        ch = cw / aspect;
      }
      setCrop({ x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch });
      setImg(im);
    };
    im.src = url;
    return () => {
      stale = true;
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  }, [file, aspect]);

  const local = (e) => {
    const r = wrap.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const begin = (e, kind, corner) => {
    e.preventDefault();
    e.stopPropagation();
    const [px, py] = local(e);
    drag.current = { kind, corner, px, py, crop };
    const move = (ev) => {
      const d = drag.current;
      if (!d) return;
      const [x, y] = local(ev);
      if (d.kind === 'move') {
        const nx = Math.min(view.w - d.crop.w, Math.max(0, d.crop.x + x - d.px));
        const ny = Math.min(view.h - d.crop.h, Math.max(0, d.crop.y + y - d.py));
        setCrop({ ...d.crop, x: nx, y: ny });
        return;
      }
      // resize from a corner; the opposite corner stays put
      const left = d.corner.includes('w');
      const top = d.corner.includes('n');
      const ax = left ? d.crop.x + d.crop.w : d.crop.x;
      const ay = top ? d.crop.y + d.crop.h : d.crop.y;
      const maxW = left ? ax : view.w - ax;
      const maxH = top ? ay : view.h - ay;
      let w = Math.abs(x - ax);
      let h = Math.abs(y - ay);
      if (aspect) {
        w = Math.max(MIN, Math.min(Math.max(w, h * aspect), maxW, maxH * aspect));
        h = w / aspect;
      } else {
        w = Math.max(MIN, Math.min(w, maxW));
        h = Math.max(MIN, Math.min(h, maxH));
      }
      setCrop({ x: left ? ax - w : ax, y: top ? ay - h : ay, w, h });
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const save = () => {
    const k = img.naturalWidth / view.w;
    const sw = crop.w * k;
    const sh = crop.h * k;
    const scale = Math.min(1, maxWidth / sw);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, crop.x * k, crop.y * k, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => onSave(blob, { width: canvas.width, height: canvas.height }), type, 0.88);
  };

  const wholeImage = () => setCrop({ x: 0, y: 0, w: view.w, h: view.h });

  const corners = [['nw', 'left-0 top-0 cursor-nwse-resize'], ['ne', 'right-0 top-0 cursor-nesw-resize'], ['sw', 'left-0 bottom-0 cursor-nesw-resize'], ['se', 'right-0 bottom-0 cursor-nwse-resize']];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-4 p-4" role="dialog" aria-label={title}>
      <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-white/70">
        {title} <span className="text-white/40">· {aspect ? `locked ${Math.round(aspect * 10) / 10}:1` : 'free'} crop</span>
      </div>
      {img && crop && (
        <div ref={wrap} className="relative select-none touch-none" style={{ width: view.w, height: view.h }}>
          <img src={img.src} alt="" draggable={false} className="absolute inset-0 w-full h-full" />
          {/* dim everything outside the crop */}
          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'none' }}>
            <div className="absolute bg-black/60" style={{ left: 0, top: 0, width: view.w, height: crop.y }} />
            <div className="absolute bg-black/60" style={{ left: 0, top: crop.y + crop.h, width: view.w, height: view.h - crop.y - crop.h }} />
            <div className="absolute bg-black/60" style={{ left: 0, top: crop.y, width: crop.x, height: crop.h }} />
            <div className="absolute bg-black/60" style={{ left: crop.x + crop.w, top: crop.y, width: view.w - crop.x - crop.w, height: crop.h }} />
          </div>
          <div
            className="absolute border border-white cursor-move"
            style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
            onPointerDown={(e) => begin(e, 'move')}
          >
            {corners.map(([c, pos]) => (
              <span key={c} onPointerDown={(e) => begin(e, 'resize', c)} className={`absolute w-4 h-4 -m-2 bg-white border border-black ${pos}`} />
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {!aspect && (
          <button type="button" onClick={wholeImage} className="px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase border border-white/25 hover:bg-white hover:text-black">
            Whole image
          </button>
        )}
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase border border-white/25 hover:bg-white hover:text-black">
          Cancel
        </button>
        <button type="button" onClick={save} disabled={!crop} className="px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase bg-white text-black hover:bg-champagne">
          Crop &amp; save
        </button>
      </div>
    </div>
  );
}
