import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import ProjectSelect from '../components/ProjectSelect.jsx';
import useReveal from '../hooks/useReveal.js';
import { DESTINATIONS, PROJECTS } from '../data/projects.js';

const labelClass = 'block text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase text-muted mb-2';

const ENQUIRY_TYPES = ['Buy a Residence', 'Investment', 'Book a Visit', 'Other'];

// Input with a champagne underline that draws in from the left on focus.
function Field({ id, label, as = 'input', ...props }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Tag
          id={id}
          className="peer w-full bg-transparent border-0 border-b border-glass-strong text-white font-light text-[15px] md:text-base py-3 outline-none placeholder:text-white/25 resize-none"
          {...props}
        />
        <span className="absolute left-0 bottom-0 h-px w-full bg-champagne origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100" />
      </div>
    </div>
  );
}

function ContactHero() {
  return (
    <section className="relative min-h-[78vh] md:min-h-[88vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center animate-kenburns" style={{ backgroundImage: "url('/images/hero-terrace.webp')" }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_40%,rgba(0,0,0,0.7)_75%,#000_100%)]" />

      <div className="relative w-full px-5 md:px-16 pb-14 md:pb-20 pt-36">
        <div className="hero-rise flex items-center gap-4 mb-6 md:mb-8">
          <span className="w-10 h-px bg-champagne/60" />
          <span className="text-xs font-semibold tracking-[0.28em] uppercase text-champagne/80">Contact &amp; Enquiries</span>
        </div>
        <h1 className="hero-rise [animation-delay:150ms] font-extralight uppercase text-[38px] sm:text-[56px] md:text-[92px] leading-[1.02] tracking-[0.02em] max-w-[1100px]">
          Tell us which address <span className="text-champagne/60">you&rsquo;re imagining.</span>
        </h1>

        <div className="hero-rise [animation-delay:300ms] mt-10 md:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href="tel:16738"
            className="group inline-flex items-center gap-4 pl-2 pr-7 py-2 rounded-full bg-black/40 backdrop-blur-md border border-glass-strong hover:border-champagne transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-champagne text-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
            </span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Hotline</span>
            <span className="text-lg font-light text-champagne">16738</span>
          </a>
          <a
            href="#enquire"
            className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full border border-glass-strong text-[11px] font-semibold tracking-[0.2em] uppercase text-white/80 hover:text-black hover:bg-champagne hover:border-champagne transition-colors"
          >
            Send an Enquiry <span aria-hidden="true">&darr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState(ENQUIRY_TYPES[0]);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send `Object.fromEntries(new FormData(e.currentTarget))` to the CRM / email endpoint.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-[520px] flex flex-col justify-center animate-fade-up">
        <div className="w-16 h-16 rounded-full border border-champagne/60 flex items-center justify-center text-champagne text-2xl mb-10">&#10003;</div>
        <h2 className="text-[34px] md:text-[48px] font-extralight uppercase tracking-[0.04em] leading-[1.1]">
          Thank you<span className="text-champagne/60">.</span>
        </h2>
        <p className="mt-6 text-[15px] md:text-[17px] text-muted font-light leading-[1.8] max-w-[440px]">
          Your enquiry has been received. A member of our team will be in touch within one business day.
        </p>
        <Link
          to="/communities"
          className="mt-12 self-start inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2.5 hover:text-champagne transition-colors"
        >
          Explore Our Communities &rarr;
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9">
      <fieldset>
        <legend className={labelClass}>I&rsquo;m interested in</legend>
        <input type="hidden" name="enquiryType" value={type} />
        <div className="mt-2 flex flex-wrap gap-2.5">
          {ENQUIRY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`px-5 py-2.5 rounded-full border text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 ${
                type === t ? 'bg-champagne border-champagne text-black' : 'border-glass-strong text-white/65 hover:border-champagne/50 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
        <Field id="fullname" name="fullname" label="Full Name *" type="text" placeholder="Your name" autoComplete="name" required />
        <Field id="phone" name="phone" label="Phone *" type="tel" placeholder="+20 1xx xxx xxxx" autoComplete="tel" pattern="[+0-9 ()-]{8,}" required />
      </div>

      <Field id="email" name="email" label="Email" type="email" placeholder="you@email.com" autoComplete="email" />

      <ProjectSelect name="community" label="Community of Interest" labelClass={labelClass} />

      <Field id="message" name="message" label="Message" as="textarea" rows={4} placeholder="Tell us a little about what you’re looking for" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 pt-2">
        <button
          type="submit"
          className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 border border-champagne/70 overflow-hidden text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-champagne"
        >
          <span className="absolute inset-0 bg-champagne origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
          <span className="relative transition-colors duration-500 group-hover:text-black">Send Enquiry</span>
          <span className="relative transition-all duration-500 group-hover:text-black group-hover:translate-x-1" aria-hidden="true">
            &rarr;
          </span>
        </button>
        <p className="text-[11px] text-white/35 font-light leading-[1.6] max-w-[280px]">
          Your details are used only to respond to your enquiry.
        </p>
      </div>
    </form>
  );
}

function ContactDetails() {
  const rows = [
    { label: 'Email', value: 'info@thegdevelopments.com', href: 'mailto:info@thegdevelopments.com' },
    { label: 'Head Office', value: '[HEAD OFFICE ADDRESS]' },
  ];
  return (
    <aside className="lg:sticky lg:top-28 flex flex-col">
      <div className="relative h-[240px] md:h-[300px] overflow-hidden mb-10">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] hover:scale-105" style={{ backgroundImage: "url('/images/interior.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />
        <div className="absolute inset-3 border border-champagne/20 pointer-events-none" />
        <div className="absolute left-7 bottom-6">
          <div className="text-[10px] tracking-[0.28em] uppercase text-white/60 mb-2">Hotline</div>
          <a href="tel:16738" className="text-[48px] md:text-[60px] font-extralight text-champagne leading-none hover:opacity-80 transition-opacity">
            16738
          </a>
        </div>
      </div>

      <div className="border-t border-glass">
        {rows.map((r) => (
          <div key={r.label} className="py-6 border-b border-glass">
            <div className={labelClass}>{r.label}</div>
            {r.href ? (
              <a href={r.href} className="text-base md:text-lg font-light text-white/85 hover:text-champagne transition-colors break-all">
                {r.value}
              </a>
            ) : (
              <div className="text-base md:text-lg font-light text-white/85">{r.value}</div>
            )}
          </div>
        ))}
        <div className="py-6">
          <div className={`${labelClass} mb-4`}>Follow Us</div>
          <SocialLinks />
        </div>
      </div>
    </aside>
  );
}

function Destinations() {
  const ref = useReveal();
  return (
    <section ref={ref} className="px-5 md:px-16 py-20 md:py-[140px] border-t border-glass bg-obsidian">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
        <div>
          <div className="reveal flex items-center gap-4 mb-6">
            <span className="w-10 h-px bg-champagne/60" />
            <span className="text-xs font-semibold tracking-[0.28em] uppercase text-muted">Our Destinations</span>
          </div>
          <h2 className="reveal [transition-delay:120ms] text-[28px] md:text-[48px] font-extralight uppercase tracking-[0.04em] leading-[1.1]">
            Find us <span className="text-champagne/55">across Egypt</span>
          </h2>
        </div>
        <Link to="/#map" className="reveal [transition-delay:200ms] self-start md:self-auto text-xs font-semibold tracking-[0.14em] uppercase border-b border-glass-strong pb-2 hover:text-champagne transition-colors">
          View on Map &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {DESTINATIONS.map((d, i) => {
          const projects = PROJECTS.filter((p) => p.destination === d.id);
          return (
            <Link
              key={d.id}
              to="/communities"
              className="reveal group relative h-[300px] md:h-[380px] overflow-hidden"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                style={{ backgroundImage: `url('${projects[0].image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <div className="absolute inset-3 border border-champagne/15 group-hover:border-champagne/45 transition-colors duration-500" />
              <div className="relative h-full flex flex-col justify-between p-7">
                <span className="text-[11px] tracking-[0.2em] text-champagne/70 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-white/50 mb-2">{d.region}</div>
                  <div className="text-[24px] md:text-[28px] font-extralight uppercase tracking-[0.05em] text-champagne">{d.name}</div>
                  <div className="mt-3 text-xs font-light text-white/60">{projects.map((p) => p.name).join(' · ')}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Contact() {
  const ref = useReveal();
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active="Contact" />
      <ContactHero />

      <section id="enquire" ref={ref} className="scroll-mt-20 px-5 md:px-16 py-20 md:py-[140px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-16 lg:gap-24 items-start">
          <div className="reveal relative border border-glass bg-obsidian/60 p-7 md:p-14">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-champagne/60" />
              <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-muted">Private Enquiry</span>
            </div>
            <h2 className="text-[26px] md:text-[38px] font-extralight uppercase tracking-[0.04em] leading-[1.15] mb-10 md:mb-12">
              Let&rsquo;s begin <span className="text-champagne/60">the conversation</span>
            </h2>
            <EnquiryForm />
          </div>

          <div className="reveal [transition-delay:200ms]">
            <ContactDetails />
          </div>
        </div>
      </section>

      <Destinations />
      <Footer />
    </div>
  );
}
