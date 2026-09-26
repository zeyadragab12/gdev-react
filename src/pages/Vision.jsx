import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { FOUNDED_YEAR } from '../data/company.js';

const PILLARS = [
  {
    num: '01',
    title: 'Craft',
    text: 'Every detail is drawn, tested and refined before it is built — from the grain of a stone floor to the shadow line of a ceiling reveal.',
  },
  {
    num: '02',
    title: 'Materiality',
    text: 'Honest materials, left to age with dignity — stone, timber, concrete and glass, chosen for how they will look in twenty years, not twenty days.',
  },
  {
    num: '03',
    title: 'Human Scale',
    text: 'Grand gestures still measured against the human body — light, proportion and threshold designed around how a place is actually lived in.',
  },
  {
    num: '04',
    title: 'Legacy',
    text: `Since ${FOUNDED_YEAR}, each community is built to be inherited — not renovated into relevance, but designed to hold it from the start.`,
  },
];

export default function Vision() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active="Vision" />

      <section className="px-5 md:px-16 pt-36 md:pt-[220px] pb-14 md:pb-[120px] bg-[radial-gradient(90%_70%_at_15%_10%,rgba(245,244,240,0.08)_0%,rgba(10,10,10,0)_55%)]">
        <div className="text-xs font-semibold tracking-[0.28em] uppercase text-muted mb-5">Our Vision &amp; Values</div>
        <h1 className="text-[32px] md:text-[60px] font-extralight leading-[1.18] max-w-[900px]">
          We believe a building should outlast the trends that inspired it.
        </h1>
      </section>

      <section className="px-5 md:px-16 py-5 md:py-10 border-t border-b border-glass">
        <blockquote className="py-14 md:py-[100px] max-w-[980px] mx-auto text-center text-[22px] md:text-[38px] font-extralight leading-[1.4] text-champagne">
          &ldquo;Every material, every proportion, every silence in a room is a decision. We make ours so the building still feels inevitable in fifty years.&rdquo;
        </blockquote>
      </section>

      <div
        className="h-[220px] md:h-[480px] bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%), url('/images/interior.jpg')" }}
      />

      <section className="px-5 md:px-16 py-16 md:py-[160px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-20">
        {PILLARS.map((p) => (
          <div key={p.num} className="flex gap-7">
            <div className="text-[15px] font-light text-muted flex-none w-10">{p.num}</div>
            <div>
              <div className="text-2xl font-normal mb-3.5">{p.title}</div>
              <p className="text-[15px] leading-[1.75] text-muted font-light max-w-[440px]">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 md:px-16 py-16 md:py-[100px] text-center border-t border-glass">
        <div className="text-2xl md:text-[32px] font-extralight mb-8">See our vision come to life.</div>
        <Link
          to="/communities"
          className="inline-block border border-champagne text-champagne text-xs font-semibold tracking-[0.14em] uppercase px-9 py-3.5 rounded-full transition-colors hover:bg-champagne hover:text-obsidian"
        >
          Explore Our Projects
        </Link>
      </section>

      <Footer />
    </div>
  );
}
