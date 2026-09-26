import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import ContactCta from '../components/ContactCta.jsx';
import AmenityIcon from '../components/AmenityIcon.jsx';
import useReveal from '../hooks/useReveal.js';
import { DESTINATIONS, PROJECTS, getProject, projectPath } from '../data/projects.js';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'residences', label: 'Residences' },
  { id: 'masterplan', label: 'Master Plan' },
  { id: 'gallery', label: 'Gallery' },
];

const pad = (n) => String(n).padStart(2, '0');

function Eyebrow({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-4 mb-6 md:mb-8 ${className}`}>
      <span className="w-10 h-px bg-champagne/60" />
      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">{children}</span>
    </div>
  );
}

// ---------- Hero ----------
function Hero({ project, region }) {
  const facts = [
    ['Location', `${project.location}, Egypt`],
    ['Destination', region],
    ['Concept', project.category],
    ['Residences', `${project.units.length} Types`],
  ];

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div
        key={project.key}
        className="absolute inset-0 bg-cover bg-center animate-kenburns"
        style={{ backgroundImage: `url('${project.image}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.35)_65%,#000_100%)]" />

      <div className="relative h-full flex flex-col justify-end px-5 md:px-16 pb-8 md:pb-12">
        <nav className="hero-rise absolute top-28 md:top-36 left-5 md:left-16 flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-white/60">
          <Link to="/communities" className="hover:text-champagne transition-colors">Communities</Link>
          <span className="w-4 h-px bg-white/40" />
          <span className="text-champagne">{project.name}</span>
        </nav>

        <div className="hero-rise [animation-delay:150ms] text-[11px] md:text-xs font-semibold tracking-[0.32em] uppercase text-champagne/80 mb-5">
          {project.location} &middot; {project.category}
        </div>
        <h1 className="hero-rise [animation-delay:300ms] font-extralight uppercase text-[44px] sm:text-[64px] md:text-[104px] leading-[0.98] tracking-[0.02em] max-w-[1100px]">
          {project.name}
        </h1>
        <p className="hero-rise [animation-delay:450ms] mt-6 md:mt-8 text-[16px] md:text-[20px] font-light text-white/75 max-w-[560px] leading-[1.6]">
          {project.tagline}
        </p>

        <div className="hero-rise [animation-delay:600ms] mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-white/15 backdrop-blur-sm">
          {facts.map(([label, value], i) => (
            <div key={label} className={`py-5 md:py-6 ${i % 2 ? 'pl-5' : ''} ${i > 0 ? 'md:pl-8 md:border-l md:border-white/15' : ''} ${i > 1 ? 'border-t border-white/15 md:border-t-0' : ''}`}>
              <div className="text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-white/50 mb-2">{label}</div>
              <div className="text-sm md:text-base font-light text-champagne">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Floating section nav ----------
function SectionNav({ project }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [project.key]);

  return (
    <div
      className={`fixed z-40 bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <nav className="flex items-center gap-1 p-1.5 rounded-full bg-obsidian/75 backdrop-blur-xl border border-glass-strong shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex-none px-4 py-2.5 rounded-full text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${
              active === s.id ? 'bg-champagne text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {s.label}
          </a>
        ))}
        <Link
          to="/contact"
          className="flex-none ml-1 px-5 py-2.5 rounded-full border border-champagne/60 text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase text-champagne hover:bg-champagne hover:text-black transition-colors"
        >
          Enquire
        </Link>
      </nav>
    </div>
  );
}

// ---------- Overview ----------
function Overview({ project }) {
  const ref = useReveal();
  const [lead, ...rest] = project.overview;
  return (
    <section id="overview" ref={ref} className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-24 items-center">
        <div>
          <Eyebrow className="reveal">The Project</Eyebrow>
          <p className="reveal [transition-delay:120ms] text-[24px] md:text-[34px] font-extralight leading-[1.45] text-white/90">{lead}</p>
          {rest.map((para) => (
            <p key={para.slice(0, 20)} className="reveal [transition-delay:240ms] mt-8 text-[15px] md:text-[17px] leading-[1.85] text-muted font-light max-w-[560px]">
              {para}
            </p>
          ))}
          <Link
            to="/contact"
            className="reveal [transition-delay:360ms] mt-12 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 hover:text-champagne transition-colors"
          >
            Download Brochure <span aria-hidden="true">&darr;</span>
          </Link>
        </div>

        <div className="relative h-[420px] md:h-[600px]">
          <div className="reveal-img absolute inset-0 overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              style={{ backgroundImage: `url('${project.gallery[1].src}')` }}
            />
          </div>
          <div className="absolute -left-3 -bottom-3 md:-left-4 md:-bottom-4 w-full h-full border border-champagne/20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

// ---------- Lifestyle ----------
function LifestyleRow({ item, index }) {
  const ref = useReveal();
  const flip = index % 2 === 1;
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      <div className={`reveal-img relative h-[320px] md:h-[560px] overflow-hidden md:col-span-7 ${flip ? 'md:order-2 md:col-start-6' : ''}`}>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
          style={{ backgroundImage: `url('${item.image}')` }}
        />
      </div>
      <div className={`md:col-span-5 ${flip ? 'md:order-1 md:col-start-1 md:pr-8' : 'md:pl-8'}`}>
        <div className="reveal text-[64px] md:text-[96px] font-extralight leading-none text-champagne/15 tabular-nums">{pad(index + 1)}</div>
        <h3 className="reveal [transition-delay:120ms] -mt-4 md:-mt-8 text-[26px] md:text-[38px] font-extralight uppercase tracking-[0.04em] leading-[1.15]">
          {item.title}
        </h3>
        <div className="reveal [transition-delay:200ms] w-10 h-px bg-champagne/60 my-6 md:my-8" />
        <p className="reveal [transition-delay:280ms] text-[15px] md:text-[17px] leading-[1.85] text-muted font-light max-w-[420px]">{item.body}</p>
      </div>
    </div>
  );
}

function Lifestyle({ project }) {
  const ref = useReveal();
  return (
    <section id="lifestyle" className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px] bg-obsidian">
      <div ref={ref} className="text-center mb-16 md:mb-28">
        <Eyebrow className="reveal justify-center">Lifestyle</Eyebrow>
        <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[56px] font-extralight uppercase tracking-[0.04em] leading-[1.1]">
          A day at <span className="text-champagne/55">{project.name}</span>
        </h2>
      </div>
      <div className="flex flex-col gap-20 md:gap-32">
        {project.lifestyle.map((item, i) => (
          <LifestyleRow key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

// ---------- Amenities ----------
function Amenities({ project }) {
  const ref = useReveal();
  return (
    <section id="amenities" ref={ref} className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-20">
        <div>
          <Eyebrow className="reveal">Amenities &amp; Features</Eyebrow>
          <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[52px] font-extralight uppercase tracking-[0.04em] leading-[1.1] max-w-[640px]">
            Every detail, <span className="text-champagne/55">considered.</span>
          </h2>
        </div>
        <p className="reveal [transition-delay:200ms] text-[15px] text-muted font-light leading-[1.8] max-w-[360px]">
          Facilities curated to make {project.name} a complete destination, not just an address.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-glass">
        {project.amenities.map((a, i) => (
          <div
            key={a.label}
            className="reveal group relative border-r border-b border-glass p-6 md:p-10 min-h-[170px] md:min-h-[230px] flex flex-col justify-between overflow-hidden"
            style={{ transitionDelay: `${150 + i * 60}ms` }}
          >
            <div className="absolute inset-0 bg-champagne/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start justify-between">
              <span className="text-champagne/80 transition-transform duration-500 group-hover:-translate-y-1">
                <AmenityIcon name={a.icon} className="w-8 h-8 md:w-10 md:h-10" />
              </span>
              <span className="text-[11px] tracking-[0.2em] text-white/30 tabular-nums">{pad(i + 1)}</span>
            </div>
            <div className="relative text-[13px] md:text-[15px] font-light uppercase tracking-[0.12em] text-white/85">{a.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Residences ----------
function Residences({ project }) {
  const [active, setActive] = useState(0);
  const ref = useReveal();
  const unit = project.units[active];

  return (
    <section id="residences" ref={ref} className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px] bg-obsidian">
      <Eyebrow className="reveal">Residences</Eyebrow>
      <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[52px] font-extralight uppercase tracking-[0.04em] leading-[1.1] mb-10 md:mb-14">
        Choose your <span className="text-champagne/55">residence</span>
      </h2>

      <div className="reveal [transition-delay:200ms] flex gap-6 md:gap-10 border-b border-glass mb-10 md:mb-14 overflow-x-auto no-scrollbar" role="tablist">
        {project.units.map((u, i) => (
          <button
            key={u.type}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`flex-none pb-4 md:pb-5 -mb-px border-b text-xs md:text-[13px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${
              active === i ? 'text-champagne border-champagne' : 'text-muted border-transparent hover:text-white'
            }`}
          >
            <span className="text-white/30 mr-3 tabular-nums">{pad(i + 1)}</span>
            {u.type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20 items-center">
        <div className="relative h-[320px] md:h-[560px] overflow-hidden">
          {project.units.map((u, i) => (
            <div
              key={u.type}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ backgroundImage: `url('${u.image}')` }}
            />
          ))}
          <div className="absolute inset-3 md:inset-4 border border-champagne/20 pointer-events-none" />
        </div>

        <div key={unit.type} className="animate-fade-up">
          <div className="text-[72px] md:text-[110px] font-extralight leading-none text-champagne/15 tabular-nums">{pad(active + 1)}</div>
          <h3 className="-mt-4 md:-mt-8 text-[30px] md:text-[44px] font-extralight uppercase tracking-[0.04em]">{unit.type}</h3>
          <p className="mt-6 text-[15px] md:text-[17px] leading-[1.85] text-muted font-light max-w-[440px]">{unit.body}</p>
          <ul className="mt-8 border-t border-glass">
            {unit.highlights.map((h) => (
              <li key={h} className="flex items-center gap-4 py-4 border-b border-glass text-sm md:text-[15px] font-light text-white/85">
                <span className="w-4 h-px bg-champagne" />
                {h}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="group mt-10 inline-flex items-center gap-4 px-8 py-4 border border-champagne/60 text-[11px] font-semibold tracking-[0.24em] uppercase text-champagne hover:bg-champagne hover:text-black transition-colors duration-500"
          >
            Request Floor Plans &amp; Pricing
            <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------- Master plan ----------
// Illustrative layout only: shapes are generic, one per zone in project.zones.
const PLAN_SHAPES = [
  (on) => (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={70 + i * 68} y={112} width={48} height={34} rx={3} className={on} />
      ))}
    </g>
  ),
  (on) => (
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={70 + (i % 4) * 66} y={250 + Math.floor(i / 4) * 62} width={48} height={40} rx={3} className={on} />
      ))}
    </g>
  ),
  (on) => <rect x={370} y={185} width={110} height={70} rx={6} className={on} />,
  (on) => <ellipse cx={575} cy={335} rx={165} ry={78} className={on} />,
  (on) => <rect x={520} y={188} width={200} height={46} rx={23} className={on} />,
  (on) => <rect x={385} y={440} width={50} height={30} rx={3} className={on} />,
];

function MasterPlan({ project }) {
  const [hover, setHover] = useState(null);
  const ref = useReveal();
  const coastal = project.destination !== 'cairo';

  return (
    <section id="masterplan" ref={ref} className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">
        <div className="reveal-img relative rounded-[2px] border border-glass bg-[#060606] p-4 md:p-8">
          <svg viewBox="0 0 800 500" className="w-full h-auto" role="img" aria-label={`Illustrative master plan of ${project.name}`}>
            <defs>
              <pattern id="plan-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M25 0H0V25" fill="none" stroke="rgba(255,255,255,0.04)" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#plan-grid)" />
            {coastal ? (
              <>
                <path d="M0 0H800V70C700 92 600 60 500 78S300 98 200 74 60 86 0 72Z" fill="rgba(245,244,240,0.06)" />
                <path d="M0 84C60 98 200 86 200 88S400 108 500 92 700 104 800 84" fill="none" stroke="rgba(245,244,240,0.25)" strokeDasharray="3 6" />
                <text x="400" y="42" textAnchor="middle" className="fill-white/30 text-[11px] uppercase" style={{ letterSpacing: '0.5em' }}>
                  {project.destination === 'sokhna' ? 'Red Sea' : 'Mediterranean Sea'}
                </text>
              </>
            ) : (
              <path d="M40 60H760" stroke="rgba(245,244,240,0.2)" strokeWidth="10" strokeLinecap="round" />
            )}
            {/* roads */}
            <g fill="none" stroke="rgba(245,244,240,0.12)" strokeWidth="6" strokeLinecap="round">
              <path d="M410 470V170H60M410 170H740M350 170V450" />
            </g>
            {PLAN_SHAPES.map((shape, i) => (
              <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                {shape(
                  `transition-all duration-500 ${
                    hover === i ? 'fill-champagne/70 stroke-champagne' : hover === null ? 'fill-white/[0.07] stroke-white/30' : 'fill-white/[0.03] stroke-white/10'
                  }`,
                )}
              </g>
            ))}
            {/* compass */}
            <g transform="translate(750 450)" className="fill-none stroke-white/40">
              <circle r="18" />
              <path d="M0 -13L5 5 0 1 -5 5Z" className="fill-champagne/70 stroke-none" />
              <text y="-24" textAnchor="middle" className="fill-white/50 stroke-none text-[10px]">N</text>
            </g>
          </svg>
          <div className="absolute left-6 bottom-5 md:left-10 md:bottom-8 text-[10px] tracking-[0.24em] uppercase text-white/35">
            Illustrative layout &middot; not to scale
          </div>
        </div>

        <div>
          <Eyebrow className="reveal">Master Plan</Eyebrow>
          <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[48px] font-extralight uppercase tracking-[0.04em] leading-[1.1] mb-10">
            Planned around <span className="text-champagne/55">{coastal ? 'the water' : 'the landscape'}</span>
          </h2>
          <ol className="reveal [transition-delay:200ms] border-t border-glass">
            {project.zones.map((zone, i) => (
              <li key={zone}>
                <button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={`w-full flex items-center gap-6 py-4 border-b border-glass text-left transition-colors duration-300 ${
                    hover === i ? 'text-champagne' : 'text-white/75'
                  }`}
                >
                  <span className={`w-8 h-8 flex-none rounded-full border flex items-center justify-center text-[11px] tabular-nums transition-colors duration-300 ${hover === i ? 'border-champagne bg-champagne text-black' : 'border-glass-strong text-white/60'}`}>
                    {pad(i + 1)}
                  </span>
                  <span className="text-sm md:text-[15px] font-light uppercase tracking-[0.12em]">{zone}</span>
                </button>
              </li>
            ))}
          </ol>
          <Link
            to="/contact"
            className="reveal [transition-delay:280ms] mt-10 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 hover:text-champagne transition-colors"
          >
            Request the Official Master Plan <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------- Gallery + lightbox ----------
const BENTO = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-2 row-span-1',
];

function Lightbox({ images, index, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onMove]);

  const img = images[index];
  const arrow = 'absolute top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border border-glass-strong flex items-center justify-center text-champagne hover:bg-champagne hover:text-black transition-colors';

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in" role="dialog" aria-modal="true" onClick={onClose}>
      <img
        key={img.src}
        src={img.src}
        alt={img.caption}
        className="max-w-[92vw] max-h-[80vh] object-contain animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center text-[11px] tracking-[0.28em] uppercase text-white/60">
        <span className="text-champagne tabular-nums">{pad(index + 1)}</span> / {pad(images.length)} &middot; {img.caption}
      </div>
      <button type="button" aria-label="Previous image" className={`${arrow} left-3 md:left-8`} onClick={(e) => (e.stopPropagation(), onMove(-1))}>&larr;</button>
      <button type="button" aria-label="Next image" className={`${arrow} right-3 md:right-8`} onClick={(e) => (e.stopPropagation(), onMove(1))}>&rarr;</button>
      <button type="button" aria-label="Close gallery" className="absolute top-5 right-5 md:top-8 md:right-8 text-[11px] font-semibold tracking-[0.24em] uppercase text-white/70 hover:text-champagne" onClick={onClose}>
        Close &times;
      </button>
    </div>
  );
}

function Gallery({ project }) {
  const [open, setOpen] = useState(null);
  const ref = useReveal();
  const images = project.gallery;

  return (
    <section id="gallery" ref={ref} className="scroll-mt-24 px-5 md:px-16 py-20 md:py-[160px] bg-obsidian">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
        <div>
          <Eyebrow className="reveal">Gallery</Eyebrow>
          <h2 className="reveal [transition-delay:120ms] text-[30px] md:text-[52px] font-extralight uppercase tracking-[0.04em] leading-[1.1]">
            Through the <span className="text-champagne/55">lens</span>
          </h2>
        </div>
        <div className="reveal [transition-delay:200ms] text-[11px] tracking-[0.24em] uppercase text-muted">Click any image to expand</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[260px] gap-3 md:gap-5 grid-flow-dense">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setOpen(i)}
            className={`reveal group relative overflow-hidden text-left ${BENTO[i % BENTO.length]}`}
            style={{ transitionDelay: `${150 + i * 80}ms` }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              style={{ backgroundImage: `url('${img.src}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-3 border border-champagne/0 group-hover:border-champagne/40 transition-colors duration-500" />
            <div className="absolute left-5 bottom-4 md:left-7 md:bottom-6 flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-white/80">
              <span className="text-champagne tabular-nums">{pad(i + 1)}</span>
              {img.caption}
            </div>
            <span className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full border border-champagne/60 flex items-center justify-center text-champagne text-sm opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" aria-hidden="true">
              +
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onClose={() => setOpen(null)}
          onMove={(step) => setOpen((i) => (i + step + images.length) % images.length)}
        />
      )}
    </section>
  );
}

// ---------- Next project ----------
function NextProject({ project }) {
  const next = PROJECTS[(PROJECTS.findIndex((p) => p.key === project.key) + 1) % PROJECTS.length];
  return (
    <Link to={projectPath(next.key)} className="group relative block h-[360px] md:h-[520px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        style={{ backgroundImage: `url('${next.image}')` }}
      />
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/45 transition-colors duration-700" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-5">
        <div className="text-[11px] font-semibold tracking-[0.32em] uppercase text-champagne/70 mb-5">Next Project</div>
        <div className="text-[40px] md:text-[88px] font-extralight uppercase tracking-[0.03em] leading-none">{next.name}</div>
        <div className="mt-5 text-xs tracking-[0.24em] uppercase text-white/60">
          {next.location} &middot; {next.category}
        </div>
        <span className="mt-10 w-14 h-14 rounded-full border border-champagne/60 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-black transition-colors duration-500" aria-hidden="true">
          &rarr;
        </span>
      </div>
    </Link>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) document.title = `${project.name} — G Developments`;
  }, [project]);

  if (!project) return <Navigate to="/communities" replace />;

  const region = DESTINATIONS.find((d) => d.id === project.destination)?.region ?? project.location;

  // keyed by project so every section resets (and re-animates) when moving to the next project
  return (
    <div key={project.key} className="min-h-screen bg-black text-white">
      <Nav active="Communities" />
      <Hero project={project} region={region} />
      <SectionNav project={project} />
      <Overview project={project} />
      <Lifestyle project={project} />
      <Amenities project={project} />
      <Residences project={project} />
      <MasterPlan project={project} />
      <Gallery project={project} />
      <ContactCta title={`Interested in ${project.name}? Let’s arrange a private consultation.`} image={project.image} />
      <NextProject project={project} />
      <Footer />
    </div>
  );
}
