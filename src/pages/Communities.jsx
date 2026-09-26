import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import ContactCta from '../components/ContactCta.jsx';
import { DESTINATIONS, PROJECTS, projectPath } from '../data/projects.js';

const TABS = [{ id: 'all', name: 'All Communities' }, ...DESTINATIONS];
const pad = (n) => String(n).padStart(2, '0');

function CommunityCard({ project, index, wide }) {
  return (
    <Link
      to={projectPath(project.key)}
      className={`group relative block overflow-hidden animate-fade-up ${wide ? 'md:col-span-2 h-[440px] md:h-[560px]' : 'h-[440px] md:h-[560px]'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        style={{ backgroundImage: `url('${project.image}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-3 md:inset-4 border border-champagne/20 group-hover:border-champagne/50 transition-colors duration-700 pointer-events-none" />

      <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-semibold tracking-[0.32em] uppercase text-champagne/80">{project.location}</span>
          <span className="text-[13px] font-extralight tracking-[0.2em] text-champagne/70 tabular-nums">{pad(index + 1)}</span>
        </div>
        <div>
          <div className="w-10 h-px bg-champagne/60 mb-6 transition-all duration-700 group-hover:w-20" />
          <h2 className="font-extralight uppercase text-[30px] md:text-[42px] leading-[1.05] tracking-[0.05em] text-champagne">{project.name}</h2>
          <p className="mt-4 text-sm font-light text-white/70 max-w-[420px] leading-[1.6]">{project.tagline}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.24em] uppercase text-muted">{project.category}</span>
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne">
              Explore
              <span className="w-9 h-9 rounded-full border border-champagne/50 flex items-center justify-center transition-colors duration-500 group-hover:bg-champagne group-hover:text-black">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Communities() {
  const [filter, setFilter] = useState('all');
  const visible = PROJECTS.filter((p) => filter === 'all' || p.destination === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active="Communities" />

      <section className="px-5 md:px-16 pt-36 md:pt-[220px] pb-16 md:pb-20 bg-[radial-gradient(90%_70%_at_85%_0%,rgba(245,244,240,0.08)_0%,rgba(10,10,10,0)_55%)]">
        <div className="hero-rise flex items-center gap-4 mb-6">
          <span className="w-10 h-px bg-champagne/60" />
          <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">Our Communities</span>
        </div>
        <h1 className="hero-rise [animation-delay:150ms] text-[36px] md:text-[72px] font-extralight uppercase tracking-[0.02em] leading-[1.05] max-w-[1000px]">
          Every address begins with a place <span className="text-champagne/55">worth belonging to.</span>
        </h1>
        <p className="hero-rise [animation-delay:300ms] mt-8 text-[15px] md:text-[17px] text-muted font-light max-w-[520px] leading-[1.8]">
          {PROJECTS.length} communities across {DESTINATIONS.length} destinations — from the Mediterranean to the Red Sea and the heart of Cairo.
        </p>
      </section>

      <div className="px-5 md:px-16 flex gap-6 md:gap-10 border-b border-glass mb-10 md:mb-16 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const count = t.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.destination === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex-none pb-4 md:pb-[18px] -mb-px text-xs font-semibold tracking-[0.16em] uppercase border-b transition-colors ${
                filter === t.id ? 'text-champagne border-champagne' : 'text-muted border-transparent hover:text-white'
              }`}
            >
              {t.name} <span className="ml-1.5 text-white/30 tabular-nums">{pad(count)}</span>
            </button>
          );
        })}
      </div>

      <div key={filter} className="px-5 md:px-16 pb-20 md:pb-[160px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {visible.map((p, i) => (
          // first card of every group of three spans the full width for an editorial rhythm
          <CommunityCard key={p.key} project={p} index={i} wide={i % 3 === 0} />
        ))}
      </div>

      <ContactCta />
      <Footer />
    </div>
  );
}
