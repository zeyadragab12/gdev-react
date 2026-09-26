// Thin line icons for project amenities, keyed by the `icon` field in data/projects.js.
const PATHS = {
  beach: 'M3 20h18M5 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0M12 4v12M12 4c-4 0-7 2.5-7 5h14c0-2.5-3-5-7-5z',
  lagoon: 'M3 9c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M3 14c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M3 19c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0',
  clubhouse: 'M3 20h18M5 20V10l7-5 7 5v10M10 20v-5h4v5M8.5 12h1M14.5 12h1',
  pool: 'M3 18c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 8h8M8 12h8',
  dining: 'M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M17 21V3c-2 1-3 3.5-3 7h3',
  spa: 'M12 20c-4-2-7-5-7-9 2.5 0 5 1.5 7 4 2-2.5 4.5-4 7-4 0 4-3 7-7 9zM12 15c-1.5-2-2-4.5-1-8 .5-1 1.5-2 1-3 1 1 3 3.5 1 8-.3.8-.6 1.8-1 3z',
  kids: 'M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 21l1.5-7L7 11l5-1 5 1-2.5 3L16 21M9.5 14h5',
  security: 'M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4',
  park: 'M12 21v-6M12 15c-3.5 0-6-2.5-6-5.5S8.5 3 12 3s6 3 6 6.5-2.5 5.5-6 5.5zM5 21h14',
  gym: 'M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12',
  retail: 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2',
  parking: 'M6 21V3h6.5a4.5 4.5 0 0 1 0 9H6',
};

export default function AmenityIcon({ name, className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.clubhouse} />
    </svg>
  );
}
