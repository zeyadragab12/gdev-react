import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import ContactCta from '../components/ContactCta.jsx';
import useReveal from '../hooks/useReveal.js';
import { DESTINATIONS, PROJECTS, projectPath } from '../data/projects.js';
import { PROJECT_GEO } from '../data/projectGeo.js';

// Mapbox is heavy: load it only when the map section is rendered
const ProjectMap = lazy(() => import('../components/map/ProjectMap.jsx'));
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

function DestinationPanel({ id, focus, onLocate }) {
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
          const located = focus === p.key;
          return (
            <div key={p.key} className="flex flex-col">
              <Link
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
              {PROJECT_GEO[p.key] && (
                <button
                  type="button"
                  onClick={() => onLocate(p.key)}
                  aria-pressed={located}
                  className={`self-start border border-t-0 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    located ? 'border-champagne/60 text-champagne' : 'border-glass text-muted hover:border-glass-strong hover:text-champagne'
                  }`}
                >
                  {located ? 'Showing on map' : 'Locate on map'}
                </button>
              )}
            </div>
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
            to="/about-us/vision-mission"
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
  // destination the map is zoomed into (null = whole country)
  const [zoomed, setZoomed] = useState(null);
  // project whose master plan is shown on the map (null = the destination overview)
  const [focus, setFocus] = useState(null);

  // a destination pin zooms in on its projects; clicking it again zooms back out to Egypt
  const selectPin = (id) => {
    setFocus(null);
    if (id === zoomed) {
      setZoomed(null);
      return;
    }
    setPin(id);
    setZoomed(id);
  };
  // a project pin zooms onto its master plan; clicking it again zooms back out to the destination
  const selectProject = (key) => {
    if (focus === key) {
      setFocus(null);
      return;
    }
    const { destination } = PROJECTS.find((p) => p.key === key);
    setPin(destination);
    setZoomed(destination);
    setFocus(key);
  };
  const focusProject = focus && PROJECTS.find((p) => p.key === focus);
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
            to="/about-us/vision-mission"
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
              to="/community"
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
          <div className="relative h-[460px] md:h-[640px] overflow-hidden rounded-[2px] border border-glass bg-[#050505]">
            <Suspense fallback={<div className="grid h-full place-items-center text-[11px] uppercase tracking-[0.3em] text-muted">Loading map</div>}>
              <ProjectMap zoomed={zoomed} focus={focus} onSelectDestination={selectPin} onSelectProject={selectProject} />
            </Suspense>
            {zoomed && (
              <div className="absolute left-4 top-4 z-20 flex flex-col items-start gap-2 md:left-6 md:top-6">
                <button
                  type="button"
                  onClick={() => (focus ? setFocus(null) : setZoomed(null))}
                  className="inline-flex items-center gap-3 border border-glass-strong bg-black/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur transition-colors hover:border-champagne/60"
                >
                  <span aria-hidden="true">&larr;</span> {focus ? DESTINATIONS.find((d) => d.id === zoomed).name : 'All of Egypt'}
                </button>
                {focusProject && (
                  <Link
                    to={focusProject.plan ? `${projectPath(focusProject.key)}#masterplan` : projectPath(focusProject.key)}
                    className="inline-flex items-center gap-3 border border-champagne/50 bg-black/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur transition-colors hover:border-champagne"
                  >
                    {focusProject.plan ? 'Explore master plan' : 'View project'} <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            )}
          </div>
          <DestinationPanel id={pin} focus={focus} onLocate={selectProject} />
        </div>
      </section>

      <ApproachSection />

      <ContactCta />

      <Footer />
    </div>
  );
}
