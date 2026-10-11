// View maths for the master plan. A view is [x, y, w, h] in image pixels and always has
// the frame's aspect ratio. `inset` is the fraction of the frame's height covered at the
// bottom (the mobile sheet): the phase is centred in the part that stays visible.

// Keep the view inside the image. A dimension larger than the image is centred instead.
export function clampView([x, y, w, h], [boundW, boundH], inset = 0) {
  const visibleH = h * (1 - inset);
  const cx = w >= boundW ? (boundW - w) / 2 : Math.min(Math.max(x, 0), boundW - w);
  const cy = visibleH >= boundH ? (boundH - visibleH) / 2 : Math.min(Math.max(y, 0), boundH - visibleH);
  return [cx, cy, w, h];
}

// Fit a region [x, y, w, h] (plus padding) into the frame.
export default function fitView([x, y, w, h], pad, aspect, bounds, inset = 0) {
  const visibleAspect = aspect / (1 - inset);
  const pw = w * (1 + 2 * pad);
  const ph = h * (1 + 2 * pad);
  const vw = pw / ph < visibleAspect ? ph * visibleAspect : pw;
  const vh = vw / visibleAspect;
  return clampView([x + w / 2 - vw / 2, y + h / 2 - vh / 2, vw, vh / (1 - inset)], bounds, inset);
}

// Zoom to `zoom` times the width of `home`, centred on {x, y}.
export function zoomView(home, { x, y }, zoom, aspect, bounds, inset = 0) {
  const w = home[2] / zoom;
  const h = w / aspect;
  return clampView([x - w / 2, y - (h * (1 - inset)) / 2, w, h], bounds, inset);
}
