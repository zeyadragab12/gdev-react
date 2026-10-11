import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DESTINATIONS, PROJECTS, projectPath } from '../data/projects.js';
import { ABOUT_PAGES, aboutPath, COMMUNITY_PATH, G_GROUP, G_GROUP_PATH, entityPath } from '../data/siteMap.js';

// `pages` = values of the `active` prop (set by each page) that highlight the link.
const LINKS = [
  { to: aboutPath(), label: 'About Us', pages: ['About', 'Vision'], children: ABOUT_PAGES.map((p) => ({ to: aboutPath(p.slug), label: p.label })) },
  { to: COMMUNITY_PATH, label: 'Communities', pages: ['Communities'], mega: true },
  { to: G_GROUP_PATH, label: 'G Group', pages: ['GGroup'], children: G_GROUP.entities.map((e) => ({ to: entityPath(e.slug), label: e.name })) },
  { to: '/#map', label: 'Destinations', pages: [] },
  { to: '/#approach', label: 'Our Approach', pages: [] },
  { to: '/contact', label: 'Contact Us', pages: ['Contact'] },
];

const CTA = { to: '/contact#enquire', label: 'Register Interest' };

function ProjectsMenu({ open, onEnter, onClose }) {
  const [preview, setPreview] = useState(PROJECTS[0]);

  return (
    <div
      onMouseEnter={onEnter}
      className={`hidden xl:block absolute left-0 right-0 top-full border-b border-glass bg-[#070707]/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-3 invisible pointer-events-none'
      }`}
    >
      <div className="px-16 py-12 grid grid-cols-[1fr_2.2fr] gap-14">
        {/* preview of the hovered project */}
        <Link to={projectPath(preview.key)} onClick={onClose} className="group relative h-[300px] overflow-hidden">
          {PROJECTS.map((p) => (
            <div
              key={p.key}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${preview.key === p.key ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              style={{ backgroundImage: `url('${p.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/0" />
          <div className="absolute inset-3 border border-champagne/20 group-hover:border-champagne/50 transition-colors duration-500" />
          <div className="absolute left-7 right-7 bottom-6">
            <div className="text-[10px] tracking-[0.26em] uppercase text-champagne/70 mb-2">
              {preview.location} &middot; {preview.category}
            </div>
            <div className="text-[26px] font-extralight uppercase tracking-[0.05em] text-champagne">{preview.name}</div>
          </div>
        </Link>

        <div className="flex flex-col">
          <div className="grid grid-cols-4 gap-8 flex-1">
            {DESTINATIONS.map((d) => (
              <div key={d.id}>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-glass">
                  <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-muted">{d.name}</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {PROJECTS.filter((p) => p.destination === d.id).map((p) => (
                    <li key={p.key}>
                      <Link
                        to={projectPath(p.key)}
                        onClick={onClose}
                        onMouseEnter={() => setPreview(p)}
                        onFocus={() => setPreview(p)}
                        className="group inline-flex items-center gap-2 text-[13px] font-light uppercase tracking-[0.08em] text-white/75 hover:text-champagne focus:text-champagne outline-none transition-colors"
                      >
                        <span className="w-0 h-px bg-champagne transition-all duration-500 group-hover:w-3 group-focus:w-3" />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-glass flex items-center justify-between">
            <span className="text-xs font-light text-white/45">
              {PROJECTS.length} communities across {DESTINATIONS.length} destinations in Egypt
            </span>
            <Link to="/community" onClick={onClose} className="text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne border-b border-champagne/40 pb-1 hover:border-champagne">
              View All Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Nav({ active }) {
  const { pathname, hash } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjects, setMobileProjects] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);

  // close menus whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname, hash]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  // small delay so moving the mouse from the link down into the panel doesn't close it
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const isActive = (l) => l.pages.includes(active);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-[18px] xl:px-16 xl:py-[22px] bg-obsidian/55 backdrop-blur-xl border-b border-glass"
      onMouseLeave={scheduleClose}
    >
      <Link to="/" className="text-[13px] md:text-[15px] font-bold tracking-[0.22em] uppercase">
        G Developments
      </Link>

      <nav className="hidden xl:flex items-center gap-7 2xl:gap-11">
        {LINKS.map((l) =>
          l.mega ? (
            <div key={l.label} onMouseEnter={openMega} onMouseLeave={scheduleClose} className="relative">
              <Link
                to={l.to}
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onFocus={openMega}
                onKeyDown={(e) => e.key === 'Escape' && setMegaOpen(false)}
                className={`group inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors ${
                  isActive(l) || megaOpen ? 'text-white' : 'text-muted hover:text-white'
                }`}
              >
                {l.label}
                <svg viewBox="0 0 24 24" className={`w-3 h-3 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>
            </div>
          ) : l.children ? (
            <div key={l.label} onMouseEnter={() => setMegaOpen(false)} className="relative group">
              <Link
                to={l.to}
                className={`relative text-xs font-medium tracking-[0.14em] uppercase transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:bg-champagne after:transition-all after:duration-500 ${
                  isActive(l) ? 'text-white after:w-full' : 'text-muted group-hover:text-white after:w-0 group-hover:after:w-full'
                }`}
              >
                {l.label}
              </Link>
              <ul className="absolute left-0 top-full pt-6 min-w-[260px] invisible opacity-0 -translate-y-2 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
                <div className="bg-[#070707]/95 backdrop-blur-xl border border-glass py-3">
                  {l.children.map((c) => (
                    <li key={c.to}>
                      <Link to={c.to} className="block px-6 py-2.5 text-[12px] font-light uppercase tracking-[0.1em] text-white/75 hover:text-champagne focus:text-champagne outline-none transition-colors">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          ) : (
            <Link
              key={l.label}
              to={l.to}
              onMouseEnter={() => setMegaOpen(false)}
              className={`relative text-xs font-medium tracking-[0.14em] uppercase transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:bg-champagne after:transition-all after:duration-500 ${
                isActive(l) ? 'text-white after:w-full' : 'text-muted hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              {l.label}
            </Link>
          ),
        )}
      </nav>

      <Link
        to={CTA.to}
        className="hidden xl:inline-block border border-champagne text-champagne text-xs font-semibold tracking-[0.14em] uppercase px-[30px] py-[11px] rounded-full transition-colors hover:bg-champagne hover:text-obsidian"
      >
        {CTA.label}
      </Link>

      <ProjectsMenu open={megaOpen} onEnter={openMega} onClose={() => setMegaOpen(false)} />

      <button
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
        className="xl:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-full border border-glass-strong"
      >
        <span className={`block w-3.5 h-px bg-white transition-transform ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
        <span className={`block w-3.5 h-px bg-white transition-opacity ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`block w-3.5 h-px bg-white transition-transform ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
      </button>

      {mobileOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 max-h-[calc(100vh-72px)] overflow-y-auto flex flex-col bg-[#050505] border-b border-glass px-5 pt-4 pb-9 animate-fade-in">
          {LINKS.map((l) =>
            l.mega ? (
              <div key={l.label} className="border-b border-glass">
                <button
                  type="button"
                  aria-expanded={mobileProjects}
                  onClick={() => setMobileProjects((v) => !v)}
                  className={`w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.14em] uppercase ${isActive(l) ? 'text-champagne' : 'text-white/80'}`}
                >
                  {l.label}
                  <span className={`text-lg leading-none transition-transform duration-300 ${mobileProjects ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ${mobileProjects ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden">
                    {PROJECTS.map((p) => (
                      <li key={p.key}>
                        <Link to={projectPath(p.key)} className="flex items-center gap-3 py-2.5 pl-2">
                          <span className="w-8 h-8 rounded-full bg-cover bg-center ring-1 ring-champagne/25" style={{ backgroundImage: `url('${p.image}')` }} />
                          <span className="text-[12px] tracking-[0.1em] uppercase text-white/70">{p.name}</span>
                          <span className="ml-auto text-[10px] tracking-[0.14em] uppercase text-white/35">{p.location}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/community" className="block py-3 pl-2 mb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne">
                        View All Projects &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : l.children ? (
              <div key={l.label} className="border-b border-glass">
                <Link to={l.to} className={`block py-4 text-[13px] font-medium tracking-[0.14em] uppercase ${isActive(l) ? 'text-champagne' : 'text-white/80'}`}>
                  {l.label}
                </Link>
                <ul className="pb-3 pl-2">
                  {l.children.map((c) => (
                    <li key={c.to}>
                      <Link to={c.to} className="block py-2 text-[12px] tracking-[0.1em] uppercase text-white/55">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className={`py-4 border-b border-glass text-[13px] font-medium tracking-[0.14em] uppercase ${isActive(l) ? 'text-champagne' : 'text-white/80'}`}
              >
                {l.label}
              </Link>
            ),
          )}
          <Link
            to={CTA.to}
            className="mt-7 text-center border border-champagne text-champagne text-xs font-semibold tracking-[0.14em] uppercase py-[13px] rounded-full"
          >
            {CTA.label}
          </Link>
        </div>
      )}
    </header>
  );
}
