import { Link } from 'react-router-dom';
import { PROJECTS, projectPath } from '../data/projects.js';
import SocialLinks from './SocialLinks.jsx';
import { FOUNDED_YEAR } from '../data/company.js';

const COMPANY = [
  { label: 'About Us', to: '/about-us' },
  { label: 'Our Story', to: '/about-us/history' },
  { label: 'Vision & Values', to: '/about-us/vision-mission' },
  { label: 'G Group', to: '/g-group' },
  { label: 'Latest Launches', to: '/community/latest-launches' },
  { label: 'Our Approach', to: '/#approach' },
  { label: 'Contact', to: '/contact' },
];

const linkClass =
  'group inline-flex items-center gap-3 text-sm text-white/70 font-light transition-colors duration-300 hover:text-champagne';

function HoverLine() {
  return <span className="w-0 h-px bg-champagne transition-all duration-500 group-hover:w-4" aria-hidden="true" />;
}

function ColumnTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="w-5 h-px bg-champagne/50" />
      <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-muted">{children}</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden">
      {/* gold hairline that fades out at both ends */}
      <div className="h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-[900px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(245,244,240,0.06)_0%,rgba(245,244,240,0)_70%)] pointer-events-none" />

      <div className="relative px-5 md:px-16 pt-20 md:pt-28">
        {/* intro row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 pb-16 md:pb-20 border-b border-glass">
          <div>
            <div className="text-[13px] font-bold tracking-[0.3em] uppercase text-champagne mb-6">G Developments</div>
            <p className="text-[26px] md:text-[40px] font-extralight leading-[1.2] tracking-tight max-w-[560px]">
              Crafting experiential living spaces <span className="text-champagne/55">since {FOUNDED_YEAR}.</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-4 self-start md:self-auto text-[11px] font-semibold tracking-[0.28em] uppercase text-muted hover:text-champagne transition-colors"
          >
            Back to top
            <span className="relative w-12 h-12 rounded-full border border-glass-strong flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:border-champagne">
              <span className="absolute inset-0 bg-champagne scale-0 rounded-full transition-transform duration-500 group-hover:scale-100" />
              <span className="relative transition-all duration-500 group-hover:text-black group-hover:-translate-y-0.5" aria-hidden="true">
                &uarr;
              </span>
            </span>
          </button>
        </div>

        {/* link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.3fr_1fr] gap-x-8 gap-y-14 py-16 md:py-20">
          <div>
            <ColumnTitle>Communities</ColumnTitle>
            <ul className="flex flex-col gap-3.5">
              {PROJECTS.map((c) => (
                <li key={c.key}>
                  <Link to={projectPath(c.key)} className={linkClass}>
                    <HoverLine />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Company</ColumnTitle>
            <ul className="flex flex-col gap-3.5">
              {COMPANY.map((c) => (
                <li key={c.label}>
                  <Link to={c.to} className={linkClass}>
                    <HoverLine />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <ColumnTitle>Get in Touch</ColumnTitle>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted mb-2">Hotline</div>
            <a href="tel:16738" className="block text-[30px] md:text-[36px] font-extralight text-champagne leading-none hover:opacity-80 transition-opacity">
              16738
            </a>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted mt-8 mb-2">Email</div>
            <a href="mailto:info@thegdevelopments.com" className="text-base md:text-lg font-light text-white/80 hover:text-champagne transition-colors break-all">
              info@thegdevelopments.com
            </a>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <ColumnTitle>Follow</ColumnTitle>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* oversized wordmark */}
      <div className="relative px-5 md:px-16 select-none" aria-hidden="true">
        <div className="whitespace-nowrap text-center font-bold uppercase leading-[0.85] tracking-[0.02em] text-[8.6vw] text-champagne">
          G Developments
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative px-5 md:px-16 py-7 border-t border-glass flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/40 font-light">
          <span>&copy; {new Date().getFullYear()} G Developments. All rights reserved.</span>
          <a href="#" className="hover:text-champagne transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-champagne transition-colors">Terms of Use</a>
        </div>
        <div className="text-[11px] text-white/30 font-light max-w-[520px] md:text-right leading-[1.6]">
          Renders are artistic impressions and may differ from final construction. Prices, availability and specifications are subject to change without prior notice.
        </div>
      </div>
    </footer>
  );
}
