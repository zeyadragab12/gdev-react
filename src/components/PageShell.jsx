import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';

const SITE = 'G Developments';

// Sets the tab title and meta description for the current page.
function useSeo(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (!description) return;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}

// Shared frame for the inner pages: nav, breadcrumb, hero, body, footer.
// `crumbs` = [{ label, to }] ending with the current page (no `to`).
export default function PageShell({ active, eyebrow, title, intro, crumbs = [], seoTitle, description, children }) {
  useSeo(seoTitle ?? `${title} | ${SITE}`, description);

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active={active} />

      <section className="px-5 md:px-16 pt-36 md:pt-[200px] pb-14 md:pb-[100px] bg-[radial-gradient(90%_70%_at_15%_10%,rgba(245,244,240,0.08)_0%,rgba(10,10,10,0)_55%)]">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted mb-8">
            <Link to="/" className="hover:text-champagne transition-colors">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.to ? <Link to={c.to} className="hover:text-champagne transition-colors">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="text-xs font-semibold tracking-[0.28em] uppercase text-muted mb-5">{eyebrow}</div>}
        <h1 className="text-[32px] md:text-[60px] font-extralight leading-[1.18] max-w-[900px]">{title}</h1>
        {intro && <p className="mt-7 text-base md:text-lg font-light leading-[1.75] text-muted max-w-[640px]">{intro}</p>}
      </section>

      <main className="border-t border-glass">{children}</main>

      <Footer />
    </div>
  );
}

// A titled content band used inside PageShell.
export function Block({ title, children, className = '' }) {
  return (
    <section className={`px-5 md:px-16 py-14 md:py-24 border-b border-glass last:border-b-0 ${className}`}>
      {title && <h2 className="text-2xl md:text-[34px] font-extralight mb-8 md:mb-12 max-w-[760px]">{title}</h2>}
      {children}
    </section>
  );
}

export function Prose({ children }) {
  return <p className="text-base md:text-lg font-light leading-[1.8] text-muted max-w-[720px]">{children}</p>;
}

// Numbered/titled grid of short statements (values, approach, ...).
export function CardGrid({ items }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
      {items.map((it, i) => (
        <li key={it.title} className="flex gap-7">
          <div className="text-[15px] font-light text-muted flex-none w-10">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h3 className="text-2xl font-normal mb-3.5">{it.title}</h3>
            <p className="text-[15px] leading-[1.75] text-muted font-light max-w-[440px]">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Row of pill links; first one is the filled primary.
export function Ctas({ items }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((c, i) => (
        <Link
          key={c.to}
          to={c.to}
          className={`inline-block border border-champagne text-xs font-semibold tracking-[0.14em] uppercase px-9 py-3.5 rounded-full transition-colors ${
            i === 0 ? 'bg-champagne text-obsidian hover:bg-transparent hover:text-champagne' : 'text-champagne hover:bg-champagne hover:text-obsidian'
          }`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
