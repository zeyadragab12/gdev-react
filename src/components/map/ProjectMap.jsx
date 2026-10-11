import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DESTINATIONS, PROJECTS } from '../../data/projects.js';
import { PROJECT_GEO } from '../../data/projectGeo.js';
import { clippedPlanUrl, footprint, hasBoundary, mapPlan, unionBounds } from './geo.js';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/satellite-streets-v12';

const EGYPT_BOUNDS = [[24.7, 21.9], [36.9, 31.8]];
const CHAMPAGNE = '#f5f4f0';
const FONT = ['DIN Pro Medium', 'Arial Unicode MS Regular'];
const FLY_MS = 2400;

// Visual variants (try them at /dev/home-map-styles). Shape: { base, tone, planTone, area, pins, labels, accent }.
// HOME_LOOK is what the home page uses; pass a different `look` to ProjectMap to override it.
export const HOME_LOOK = { base: 'mapbox://styles/mapbox/dark-v11', tone: 'natural', planTone: 'muted', area: 'glow', pins: 'ring', labels: 'caps', accent: '#F5F4F0' };
const TONES = { natural: [0, 1, 0], muted: [-0.55, 0.9, 0], mono: [-1, 0.85, 0.1], dark: [-0.7, 0.5, 0.15] };
const PLAN_TONES = { original: [0, 1], muted: [-0.5, 0.88], mono: [-1, 0.8] };
const PIN_STYLES = {
  dot: { r: 6, rs: 5, stroke: 1.5, pulse: 14, pulseOp: 0.25, fill: null },
  ring: { r: 7, rs: 6, stroke: 2.2, pulse: 18, pulseOp: 0.12, fill: 'rgba(0,0,0,0.45)' },
  bold: { r: 9, rs: 7, stroke: 2.5, pulse: 24, pulseOp: 0.3, fill: null },
};
const AREA_STYLES = {
  fill: { fill: 0.18, line: 1.6, halo: 0.18, haloW: 7, blur: 3 },
  line: { fill: 0, line: 2.2, halo: 0.25, haloW: 7, blur: 3 },
  glow: { fill: 0.1, line: 2, halo: 0.55, haloW: 16, blur: 7 },
  solid: { fill: 0.36, line: 2.4, halo: 0.1, haloW: 7, blur: 3 },
};
const LABEL_STYLES = {
  caps: { size: [12, 11], transform: 'uppercase', spacing: 0.14 },
  title: { size: [14, 13], transform: 'none', spacing: 0.04 },
  large: { size: [15, 14], transform: 'uppercase', spacing: 0.18 },
};
const setPaint = (map, id, props) => map.getLayer(id) && Object.entries(props).forEach(([k, v]) => map.setPaintProperty(id, k, v));
const setLayout = (map, id, props) => map.getLayer(id) && Object.entries(props).forEach(([k, v]) => map.setLayoutProperty(id, k, v));

function applyLook(map, look) {
  if (!look) return;
  const accent = look.accent ?? CHAMPAGNE;
  const pin = PIN_STYLES[look.pins] ?? PIN_STYLES.dot;
  const area = AREA_STYLES[look.area] ?? AREA_STYLES.fill;
  const text = LABEL_STYLES[look.labels] ?? LABEL_STYLES.caps;
  const [sat, bmax, con] = TONES[look.tone] ?? TONES.natural;
  const [planSat, planBright] = PLAN_TONES[look.planTone] ?? PLAN_TONES.original;

  setPaint(map, 'satellite', { 'raster-saturation': sat, 'raster-brightness-max': bmax, 'raster-contrast': con });
  const dot = (r) => ({ 'circle-color': pin.fill ?? accent, 'circle-radius': r, 'circle-stroke-width': pin.stroke, 'circle-stroke-color': pin.fill ? accent : '#000' });
  setPaint(map, 'dest-pulse', { 'circle-color': accent, 'circle-opacity': pin.pulseOp, 'circle-radius': pin.pulse });
  setPaint(map, 'dest-dot', dot(pin.r));
  setPaint(map, 'site-pin', dot(pin.rs));
  setPaint(map, 'site-halo', { 'line-color': accent, 'line-opacity': area.halo, 'line-width': area.haloW, 'line-blur': area.blur });
  setPaint(map, 'site-line', { 'line-color': accent, 'line-width': area.line });
  setPaint(map, 'site-fill', { 'fill-color': accent });
  setPaint(map, 'dest-label', { 'text-color': accent });
  setPaint(map, 'site-label', { 'text-color': accent });
  setLayout(map, 'dest-label', { 'text-size': text.size[0], 'text-transform': text.transform, 'text-letter-spacing': text.spacing });
  setLayout(map, 'site-label', { 'text-size': text.size[1], 'text-transform': text.transform, 'text-letter-spacing': text.spacing });
  map.getStyle().layers.filter((l) => l.id.startsWith('plan-')).forEach((l) => setPaint(map, l.id, { 'raster-saturation': planSat, 'raster-brightness-max': planBright }));
}
const fillOpacity = (look) => (AREA_STYLES[look?.area] ?? AREA_STYLES.fill).fill;

// every project that has a location, with its ground footprint
const SITES = PROJECTS.filter((p) => PROJECT_GEO[p.key]).map((p) => {
  const plan = mapPlan(p, PROJECT_GEO[p.key]);
  return { project: p, geo: PROJECT_GEO[p.key], plan, ...footprint(PROJECT_GEO[p.key], plan) };
});
const siteByKey = Object.fromEntries(SITES.map((s) => [s.project.key, s]));

const points = (features) => ({ type: 'FeatureCollection', features });
const DEST_DATA = points(
  DESTINATIONS.map((d) => ({ type: 'Feature', properties: { id: d.id, name: d.name }, geometry: { type: 'Point', coordinates: d.coords } })),
);
const SITE_DATA = points(
  SITES.map((s) => ({
    type: 'Feature',
    properties: { key: s.project.key, name: s.project.name, note: s.geo.verified ? '' : '\nIndicative location' },
    geometry: { type: 'Polygon', coordinates: [s.ring] },
  })),
);
const PIN_DATA = points(
  SITES.map((s) => ({
    type: 'Feature',
    properties: { key: s.project.key, name: s.project.name, note: s.geo.verified ? '' : '\nIndicative location' },
    geometry: { type: 'Point', coordinates: s.geo.center },
  })),
);

// Map of every destination and project. Camera state comes from the page: `zoomed` is a destination
// id (or null for all of Egypt) and `focus` a project key (or null). Clicks are reported back up.
export default function ProjectMap({ zoomed, focus, look = HOME_LOOK, onSelectDestination, onSelectProject }) {
  const box = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const loadedPlans = useRef(new Set());
  const callbacks = useRef({});
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const zoomedRef = useRef(zoomed);
  zoomedRef.current = zoomed;
  callbacks.current = { onSelectDestination, onSelectProject };
  const lookRef = useRef(look);
  lookRef.current = look;

  useEffect(() => {
    if (!box.current) return; // no token: the container is not rendered, so there is nothing to mount on
    const map = new mapboxgl.Map({
      container: box.current,
      style: look?.base || STYLE,
      bounds: EGYPT_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      cooperativeGestures: true, // the page keeps scrolling; Ctrl + scroll (two fingers on touch) zooms the map
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: true,
    });
    mapRef.current = map;
    if (import.meta.env.DEV) window.__gdMap = map; // dev only: lets tests and the console reach the map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.touchZoomRotate.disableRotation();

    map.on('load', () => {
      map.addSource('destinations', { type: 'geojson', data: DEST_DATA });
      map.addSource('sites', { type: 'geojson', data: SITE_DATA });
      map.addSource('pins', { type: 'geojson', data: PIN_DATA });

      const label = (field, size) => ({
        'text-field': field,
        'text-font': FONT,
        'text-size': size,
        'text-letter-spacing': 0.14,
        'text-transform': 'uppercase',
        'text-offset': [0, -1.2],
        'text-anchor': 'bottom',
        'text-allow-overlap': true,
      });
      const halo = { 'text-color': CHAMPAGNE, 'text-halo-color': 'rgba(0,0,0,0.85)', 'text-halo-width': 1.6 };
      const dot = { 'circle-color': CHAMPAGNE, 'circle-radius': 6, 'circle-stroke-color': '#000', 'circle-stroke-width': 1.5 };

      // destinations: visible from the country view until you are zoomed into one
      map.addLayer({ id: 'dest-pulse', type: 'circle', source: 'destinations', maxzoom: 8, paint: { 'circle-color': CHAMPAGNE, 'circle-opacity': 0.25, 'circle-radius': 14 } });
      map.addLayer({ id: 'dest-dot', type: 'circle', source: 'destinations', maxzoom: 8, paint: dot });
      map.addLayer({ id: 'dest-label', type: 'symbol', source: 'destinations', maxzoom: 8, layout: label(['get', 'name'], 12), paint: halo });

      // project sites: highlighted master-plan area + pin
      map.addLayer({ id: 'site-halo', type: 'line', source: 'sites', minzoom: 7, paint: { 'line-color': CHAMPAGNE, 'line-opacity': 0.18, 'line-width': 7, 'line-blur': 3 } });
      map.addLayer({ id: 'site-fill', type: 'fill', source: 'sites', minzoom: 7, paint: { 'fill-color': CHAMPAGNE, 'fill-opacity': 0.18 } });
      map.addLayer({ id: 'site-line', type: 'line', source: 'sites', minzoom: 7, paint: { 'line-color': CHAMPAGNE, 'line-width': 1.6 } });
      map.addLayer({ id: 'site-pin', type: 'circle', source: 'pins', minzoom: 7, paint: { ...dot, 'circle-radius': 5 } });
      map.addLayer({ id: 'site-label', type: 'symbol', source: 'pins', minzoom: 7, layout: {
          ...label(['concat', ['get', 'name'], ['get', 'note']], 11),
          // neighbouring projects must not draw their names on top of each other: try each side of the pin
          'text-allow-overlap': false,
          'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
          'text-radial-offset': 0.9,
          'symbol-sort-key': ['get', 'key'],
        },
        paint: halo,
      });

      const hit = (layer, handler) => {
        map.on('click', layer, (e) => handler(e.features[0].properties));
        map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
      };
      hit('dest-dot', (p) => callbacks.current.onSelectDestination(p.id));
      hit('dest-label', (p) => callbacks.current.onSelectDestination(p.id));
      ['site-fill', 'site-pin', 'site-label'].forEach((l) => hit(l, (p) => callbacks.current.onSelectProject(p.key)));

      applyLook(map, lookRef.current);
      setReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      loadedPlans.current.clear();
    };
  }, []);

  // camera
  const target = useMemo(() => {
    if (focus) return { bounds: siteByKey[focus].bounds, options: { padding: { top: 130, bottom: 40, left: 40, right: 40 }, maxZoom: 18 } };
    if (zoomed) {
      const list = SITES.filter((s) => s.project.destination === zoomed).map((s) => s.bounds);
      if (list.length) return { bounds: unionBounds(list), options: { padding: 30, maxZoom: 16 } };
      const d = DESTINATIONS.find((x) => x.id === zoomed);
      return { bounds: [[d.coords[0] - 0.08, d.coords[1] - 0.06], [d.coords[0] + 0.08, d.coords[1] + 0.06]], options: { padding: 40 } };
    }
    return { bounds: EGYPT_BOUNDS, options: { padding: 20 } };
  }, [zoomed, focus]);

  useEffect(() => {
    if (!ready) return;
    mapRef.current.fitBounds(target.bounds, { ...target.options, duration: FLY_MS, essential: true });
  }, [ready, target]);

  // master plan images: loaded the first time their destination is opened, shown for every project of
  // the open destination (and for the focused project)
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    const planShown = (s) => s.project.destination === zoomedRef.current || s.project.key === focusRef.current;
    SITES.filter((s) => s.plan && (s.project.destination === zoomed || s.project.key === focus)).forEach((s) => {
      const id = `plan-${s.project.key}`;
      if (loadedPlans.current.has(id)) return;
      loadedPlans.current.add(id);
      const addPlan = (url) => {
        if (mapRef.current !== map) return; // the map was torn down while the image was being prepared
        map.addSource(id, { type: 'image', url, coordinates: s.corners });
        map.addLayer(
          {
            id,
            type: 'raster',
            source: id,
            paint: { 'raster-opacity': planShown(s) ? 1 : 0,'raster-opacity-transition': { duration: 1000 }, 'raster-fade-duration': 0, 'raster-resampling': 'linear' },
          },
          'site-halo', // under the highlight and the labels
        );
        applyLook(map, lookRef.current);
      };
      // with a drawn boundary, only the land inside it is shown
      if (hasBoundary(s.geo)) clippedPlanUrl(s.geo, s.plan).then(addPlan, () => addPlan(s.plan.image));
      else addPlan(s.plan.image);
    });
    const shown = SITES.filter((s) => s.plan && planShown(s));
    shown.forEach((s) => map.getLayer(`plan-${s.project.key}`) && map.setPaintProperty(`plan-${s.project.key}`, 'raster-opacity', 1));
    SITES.filter((s) => s.plan && !planShown(s)).forEach((s) => map.getLayer(`plan-${s.project.key}`) && map.setPaintProperty(`plan-${s.project.key}`, 'raster-opacity', 0));
    map.setPaintProperty('site-fill', 'fill-opacity', ['case', ['in', ['get', 'key'], ['literal', shown.map((s) => s.project.key)]], 0, fillOpacity(lookRef.current)]);
  }, [ready, zoomed, focus]);

  // live look changes (style picker only)
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    applyLook(map, look);
    const shown = SITES.filter((x) => x.plan && (x.project.destination === zoomedRef.current || x.project.key === focusRef.current)).map((x) => x.project.key);
    map.setPaintProperty('site-fill', 'fill-opacity', ['case', ['in', ['get', 'key'], ['literal', shown]], 0, fillOpacity(look)]);
  }, [ready, look]);

  if (!mapboxgl.accessToken) {
    return <div className="grid h-full place-items-center text-sm text-muted">Set VITE_MAPBOX_TOKEN in .env to show the map.</div>;
  }
  return <div ref={box} className="h-full w-full" />;
}
