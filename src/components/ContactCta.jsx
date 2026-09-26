import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal.js';

export default function ContactCta({ title = 'Are you interested in a property or have any other inquiries?', image = '/images/seashell-villa-night.webp' }) {
  const ref = useReveal();
  return (
    <section id="get-in-touch" ref={ref} className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            `linear-gradient(180deg, #0A0A0A 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.75) 100%), url('${image}')`,
        }}
      />
      <div className="absolute inset-4 md:inset-10 border border-champagne/15 pointer-events-none" />

      <div className="relative px-5 md:px-16 py-28 md:py-[200px] flex flex-col items-center text-center">
        <div className="reveal flex items-center gap-4 mb-8 md:mb-10">
          <span className="w-10 h-px bg-champagne/60" />
          <span className="text-xs font-semibold tracking-[0.28em] uppercase text-champagne/70">Contact</span>
          <span className="w-10 h-px bg-champagne/60" />
        </div>

        <h2 className="reveal [transition-delay:120ms] font-extralight text-[30px] md:text-[56px] leading-[1.15] tracking-tight max-w-[900px]">
          {title}
        </h2>

        <Link
          to="/contact"
          className="reveal [transition-delay:260ms] group relative mt-12 md:mt-16 inline-flex items-center gap-4 px-10 md:px-14 py-5 md:py-6 border border-champagne/60 overflow-hidden text-xs md:text-[13px] font-semibold tracking-[0.28em] uppercase text-champagne"
        >
          <span className="absolute inset-0 bg-champagne origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
          <span className="relative transition-colors duration-500 group-hover:text-black">Get in touch</span>
          <span className="relative transition-all duration-500 group-hover:text-black group-hover:translate-x-1" aria-hidden="true">
            &rarr;
          </span>
        </Link>

        <div className="reveal [transition-delay:380ms] mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-8 text-xs tracking-[0.18em] uppercase text-muted">
          <a href="tel:16738" className="hover:text-champagne transition-colors">Hotline 16738</a>
          <span className="hidden sm:block w-px h-3 bg-white/20" />
          <a href="mailto:info@thegdevelopments.com" className="normal-case tracking-[0.08em] hover:text-champagne transition-colors">
            info@thegdevelopments.com
          </a>
        </div>
      </div>
    </section>
  );
}
