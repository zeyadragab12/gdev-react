import { useEffect, useState } from 'react';

const TEXT = 'G Developments';

// Timeline (ms): curtain rises, letters reveal, hold 1s, curtain exits upward.
const RISE = 900;
const LETTER_STAGGER = 45;
const LETTER_DURATION = 800;
const HOLD = 1600;
const EXIT = 900;
const HEARTBEATS = 2; // "lub-dub" beats played during the hold

const REVEAL_DONE = RISE + LETTER_STAGGER * (TEXT.length - 1) + LETTER_DURATION;

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

  return (
    <div
      aria-hidden="true"
      className={`intro-curtain fixed inset-0 z-[100] flex items-center justify-center bg-black ${
        phase === 'exit' ? 'intro-curtain--exit' : ''
      }`}
      style={{ '--rise': `${RISE}ms`, '--exit': `${EXIT}ms` }}
    >
      <div className={`intro-content text-center ${phase === 'exit' ? 'intro-content--exit' : ''}`}>
        <div
          className="intro-heartbeat"
          style={{
            animationDelay: `${REVEAL_DONE}ms`,
            animationDuration: `${HOLD / HEARTBEATS}ms`,
            animationIterationCount: HEARTBEATS,
          }}
        >
        <h1 className="flex justify-center overflow-hidden text-4xl font-bold tracking-[0.12em] text-champagne sm:text-6xl md:text-7xl">
          {TEXT.split('').map((char, i) => (
            <span
              key={i}
              className="intro-letter inline-block"
              style={{
                animationDelay: `${RISE + i * LETTER_STAGGER}ms`,
                animationDuration: `${LETTER_DURATION}ms`,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>
        </div>
        <div
          className="intro-line mx-auto mt-6 h-px w-40 bg-champagne/60"
          style={{ animationDelay: `${RISE + 300}ms` }}
        />
      </div>
    </div>
  );
}
