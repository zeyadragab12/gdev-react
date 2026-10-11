import { useEffect, useState } from 'react';

const TEXT = 'G Developments';

// Timeline (ms): curtain rises, letters reveal, hold 1s, curtain exits upward.
const RISE = 900;
const LETTER_STAGGER = 45;
const LETTER_DURATION = 800;
const HOLD = 1600;
const EXIT = 900;
const LAYER_STAGGER = 120; // on entry: white leads, then silver, then black covers
const COVERED = RISE + LAYER_STAGGER * 2; // black fully in place

const REVEAL_DONE = COVERED + LETTER_STAGGER * (TEXT.length - 1) + LETTER_DURATION;

export default function Intro({ onDone }) {
  // plays on every page load
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (phase === 'done') return;
    document.body.style.overflow = 'hidden';
    const exitTimer = setTimeout(() => setPhase('exit'), REVEAL_DONE + HOLD);
    const doneTimer = setTimeout(() => setPhase('done'), REVEAL_DONE + HOLD + EXIT);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = '';
      onDone?.();
    }
  }, [phase]);

  if (phase === 'done') return null;

  const exitClass = phase === 'exit' ? 'intro-curtain--exit' : '';
  const vars = { '--rise': `${RISE}ms`, '--exit': `${EXIT}ms` };

  return (
    <>
      {/* entry: white rises first, silver follows, black last; exit: all leave together */}
      <div
        aria-hidden="true"
        className={`intro-curtain fixed inset-0 z-[98] bg-white ${exitClass}`}
        style={{ ...vars, '--delay': '0ms' }}
      />
      <div
        aria-hidden="true"
        className={`intro-curtain fixed inset-0 z-[99] bg-[#c0c0c4] ${exitClass}`}
        style={{ ...vars, '--delay': `${LAYER_STAGGER}ms` }}
      />
    <div
      aria-hidden="true"
      className={`intro-curtain fixed inset-0 z-[100] flex items-center justify-center bg-black ${exitClass}`}
      style={{ ...vars, '--delay': `${LAYER_STAGGER * 2}ms` }}
    >
      <div className={`intro-content text-center ${phase === 'exit' ? 'intro-content--exit' : ''}`}>
        <h1 className="flex justify-center overflow-hidden text-4xl font-bold tracking-[0.12em] text-champagne sm:text-6xl md:text-7xl">
          {TEXT.split('').map((char, i) => (
            <span
              key={i}
              className="intro-letter inline-block"
              style={{
                animationDelay: `${COVERED + i * LETTER_STAGGER}ms`,
                animationDuration: `${LETTER_DURATION}ms`,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>
        <div
          className="intro-line mx-auto mt-6 h-px w-40 bg-champagne/60"
          style={{ animationDelay: `${COVERED + 300}ms` }}
        />
      </div>
    </div>
    </>
  );
}
