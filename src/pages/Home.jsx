import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import ContactCta from '../components/ContactCta.jsx';
import useReveal from '../hooks/useReveal.js';
import { DESTINATIONS, PROJECTS, projectPath } from '../data/projects.js';
import { FOUNDED_YEAR, YEARS_ACTIVE } from '../data/company.js';

// Pins the section while vertical scroll drives the card track sideways.
function useScrollTrack() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [height, setHeight] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    let distance = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const travelled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), distance);
      track.style.transform = `translate3d(${-travelled}px,0,0)`;
      setProgress(distance ? travelled / distance : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      distance = Math.max(track.scrollWidth - window.innerWidth, 0);
      setHeight(distance + window.innerHeight);
      update();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { sectionRef, trackRef, height, progress };
}

// ---- Egypt map (simplified outline, real lon/lat projected to SVG space) ----
const MAP_SCALE = 58;
const LAT_CORRECTION = Math.cos((27 * Math.PI) / 180);
const project = ([lon, lat]) => [
  +((lon - 24.3) * LAT_CORRECTION * MAP_SCALE).toFixed(1),
  +((32.1 - lat) * MAP_SCALE).toFixed(1),
];
const toPath = (points, close) => 'M' + points.map((pt) => project(pt).join(' ')).join(' L') + (close ? ' Z' : '');

const EGYPT_OUTLINE = toPath([
  [25.15, 31.57], [27.24, 31.35], [27.9, 31.12], [28.95, 30.83], [29.9, 31.2], [30.4, 31.45], [31.0, 31.6],
  [31.8, 31.52], [32.3, 31.27], [33.2, 31.08], [33.8, 31.13], [34.22, 31.32], [34.9, 29.49], [34.66, 28.97],
  [34.52, 28.5], [34.33, 27.9], [34.25, 27.73], [33.6, 28.24], [33.1, 29.05], [32.55, 29.97], [32.35, 29.6],
  [32.65, 29.1], [33.1, 28.35], [33.8, 27.25], [33.95, 26.75], [34.28, 26.1], [34.9, 25.07], [35.48, 23.95],
  [35.8, 23.9], [35.6, 23.2], [36.6, 22.2], [36.9, 22.0], [25.0, 22.0], [25.0, 29.5], [24.7, 30.2], [24.9, 31.0],
], true);
const NILE = toPath([
  [31.4, 22.0], [31.9, 22.6], [32.5, 23.3], [32.9, 24.09], [32.9, 24.9], [32.64, 25.69], [32.72, 26.16],
  [32.2, 26.3], [31.18, 27.18], [30.75, 28.1], [31.1, 29.1], [31.24, 30.04], [31.1, 30.4],
]);
const NILE_ROSETTA = toPath([[31.1, 30.4], [30.8, 30.9], [30.4, 31.45]]);
const NILE_DAMIETTA = toPath([[31.1, 30.4], [31.4, 31.0], [31.8, 31.52]]);

const LABEL_POSITION = {
  top: { dx: 0, dy: -18, anchor: 'middle' },
  bottom: { dx: 0, dy: 26, anchor: 'middle' },
  left: { dx: -16, dy: 4, anchor: 'end' },
  right: { dx: 16, dy: 4, anchor: 'start' },
};

const unproject = (x, y) => [x / (LAT_CORRECTION * MAP_SCALE) + 24.3, 32.1 - y / MAP_SCALE];

// Sniper-scope cursor: a reticle with full-width crosshairs that follows the
// mouse and locks onto a destination pin while it is hovered.
function MapScope({ children, locked }) {
  const areaRef = useRef(null);
  const reticleRef = useRef(null);
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  const readoutRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const place = (x, y, svgX, svgY) => {
    reticleRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    hLineRef.current.style.transform = `translate3d(0,${y}px,0)`;
    vLineRef.current.style.transform = `translate3d(${x}px,0,0)`;
    const [lon, lat] = unproject(svgX, svgY);
    readoutRef.current.textContent = `${lat.toFixed(2)}°N  ${lon.toFixed(2)}°E`;
  };

  // area-relative px <-> svg viewBox units
  const svgMetrics = () => {
    const area = areaRef.current.getBoundingClientRect();
    const svg = areaRef.current.querySelector('svg').getBoundingClientRect();
    return { area, svg, k: svg.width / 660 };
  };

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!visible) setVisible(true);
    if (locked) return;
    const { area, svg, k } = svgMetrics();
    place(e.clientX - area.left, e.clientY - area.top, (e.clientX - svg.left) / k, (e.clientY - svg.top) / k);
  };

  useEffect(() => {
    if (!locked || !visible) return;
    const dest = DESTINATIONS.find((d) => d.id === locked);
    const [sx, sy] = project(dest.coords);
    const { area, svg, k } = svgMetrics();
    place(svg.left - area.left + sx * k, svg.top - area.top + sy * k, sx, sy);
  }, [locked, visible]);

  return (
    <div
      ref={areaRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setVisible(false)}
      className="scope-area relative overflow-hidden rounded-[2px] border border-glass bg-[#050505] p-4 md:p-8"
    >
      {children}

      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
        <div ref={hLineRef} className={`absolute left-0 right-0 top-0 h-px bg-champagne/15 ${locked ? 'transition-transform duration-200 ease-out' : ''}`} />
        <div ref={vLineRef} className={`absolute top-0 bottom-0 left-0 w-px bg-champagne/15 ${locked ? 'transition-transform duration-200 ease-out' : ''}`} />

        <div ref={reticleRef} className={`absolute left-0 top-0 ${locked ? 'transition-transform duration-200 ease-out' : ''}`}>
          <svg
            width="84"
            height="84"
            viewBox="-42 -42 84 84"
            className={`absolute -left-[42px] -top-[42px] transition-transform duration-300 ${locked ? 'scale-75 text-champagne' : 'scale-100 text-champagne/80'}`}
            fill="none"
            stroke="currentColor"
          >
            <circle r="30" strokeWidth="1" className={locked ? '' : 'opacity-70'} />
            <circle r="37" strokeWidth="1" strokeDasharray="2 6" style={{ transformBox: 'fill-box' }} className={`origin-center ${locked ? 'animate-[spin_4s_linear_infinite]' : 'hidden'}`} />
            <path d="M-42 0H-12M12 0H42M0 -42V-12M0 12V42" strokeWidth="1" />
            <path d="M-30 -5V5M30 -5V5M-5 -30H5M-5 30H5" strokeWidth="1" className="opacity-60" />
            <circle r="1.6" fill="currentColor" stroke="none" />
            {locked && <path d="M-22 -14V-22H-14M14 -22H22V-14M22 14V22H14M-14 22H-22V14" strokeWidth="1.5" />}
          </svg>
          <div
            ref={readoutRef}
            className="absolute left-[30px] top-[30px] whitespace-pre text-[10px] tracking-[0.18em] text-champagne/70 font-medium tabular-nums"
          />
          {locked && (
            <div className="absolute left-[30px] top-[46px] whitespace-nowrap text-[10px] font-semibold tracking-[0.28em] uppercase text-champagne">
              Target locked
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EgyptMap({ active, onSelect, onHover }) {
  return (
    <svg viewBox="0 0 660 600" className="w-full h-auto" role="img" aria-label="Map of Egypt showing G Developments destinations">
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
        <pattern id="grid" width="29" height="29" patternUnits="userSpaceOnUse">
          <path d="M29 0H0V29" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="660" height="600" fill="url(#grid)" />

      <text x="150" y="26" className="fill-white/25 text-[11px] uppercase" style={{ letterSpacing: '0.4em' }}>Mediterranean Sea</text>
      <text x="545" y="330" className="fill-white/25 text-[11px] uppercase" style={{ letterSpacing: '0.4em' }} transform="rotate(58 545 330)">Red Sea</text>

      <path d={EGYPT_OUTLINE} fill="url(#land)" stroke="rgba(245,244,240,0.35)" strokeWidth="1" strokeLinejoin="round" />
      <g fill="none" stroke="rgba(245,244,240,0.22)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={NILE} />
        <path d={NILE_ROSETTA} />
        <path d={NILE_DAMIETTA} />
      </g>

      {DESTINATIONS.map((d) => {
        const [x, y] = project(d.coords);
        const l = LABEL_POSITION[d.label];
        const isActive = active === d.id;
        const select = () => onSelect(d.id);
        return (
          <g
            key={d.id}
            role="button"
            tabIndex={0}
            aria-label={`Show projects in ${d.name}`}
            aria-pressed={isActive}
            onClick={select}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                select();
              }
            }}
            onPointerEnter={() => onHover(d.id)}
            onPointerLeave={() => onHover(null)}
            className="cursor-pointer outline-none group"
          >
            <circle cx={x} cy={y} r="18" fill="transparent" />
            <circle cx={x} cy={y} r="6" className="map-ping fill-champagne/40" />
            <circle
              cx={x}
              cy={y}
              r={isActive ? 6 : 4.5}
              className={`transition-all duration-300 ${isActive ? 'fill-champagne' : 'fill-champagne/70 group-hover:fill-champagne'}`}
              stroke="#000"
              strokeWidth="1.5"
            />
            {isActive && <circle cx={x} cy={y} r="11" fill="none" stroke="rgba(245,244,240,0.6)" strokeWidth="1" />}
            <text
              x={x + l.dx}
              y={y + l.dy}
              textAnchor={l.anchor}
              className={`text-[11px] uppercase font-semibold transition-colors ${isActive ? 'fill-champagne' : 'fill-white/55 group-hover:fill-white/85'}`}
              style={{ letterSpacing: '0.18em' }}
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DestinationPanel({ id }) {
  const dest = DESTINATIONS.find((d) => d.id === id);
  const projects = PROJECTS.filter((p) => p.destination === id);
  return (
    <div className="lg:sticky lg:top-28">
      <div className="text-[11px] font-semibold tracking-[0.32em] uppercase text-muted mb-3">{dest.region}</div>
      <div className="text-[32px] md:text-[40px] font-extralight uppercase tracking-[0.06em] text-champagne leading-none mb-2">
        {dest.name}
      </div>
      <div className="text-xs tracking-[0.14em] uppercase text-muted mb-8">
        {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
      </div>
      <div className="flex flex-col gap-4">
        {projects.map((p) => {
          return (
            <Link
              key={p.key}
              to={projectPath(p.key)}
              className="group flex items-center gap-5 p-3 pr-5 border border-glass hover:border-glass-strong bg-white/[0.02] transition-colors"
            >
              <div className="w-24 h-20 md:w-28 md:h-24 flex-none bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }} />
              <div className="flex-1 min-w-0">
                <div className="text-base md:text-lg font-light uppercase tracking-[0.06em] text-champagne truncate">{p.name}</div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted mt-1.5">{p.category}</div>
              </div>
              <span className="text-champagne/60 group-hover:text-champagne group-hover:translate-x-1 transition-all">&rarr;</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const ABOUT_STATS = [
  { value: String(FOUNDED_YEAR), label: 'Established' },
  { value: String(PROJECTS.length).padStart(2, '0'), label: 'Communities' },
  { value: String(DESTINATIONS.length).padStart(2, '0'), label: 'Destinations' },
];

function AboutSection() {
  const ref = useReveal();
  return (
    <section id="about" ref={ref} className="relative px-5 md:px-16 py-20 md:py-[160px] overflow-hidden">
      <div className="absolute -left-40 top-1/3 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(245,244,240,0.06)_0%,rgba(245,244,240,0)_70%)] pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24 items-center">
        {/* copy */}
        <div>
          <div className="reveal flex items-center gap-4 mb-8 md:mb-10">
            <span className="w-10 h-px bg-champagne/60" />
            <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">About Us</span>
          </div>

          <h2 className="reveal [transition-delay:120ms] font-extralight uppercase text-[34px] md:text-[60px] leading-[1.08] tracking-[0.04em]">
            Creating experiential
            <span className="block text-champagne/55">living spaces</span>
            <span className="block">&amp; communities</span>
          </h2>

          <p className="reveal [transition-delay:240ms] mt-8 md:mt-12 text-[15px] md:text-[18px] leading-[1.8] text-muted font-light max-w-[520px]">
            With a focus on creating exceptional living spaces that cater to modern lifestyles, the company has established a strong
            footprint in the Egyptian real estate market.
          </p>

          <div className="reveal [transition-delay:360ms] mt-12 md:mt-16 grid grid-cols-3 max-w-[520px] border-t border-glass">
            {ABOUT_STATS.map((stat, i) => (
              <div key={stat.label} className={`pt-6 ${i > 0 ? 'pl-5 md:pl-8 border-l border-glass' : ''}`}>
                <div className="text-[26px] md:text-[34px] font-extralight text-champagne leading-none">{stat.value}</div>
                <div className="mt-3 text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link
            to="/vision"
            className="reveal [transition-delay:480ms] mt-12 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 hover:text-champagne transition-colors"
          >
            Our Vision <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* image composition */}
        <div className="relative h-[460px] md:h-[640px]">
          <div className="reveal-img absolute right-0 top-0 w-[78%] h-[82%] overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              style={{ backgroundImage: "url('/images/interior.jpg')" }}
            />
          </div>
          <div className="absolute right-[-12px] top-[-12px] w-[78%] h-[82%] border border-champagne/20 pointer-events-none" />

          <div className="reveal-img [transition-delay:250ms] absolute left-0 bottom-0 w-[52%] h-[48%] overflow-hidden border-[6px] border-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              style={{ backgroundImage: "url('/images/seashell-villa-night.webp')" }}
            />
          </div>

          <div className="absolute left-[4%] top-[8%] origin-left rotate-90 translate-x-3 text-[10px] tracking-[0.5em] uppercase text-champagne/50 whitespace-nowrap">
            Est. {FOUNDED_YEAR} &middot; Egypt
          </div>
        </div>
      </div>
    </section>
  );
}

const APPROACH = [
  {
    title: 'Location',
    body: 'Our approach begins with strategic site selection, focusing on accessibility, growth potential, and vibrant neighborhood dynamics to ensure a thriving community environment.',
    image: '/images/hero-terrace.webp',
  },
  {
    title: 'Design',
    body: 'We prioritize innovative, functional design that maximizes space and aesthetic appeal, incorporating user-centric details that enhance living experiences.',
    image: '/images/interior.jpg',
  },
  {
    title: 'Construction',
    body: 'Our construction approach emphasizes quality, efficiency, and sustainability, delivering durable spaces that meet both modern standards and client expectations.',
    image: '/images/seashell-villa-day.webp',
  },
  {
    title: 'End-to-End Service',
    body: 'From concept to completion, we offer comprehensive support, ensuring seamless integration of every project phase for a hassle-free experience.',
    image: '/images/seashell-playa.webp',
  },
];

function ApproachSection() {
  const [open, setOpen] = useState(0);
  // last opened step — its image stays up while everything is collapsed
  const [shown, setShown] = useState(0);
  const ref = useReveal();

  const toggle = (i) => {
    setOpen(open === i ? null : i);
    setShown(i);
  };

  return (
    <section id="approach" ref={ref} className="px-5 md:px-16 py-20 md:py-[160px] bg-obsidian">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-24 items-start">
        {/* heading + image that follows the open step */}
        <div className="lg:sticky lg:top-28">
          <div className="reveal flex items-center gap-4 mb-8">
            <span className="w-10 h-px bg-champagne/60" />
            <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">Our Approach</span>
          </div>
          <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[48px] font-extralight uppercase tracking-[0.04em] leading-[1.1] max-w-[480px]">
            Four disciplines, <span className="text-champagne/55">one standard.</span>
          </h2>

          <div className="reveal-img [transition-delay:200ms] relative mt-10 md:mt-14 h-[260px] md:h-[380px] overflow-hidden">
            {APPROACH.map((step, i) => (
              <div
                key={step.title}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  shown === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
                style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%), url('${step.image}')` }}
              />
            ))}
            <div className="absolute inset-3 md:inset-4 border border-champagne/20 pointer-events-none" />
            <div className="absolute left-6 bottom-6 md:left-8 md:bottom-7 flex items-baseline gap-4">
              <span className="text-[40px] md:text-[56px] font-extralight text-champagne leading-none tabular-nums">
                {String(shown + 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] tracking-[0.28em] uppercase text-champagne/70">{APPROACH[shown].title}</span>
            </div>
          </div>
        </div>

        {/* accordion */}
        <div className="border-t border-glass">
          {APPROACH.map((step, i) => {
            const isOpen = open === i;
            const panelId = `approach-panel-${i}`;
            return (
              <div key={step.title} className="reveal border-b border-glass" style={{ transitionDelay: `${200 + i * 100}ms` }}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="group w-full flex items-center gap-5 md:gap-10 py-7 md:py-9 text-left"
                  >
                    <span
                      className={`text-[13px] md:text-sm font-light tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                        isOpen ? 'text-champagne' : 'text-muted'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 text-[22px] md:text-[34px] font-extralight uppercase tracking-[0.05em] transition-colors duration-500 ${
                        isOpen ? 'text-champagne' : 'text-white/60 group-hover:text-white'
                      }`}
                    >
                      {step.title}
                    </span>
                    {/* plus that morphs into a minus */}
                    <span
                      className={`relative flex-none w-10 h-10 md:w-12 md:h-12 rounded-full border transition-colors duration-500 ${
                        isOpen ? 'border-champagne/60 bg-champagne/[0.06]' : 'border-glass-strong group-hover:border-champagne/40'
                      }`}
                      aria-hidden="true"
                    >
                      <span className="absolute left-1/2 top-1/2 w-3.5 h-px -translate-x-1/2 -translate-y-1/2 bg-champagne" />
                      <span
                        className={`absolute left-1/2 top-1/2 w-px h-3.5 -translate-x-1/2 -translate-y-1/2 bg-champagne transition-transform duration-500 ${
                          isOpen ? 'rotate-90 scale-y-0' : 'rotate-0 scale-y-100'
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pl-[calc(13px*2.2+1.25rem)] md:pl-[calc(14px*2.2+2.5rem)] pr-14 md:pr-20 pb-8 md:pb-10 text-[15px] md:text-[17px] leading-[1.8] text-muted font-light max-w-[640px] transition-all duration-700 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                      }`}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <Link
      to={projectPath(project.key)}
      className="group relative flex-none block w-[78vw] max-w-[340px] md:w-[420px] md:max-w-none h-[62vh] max-h-[620px] min-h-[440px] rounded-[2px] overflow-hidden bg-obsidian shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.12]"
        style={{ backgroundImage: `url('${project.image}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.92)_100%)]" />

      {/* inset hairline frame */}
      <div className="absolute inset-3 md:inset-4 border border-champagne/20 transition-colors duration-700 group-hover:border-champagne/45 pointer-events-none" />

      <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-semibold tracking-[0.32em] uppercase text-champagne/80">{project.location}</span>
          <span className="font-extralight text-[13px] tracking-[0.2em] text-champagne/70">
            {String(index + 1).padStart(2, '0')}
            <span className="text-champagne/35"> / {String(PROJECTS.length).padStart(2, '0')}</span>
          </span>
        </div>

        <div>
          <div className="w-10 h-px bg-champagne/60 mb-6 transition-all duration-700 group-hover:w-20" />
          <h3 className="font-extralight uppercase text-[30px] md:text-[38px] leading-[1.08] tracking-[0.06em] text-champagne">
            {project.name}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.24em] uppercase text-muted">{project.category}</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne opacity-0 translate-x-[-8px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
              Discover &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [pin, setPin] = useState('north-coast');
  const [hoveredPin, setHoveredPin] = useState(null);
  const { sectionRef, trackRef, height, progress } = useScrollTrack();

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active="" />

      {/* HERO */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden hero-lines bg-cover bg-[position:center_65%]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.6) 60%, #000000 100%), url('/images/hero-terrace.webp')",
        }}
      >
        <div className="absolute w-[640px] h-[640px] -right-40 -top-32 rounded-full bg-[radial-gradient(circle,rgba(245,244,240,0.10)_0%,rgba(245,244,240,0)_68%)] animate-drift pointer-events-none" />

        <div className="relative px-5 pt-36 md:px-16 md:pt-[220px] max-w-[1020px]">
          <div className="text-[10px] md:text-xs font-semibold tracking-[0.24em] md:tracking-[0.32em] uppercase text-muted mb-5 md:mb-7">
            Architectural Mastery &middot; Since {FOUNDED_YEAR}
          </div>
          <h1 className="font-extralight text-[42px] md:text-[88px] leading-[1.06] tracking-tight">
            Living spaces crafted as timeless works of art.
          </h1>
          <p className="mt-6 md:mt-11 text-[15px] md:text-[17px] leading-[1.7] text-muted max-w-[560px] font-light">
            G Developments shapes coastal resorts and urban landmarks across Egypt, built on {YEARS_ACTIVE} years of architectural discipline.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 px-5 pt-12 pb-10 md:px-16 md:pt-[72px] md:pb-14">
          <Link
            to="/vision"
            className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 w-fit hover:text-champagne transition-colors"
          >
            Discover Our Vision <span aria-hidden="true">&rarr;</span>
          </Link>
          <div className="flex gap-10 md:gap-16">
            <div>
              <div className="text-[22px] md:text-[28px] font-light text-champagne">{String(DESTINATIONS.length).padStart(2, '0')}</div>
              <div className="text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-muted mt-1">Destinations</div>
            </div>
            <div>
              <div className="text-[22px] md:text-[28px] font-light text-champagne">{YEARS_ACTIVE}</div>
              <div className="text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-muted mt-1">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* COMMUNITIES — vertical scroll drives the track horizontally */}
      <section id="communities" ref={sectionRef} className="relative" style={{ height: height ?? '100vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="flex items-end justify-between gap-8 px-5 md:px-16 mb-8 md:mb-12">
            <div>
              <div className="text-xs font-semibold tracking-[0.24em] md:tracking-[0.28em] uppercase text-muted mb-3 md:mb-[18px]">
                Communities &amp; Projects
              </div>
              <h2 className="text-[26px] md:text-[44px] font-light tracking-tight max-w-[620px] leading-[1.2]">
                Destinations where vision becomes address.
              </h2>
            </div>
            <Link
              to="/communities"
              className="hidden md:inline-block text-xs font-semibold tracking-[0.12em] uppercase border-b border-glass-strong pb-[5px] whitespace-nowrap"
            >
              View All Communities &rarr;
            </Link>
          </div>

          <div ref={trackRef} className="flex gap-5 md:gap-8 px-5 md:px-16 w-max will-change-transform">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.key} project={p} index={i} />
            ))}
          </div>

          <div className="flex items-center gap-5 px-5 md:px-16 mt-8 md:mt-10">
            <div className="relative h-px flex-1 max-w-[320px] bg-white/10">
              <div className="absolute inset-y-0 left-0 bg-champagne" style={{ width: `${progress * 100}%` }} />
            </div>
            <span className="text-[11px] tracking-[0.24em] uppercase text-muted">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="px-5 md:px-16 py-16 md:py-[140px] bg-gradient-to-b from-black to-obsidian">
        <div className="mb-10 md:mb-16">
          <div className="text-xs font-semibold tracking-[0.24em] md:tracking-[0.28em] uppercase text-muted mb-4 md:mb-[18px]">
            Our Footprint
          </div>
          <h2 className="text-[26px] md:text-[44px] font-light tracking-tight max-w-[620px] leading-[1.2]">
            Across Egypt, one uncompromising standard.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12 items-start">
          <MapScope locked={hoveredPin}>
            <EgyptMap active={pin} onSelect={setPin} onHover={setHoveredPin} />
          </MapScope>
          <DestinationPanel id={pin} />
        </div>
      </section>

      <ApproachSection />

      <ContactCta />

      <Footer />
    </div>
  );
}
