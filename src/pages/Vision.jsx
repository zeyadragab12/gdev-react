import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect } from 'react';
import { VISION, getAboutPage } from '../data/siteMap.js';

const PAGE = getAboutPage('vision-mission');

export default function Vision() {
  useEffect(() => {
    document.title = PAGE.seoTitle;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.content = PAGE.description;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav active="Vision" />

      <section className="px-5 md:px-16 pt-36 md:pt-[220px] pb-14 md:pb-[120px] bg-[radial-gradient(90%_70%_at_15%_10%,rgba(245,244,240,0.08)_0%,rgba(10,10,10,0)_55%)]">
        <div className="text-xs font-semibold tracking-[0.28em] uppercase text-muted mb-5">Vision, Mission &amp; Values</div>
        <h1 className="text-[32px] md:text-[60px] font-extralight leading-[1.18] max-w-[900px]">
          {PAGE.title}
        </h1>
      </section>

      <section className="px-5 md:px-16 pb-14 md:pb-[100px] -mt-4 max-w-[900px]">
        <p className="text-base md:text-lg font-light leading-[1.75] text-muted">{PAGE.intro}</p>
      </section>

      <section className="px-5 md:px-16 py-14 md:py-[100px] border-t border-b border-glass grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {[['Our vision', VISION.vision], ['Our mission', VISION.mission]].map(([label, text]) => (
          <div key={label}>
            <div className="text-xs font-semibold tracking-[0.28em] uppercase text-muted mb-5">{label}</div>
            <p className="text-[22px] md:text-[30px] font-extralight leading-[1.4] text-champagne">{text}</p>
          </div>
        ))}
      </section>

      <div
        className="h-[220px] md:h-[480px] bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%), url('/images/interior.jpg')" }}
      />

      <section className="px-5 md:px-16 py-16 md:py-[160px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-20">
        {VISION.values.map((v, i) => (
          <div key={v.title} className="flex gap-7">
            <div className="text-[15px] font-light text-muted flex-none w-10">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className="text-2xl font-normal mb-3.5">{v.title}</div>
              <p className="text-[15px] leading-[1.75] text-muted font-light max-w-[440px]">{v.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 md:px-16 py-14 md:py-[100px] border-t border-glass">
        <h2 className="text-2xl md:text-[34px] font-extralight mb-8">How we put our values into practice</h2>
        <ul className="max-w-[720px] flex flex-col gap-4">
          {VISION.practice.map((t) => (
            <li key={t} className="flex gap-4 text-base font-light leading-[1.7] text-muted">
              <span className="w-4 h-px bg-champagne/60 mt-3 flex-none" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 md:px-16 py-16 md:py-[100px] text-center border-t border-glass">
        <div className="text-2xl md:text-[32px] font-extralight mb-8">See our vision come to life.</div>
        <Link
          to="/community"
          className="inline-block border border-champagne text-champagne text-xs font-semibold tracking-[0.14em] uppercase px-9 py-3.5 rounded-full transition-colors hover:bg-champagne hover:text-obsidian"
        >
          Explore Our Projects
        </Link>
      </section>

      <Footer />
    </div>
  );
}
