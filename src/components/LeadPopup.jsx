import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectSelect from './ProjectSelect.jsx';

const DWELL_MS = 30000;
const SCROLL_RATIO = 0.6;
const STORAGE_KEY = 'gd-lead-popup';
const SNOOZE_MS = { submitted: 30 * 864e5 };

function isSnoozed() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return !!saved && Date.now() - saved.at < SNOOZE_MS[saved.state];
  } catch {
    return false;
  }
}

function remember(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, at: Date.now() }));
  } catch {
    // storage unavailable (private mode etc.) - the prompt just won't be remembered
  }
}

const fieldClass =
  'w-full bg-transparent border-0 border-b border-glass-strong text-white font-light text-[15px] py-3 outline-none placeholder:text-white/30 focus:border-champagne transition-colors';
const labelClass = 'block text-[10px] font-semibold tracking-[0.2em] uppercase text-muted mb-1.5';

// Lead capture, shown only once the visitor is engaged (scrolled ~60%, 30s on site, or
// moving to leave on desktop). It appears as a non-blocking corner card; clicking it opens
// the full modal. The card stays on screen and shakes every 4s to draw attention; it is only
// hidden for 30 days once the visitor has submitted the form (remembered in localStorage).
export default function LeadPopup({ ready }) {
  const { pathname } = useLocation();
  const [prompt, setPrompt] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef(null);
  const shown = useRef(false);

  useEffect(() => {
    if (!ready || shown.current || pathname === '/contact' || isSnoozed()) return;
    const show = () => {
      if (shown.current) return;
      shown.current = true;
      cleanup();
      setPrompt(true);
    };
    const onScroll = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight <= clientHeight * 1.3) return;
      if ((window.scrollY + clientHeight) / scrollHeight >= SCROLL_RATIO) show();
    };
    const onLeave = (e) => e.clientY <= 0 && show();
    const timer = setTimeout(show, DWELL_MS);
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onLeave);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) document.addEventListener('mouseleave', onLeave);
    return cleanup;
    // only the first page the visitor lands on arms the triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const openModal = () => {
    setPrompt(false);
    setOpen(true);
  };

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setPrompt(!submitted);
    }, 450);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 500);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
    };
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send `Object.fromEntries(new FormData(e.currentTarget))` to the CRM / email endpoint.
    setSubmitted(true);
    remember('submitted');
  }

  if (!open) {
    if (!prompt) return null;
    return (
      <div className="fixed z-[80] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[340px] animate-fade-up">
        <div className="lead-nudge relative bg-obsidian border border-glass-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <button
            type="button"
            onClick={openModal}
            className="block w-full text-left p-5 group"
          >
            <span className="block text-[10px] font-semibold tracking-[0.26em] uppercase text-muted mb-2">Private Consultation</span>
            <span className="block text-[17px] font-extralight uppercase tracking-[0.04em] leading-[1.25]">
              Find your <span className="text-champagne/60">next address</span>
            </span>
            <span className="mt-3 inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne border-b border-champagne/40 pb-1 group-hover:border-champagne transition-colors">
              Request a call back &rarr;
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${closing ? 'opacity-0' : 'animate-fade-in'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-title"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={close} />

      <div
        data-dropdown-bounds
        className={`relative w-full max-w-[980px] max-h-[92vh] overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] bg-obsidian border border-glass-strong shadow-[0_60px_120px_-20px_rgba(0,0,0,0.95)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          closing ? 'opacity-0 translate-y-6 scale-[0.98]' : 'lead-pop'
        }`}
      >
        {/* image side */}
        <div className="relative hidden md:block min-h-[560px] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center animate-kenburns" style={{ backgroundImage: "url('/images/seashell-villa-night.webp')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.85)_100%)]" />
          <div className="absolute inset-4 border border-champagne/20 pointer-events-none" />
          <div className="absolute left-10 right-10 bottom-10">
            <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-champagne/80 mb-4">G Developments</div>
            <div className="text-[26px] font-extralight uppercase leading-[1.2] tracking-[0.04em]">
              Living spaces crafted as <span className="text-champagne/60">timeless works of art.</span>
            </div>
          </div>
        </div>

        {/* form side */}
        <div className="relative p-7 md:p-12">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full border border-glass-strong flex items-center justify-center text-white/70 hover:text-black hover:bg-champagne hover:border-champagne transition-colors"
          >
            &times;
          </button>

          {submitted ? (
            <div className="min-h-[420px] flex flex-col justify-center animate-fade-up">
              <div className="w-14 h-14 rounded-full border border-champagne/60 flex items-center justify-center text-champagne text-xl mb-8">&#10003;</div>
              <h2 id="lead-title" className="text-[30px] md:text-[38px] font-extralight uppercase tracking-[0.04em] leading-[1.15]">
                Thank you.
              </h2>
              <p className="mt-5 text-[15px] text-muted font-light leading-[1.8] max-w-[360px]">
                A member of our sales team will contact you shortly to arrange your private consultation.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-10 self-start text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 hover:text-champagne transition-colors"
              >
                Continue Browsing &rarr;
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5">
                <span className="w-8 h-px bg-champagne/60" />
                <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-muted">Private Consultation</span>
              </div>
              <h2 id="lead-title" className="text-[26px] md:text-[34px] font-extralight uppercase tracking-[0.04em] leading-[1.15] pr-10">
                Find your <span className="text-champagne/60">next address</span>
              </h2>
              <p className="mt-4 text-sm text-muted font-light leading-[1.7] max-w-[400px]">
                Leave your details and our property advisors will get in touch with availability, prices and payment plans.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div>
                  <label htmlFor="lead-name" className={labelClass}>Full Name *</label>
                  <input ref={firstFieldRef} id="lead-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={fieldClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="lead-phone" className={labelClass}>Phone *</label>
                    <input id="lead-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+20 1xx xxx xxxx" pattern="[+0-9 ()-]{8,}" className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className={labelClass}>Email</label>
                    <input id="lead-email" name="email" type="email" autoComplete="email" placeholder="you@email.com" className={fieldClass} />
                  </div>
                </div>
                <ProjectSelect label="Project of Interest" labelClass={labelClass} />

                <button
                  type="submit"
                  className="group relative mt-2 inline-flex items-center justify-center gap-4 px-10 py-4 border border-champagne/70 overflow-hidden text-[11px] font-semibold tracking-[0.26em] uppercase text-champagne"
                >
                  <span className="absolute inset-0 bg-champagne origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
                  <span className="relative transition-colors duration-500 group-hover:text-black">Request a Call Back</span>
                  <span className="relative transition-all duration-500 group-hover:text-black group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </button>

                <div className="flex items-center justify-between gap-4 text-[11px] text-white/40 font-light">
                  <span>Or call our hotline <a href="tel:16738" className="text-champagne hover:underline">16738</a></span>
                  <button type="button" onClick={close} className="underline underline-offset-4 hover:text-white">
                    Maybe later
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
