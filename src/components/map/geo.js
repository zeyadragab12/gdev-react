// Ground geometry for a project's master plan, from its entry in data/projectGeo.js.

const M_PER_DEG = 111320;

// The plan image the map draws for a project: its interactive master plan (project.plan) if it has
// one, else the map-only image from its geo entry (`mapImage: { src, width, height }`), else null.
export const mapPlan = (project, geo) =>
  project.plan ?? (geo?.mapImage ? { image: geo.mapImage.src, width: geo.mapImage.width, height: geo.mapImage.height } : null);

// [lon, lat] moved `east` / `north` metres
export const offset = ([lon, lat], east, north) => [
  lon + east / (M_PER_DEG * Math.cos((lat * Math.PI) / 180)),
  lat + north / M_PER_DEG,
];
// metres [east, north] from `origin` to `point` (inverse of offset)
export const metresBetween = ([lon0, lat0], [lon, lat]) => [
  (lon - lon0) * M_PER_DEG * Math.cos((lat0 * Math.PI) / 180),
  (lat - lat0) * M_PER_DEG,
];

// Corners of the plan image as Mapbox wants them: top-left, top-right, bottom-right, bottom-left
// ([lon, lat] each). Built from the centre, real width, rotation (clockwise from north-up) and the
// image's aspect ratio; `geo.corners` overrides all of it with surveyed values.
export function footprint(geo, plan) {
  let corners = geo.corners;
  if (!corners) {
    const w = geo.widthKm * 1000;
    const h = plan ? (w * plan.height) / plan.width : (geo.heightKm ?? geo.widthKm) * 1000;
    const a = ((geo.rotation ?? 0) * Math.PI) / 180;
    const at = (u, v) => offset(geo.center, u * Math.cos(a) + v * Math.sin(a), -u * Math.sin(a) + v * Math.cos(a));
    corners = [at(-w / 2, h / 2), at(w / 2, h / 2), at(w / 2, -h / 2), at(-w / 2, -h / 2)];
  }
  const ring = geo.outline?.length >= 3 ? geo.outline : corners; // a boundary needs 3+ points
  const lons = ring.map((c) => c[0]);
  const lats = ring.map((c) => c[1]);
  return {
    corners,
    ring: [...ring, ring[0]],
    bounds: [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
  };
}

export const unionBounds = (list) => [
  [Math.min(...list.map((b) => b[0][0])), Math.min(...list.map((b) => b[0][1]))],
  [Math.max(...list.map((b) => b[1][0])), Math.max(...list.map((b) => b[1][1]))],
];

export const hasBoundary = (geo) => geo.outline?.length >= 3;

// The boundary as pixel positions on the plan image (the inverse of how footprint() places the image).
function outlineInImagePixels(geo, plan) {
  const w = geo.widthKm * 1000;
  const h = (w * plan.height) / plan.width;
  const a = ((geo.rotation ?? 0) * Math.PI) / 180;
  return geo.outline.map((pt) => {
    const [east, north] = metresBetween(geo.center, pt);
    const u = east * Math.cos(a) - north * Math.sin(a);
    const v = east * Math.sin(a) + north * Math.cos(a);
    return [((u + w / 2) / w) * plan.width, ((h / 2 - v) / h) * plan.height];
  });
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// A copy of the plan image with everything outside the project's boundary made transparent, so only
// the project's own land shows on the map. Returns an object URL for a Mapbox image source (same
// corners as the original). Needs geo.outline (3+ points) and an unrotated-image plan with width/height.
export async function clippedPlanUrl(geo, plan, maxSide = 4096) {
  const img = await loadImage(plan.image);
  const k = Math.min(1, maxSide / Math.max(plan.width, plan.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(plan.width * k);
  canvas.height = Math.round(plan.height * k);
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  outlineInImagePixels(geo, plan).forEach(([x, y], i) => (i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k)));
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  return URL.createObjectURL(blob);
}
