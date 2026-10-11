const pad = (n) => String(n).padStart(2, '0');
const rect = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const toPoint = (p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : p);

// Derives what the map needs from the editable phase data (see playaMasterPlan.js):
// bounding box, SVG shapes, camera centre and pin position. A phase may give a
// `region` [x, y, w, h] instead of a `polygon`.
export default function normalizePhases(plan) {
  // phases still being set up in the editor (no drawn area yet) stay off the public plan
  return plan.phases.filter((p) => p.region || (p.polygon?.length ?? 0) >= 3).map((p, i) => {
    const polygon = p.polygon ?? rect(p.region);
    const xs = polygon.map((pt) => pt[0]);
    const ys = polygon.map((pt) => pt[1]);
    const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
    const bbox = [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0];
    const center = p.center ? toPoint(p.center) : { x: bbox[0] + bbox[2] / 2, y: bbox[1] + bbox[3] / 2 };
    return {
      ...p,
      number: p.number || pad(i + 1),
      bbox,
      center,
      pin: p.pin ? toPoint(p.pin) : center,
      points: polygon.map((pt) => pt.join(',')).join(' '),
      d: `M${polygon.map((pt) => pt.join(' ')).join('L')}Z`,
    };
  });
}
