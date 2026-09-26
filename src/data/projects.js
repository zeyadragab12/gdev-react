// Single source of truth for every project page, card, map pin and footer link.
//
// PLACEHOLDER CONTENT: locations, taglines, copy, amenities, unit types and
// master-plan zones below are drafts written for layout purposes. Replace them
// with approved project content (and real renders / master plans) before launch.
// No figures (areas, prices, unit counts) are included on purpose.

const IMG = {
  terrace: '/images/hero-terrace.webp',
  canal: '/images/gcairo-canal.webp',
  interior: '/images/interior.jpg',
  playa: '/images/seashell-playa.webp',
  villaDay: '/images/seashell-villa-day.webp',
  villaNight: '/images/seashell-villa-night.webp',
};

const CAPTIONS = {
  [IMG.terrace]: 'Terrace Living',
  [IMG.canal]: 'Waterfront',
  [IMG.interior]: 'Interiors',
  [IMG.playa]: 'Lagoon Front',
  [IMG.villaDay]: 'Villa Exterior',
  [IMG.villaNight]: 'Evening View',
};

const gallery = (...images) => images.map((src) => ({ src, caption: CAPTIONS[src] }));

const COASTAL_AMENITIES = [
  { icon: 'beach', label: 'Private Beach' },
  { icon: 'lagoon', label: 'Crystal Lagoons' },
  { icon: 'clubhouse', label: 'Beach Clubhouse' },
  { icon: 'pool', label: 'Swimming Pools' },
  { icon: 'dining', label: 'Beachfront Dining' },
  { icon: 'spa', label: 'Spa & Wellness' },
  { icon: 'kids', label: "Kids' Club" },
  { icon: 'security', label: '24/7 Security' },
];

const URBAN_AMENITIES = [
  { icon: 'park', label: 'Landscaped Parks' },
  { icon: 'clubhouse', label: 'Residents’ Clubhouse' },
  { icon: 'gym', label: 'Fitness Centre' },
  { icon: 'retail', label: 'Retail Promenade' },
  { icon: 'dining', label: 'Cafés & Dining' },
  { icon: 'kids', label: 'Kids’ Play Areas' },
  { icon: 'parking', label: 'Underground Parking' },
  { icon: 'security', label: '24/7 Security' },
];

const COASTAL_UNITS = (images) => [
  { type: 'Chalets', image: images[0], body: 'Light-filled chalets arranged around lagoons and gardens, designed for easy seasonal living.', highlights: ['Lagoon or garden views', 'Private terraces', 'Open-plan living'] },
  { type: 'Twin Houses', image: images[1], body: 'Paired residences offering the privacy of a villa with a shared architectural rhythm.', highlights: ['Private garden', 'Roof terrace', 'Dedicated parking'] },
  { type: 'Standalone Villas', image: images[2], body: 'Generous standalone villas set on the most private plots of the masterplan.', highlights: ['Private pool option', 'Panoramic views', 'Staff quarters'] },
  { type: 'Penthouses', image: images[3], body: 'Top-floor residences with expansive terraces looking out toward the sea.', highlights: ['Sea-facing terraces', 'Double-height living', 'Private roof'] },
];

const URBAN_UNITS = (images) => [
  { type: 'Apartments', image: images[0], body: 'Well-proportioned apartments overlooking landscaped courtyards and water features.', highlights: ['Courtyard views', 'Generous balconies', 'Smart-home ready'] },
  { type: 'Duplexes', image: images[1], body: 'Two-level homes that separate living and private quarters with a sculptural stair.', highlights: ['Private garden or roof', 'Double-height living', 'Guest suite'] },
  { type: 'Townhouses', image: images[2], body: 'Townhouses with their own entrances, bringing villa living into the city.', highlights: ['Private garden', 'Roof terrace', 'Dedicated parking'] },
  { type: 'Penthouses', image: images[3], body: 'Crowning residences with wraparound terraces and skyline views.', highlights: ['Wraparound terraces', 'Skyline views', 'Private lift lobby'] },
];

// coords are [lon, lat]; label = which side of the map pin the name sits
export const DESTINATIONS = [
  { id: 'ras-el-hekma', name: 'Ras El Hekma', region: 'Mediterranean Coast', coords: [27.9, 31.12], label: 'top' },
  { id: 'north-coast', name: 'North Coast', region: 'Mediterranean Coast', coords: [28.7, 30.93], label: 'bottom' },
  { id: 'cairo', name: 'Cairo', region: 'Capital Region', coords: [31.45, 30.03], label: 'left' },
  { id: 'sokhna', name: 'Ain Sokhna', region: 'Red Sea Coast', coords: [32.35, 29.6], label: 'right' },
];

export const PROJECTS = [
  {
    key: 'newkairo',
    name: 'NewKairo',
    destination: 'cairo',
    location: 'New Cairo',
    category: 'Urban Residences',
    image: IMG.canal,
    tagline: 'A new chapter for urban living in East Cairo.',
    overview: [
      'NewKairo brings resort-grade calm into the heart of New Cairo — a residential community where water, landscape and architecture are composed as one.',
      'Low-rise buildings frame shaded courtyards and canal walks, keeping the city close while leaving its noise at the gate.',
    ],
    lifestyle: [
      { title: 'A calm arrival', body: 'Tree-lined boulevards and a secure gateway set the tone the moment you turn in from the city.', image: IMG.canal },
      { title: 'Everything within reach', body: 'Cafés, daily retail and a residents’ clubhouse sit a short walk from every front door.', image: IMG.terrace },
      { title: 'Evenings at home', body: 'Interiors are planned around light and proportion, opening onto balconies above the gardens.', image: IMG.interior },
    ],
    amenities: URBAN_AMENITIES,
    units: URBAN_UNITS([IMG.interior, IMG.terrace, IMG.villaDay, IMG.canal]),
    zones: ['Residential clusters', 'Central park & canal', 'Clubhouse', 'Retail promenade', 'Sports courts', 'Main gate'],
    gallery: gallery(IMG.canal, IMG.interior, IMG.terrace, IMG.villaNight, IMG.villaDay, IMG.playa),
  },
  {
    key: 'seashell-rh',
    name: 'Seashell Ras El Hekma',
    destination: 'ras-el-hekma',
    location: 'Ras El Hekma',
    category: 'Coastal Resort',
    image: IMG.villaNight,
    tagline: 'The Seashell signature, on Egypt’s most coveted bay.',
    overview: [
      'Seashell Ras El Hekma carries the Seashell philosophy to the white sands of Ras El Hekma — a coastal resort planned around the water from the very first line.',
      'Terraced villas and chalets step down toward the sea, so nearly every home opens onto an uninterrupted Mediterranean horizon.',
    ],
    lifestyle: [
      { title: 'Mornings by the water', body: 'Wake to turquoise water and walk barefoot from your terrace to the private beach.', image: IMG.villaDay },
      { title: 'Afternoons at the club', body: 'The beach clubhouse gathers pools, dining and lounges under one elegant roof.', image: IMG.playa },
      { title: 'Evenings under the stars', body: 'As the sun sets, lit terraces and warm stone turn the resort into a quiet village by the sea.', image: IMG.villaNight },
    ],
    amenities: COASTAL_AMENITIES,
    units: COASTAL_UNITS([IMG.villaDay, IMG.terrace, IMG.villaNight, IMG.interior]),
    zones: ['Beachfront villas', 'Lagoon chalets', 'Beach clubhouse', 'Central lagoon', 'Wellness & spa', 'Main gate'],
    gallery: gallery(IMG.villaNight, IMG.villaDay, IMG.interior, IMG.playa, IMG.terrace, IMG.canal),
  },
  {
    key: 'playa-rh',
    name: 'Playa Ras El Hekma',
    destination: 'ras-el-hekma',
    location: 'Ras El Hekma',
    category: 'Lagoon Living',
    image: IMG.playa,
    tagline: 'Lagoon-front living on the shores of Ras El Hekma.',
    overview: [
      'Playa Ras El Hekma is a lagoon-front community where swimmable water runs between the homes, bringing the beach to every doorstep.',
      'Contemporary architecture in soft, sun-washed tones sits lightly in the landscape, letting the water and sky take centre stage.',
    ],
    lifestyle: [
      { title: 'Step into the lagoon', body: 'Ground-floor homes open directly onto crystal lagoons for a swim before breakfast.', image: IMG.playa },
      { title: 'Days made for family', body: 'Kids’ club, shallow lagoon edges and shaded lawns make every day an easy one.', image: IMG.terrace },
      { title: 'Nights by the shore', body: 'Beachfront dining and lantern-lit walkways carry the day long into the evening.', image: IMG.villaNight },
    ],
    amenities: COASTAL_AMENITIES,
    units: COASTAL_UNITS([IMG.playa, IMG.villaDay, IMG.villaNight, IMG.terrace]),
    zones: ['Lagoon chalets', 'Twin houses', 'Crystal lagoon', 'Beach club', 'Retail village', 'Main gate'],
    gallery: gallery(IMG.playa, IMG.terrace, IMG.villaDay, IMG.interior, IMG.villaNight, IMG.canal),
  },
  {
    key: 'playa',
    name: 'Playa',
    destination: 'north-coast',
    location: 'North Coast',
    category: 'Beachfront Living',
    image: IMG.terrace,
    tagline: 'Beachfront days, the way summer was meant to be.',
    overview: [
      'Playa is a beachfront community on the North Coast designed around long, slow summer days — sand, sea and sunlight at every turn.',
      'Homes are arranged in gentle crescents facing the water, with pools and gardens threaded between them.',
    ],
    lifestyle: [
      { title: 'Life on the sand', body: 'A private beach stretches along the full frontage, with loungers, cabanas and beach service.', image: IMG.terrace },
      { title: 'Pools & gardens', body: 'Landscaped pools weave between the buildings for a swim only steps from home.', image: IMG.playa },
      { title: 'Golden hour', body: 'Terraces face west, framing the sunset over the Mediterranean each evening.', image: IMG.villaNight },
    ],
    amenities: COASTAL_AMENITIES,
    units: COASTAL_UNITS([IMG.terrace, IMG.playa, IMG.villaDay, IMG.interior]),
    zones: ['Beachfront chalets', 'Garden villas', 'Pool gardens', 'Beach club', 'Sports area', 'Main gate'],
    gallery: gallery(IMG.terrace, IMG.playa, IMG.villaNight, IMG.interior, IMG.villaDay, IMG.canal),
  },
  {
    key: 'seashell',
    name: 'Seashell',
    destination: 'north-coast',
    location: 'North Coast',
    category: 'Chalets & Villas',
    image: IMG.villaDay,
    tagline: 'The original coastal retreat by G Developments.',
    overview: [
      'A coastal resort community set along the North Coast, where chalets and villas sit within landscaped terrain framed by the Mediterranean.',
      'Seashell was conceived as a full seasonal retreat rather than a single building type — beachfront promenades, shaded courtyards and a central clubhouse anchor a layout designed to slow visitors down the moment they arrive.',
    ],
    lifestyle: [
      { title: 'Beachfront promenades', body: 'A continuous promenade links every neighbourhood to the sea and the beach club.', image: IMG.villaDay },
      { title: 'Shaded courtyards', body: 'Courtyards and pergolas create cool, sheltered gathering places through the summer.', image: IMG.terrace },
      { title: 'Seaside evenings', body: 'The clubhouse and terraces come alive at dusk with dining and gentle lighting.', image: IMG.villaNight },
    ],
    amenities: COASTAL_AMENITIES,
    units: COASTAL_UNITS([IMG.villaDay, IMG.villaNight, IMG.terrace, IMG.interior]),
    zones: ['Beachfront villas', 'Chalet clusters', 'Central clubhouse', 'Beach promenade', 'Pools', 'Main gate'],
    gallery: gallery(IMG.villaDay, IMG.villaNight, IMG.interior, IMG.terrace, IMG.playa, IMG.canal),
  },
  {
    key: 'cityview',
    name: 'City View',
    destination: 'cairo',
    location: 'Cairo',
    category: 'Urban Living',
    image: IMG.interior,
    tagline: 'Elevated residences with the city at your feet.',
    overview: [
      'City View is an urban residential address designed for those who want the energy of Cairo with the privacy of a gated community.',
      'Refined interiors, generous glazing and elevated terraces frame sweeping views across the city.',
    ],
    lifestyle: [
      { title: 'Views that stay with you', body: 'Floor-to-ceiling glazing brings the skyline into every living room.', image: IMG.interior },
      { title: 'Connected living', body: 'Close to the city’s main arteries, schools and business districts.', image: IMG.canal },
      { title: 'Private terraces', body: 'Outdoor rooms extend each home for quiet mornings and evenings above the city.', image: IMG.terrace },
    ],
    amenities: URBAN_AMENITIES,
    units: URBAN_UNITS([IMG.interior, IMG.canal, IMG.terrace, IMG.villaNight]),
    zones: ['Residential towers', 'Landscaped podium', 'Clubhouse', 'Retail frontage', 'Kids’ area', 'Main gate'],
    gallery: gallery(IMG.interior, IMG.canal, IMG.terrace, IMG.villaNight, IMG.villaDay, IMG.playa),
  },
  {
    key: 'ainbay',
    name: 'Ain Bay',
    destination: 'sokhna',
    location: 'Ain Sokhna',
    category: 'Red Sea Retreat',
    image: IMG.villaNight,
    tagline: 'A Red Sea retreat, an hour from the city.',
    overview: [
      'Ain Bay is a year-round retreat on the Red Sea coast, where mountains meet clear water and weekends begin within easy reach of Cairo.',
      'Terraced homes follow the natural slope toward the bay, giving each residence its own view of the sea.',
    ],
    lifestyle: [
      { title: 'Year-round sunshine', body: 'Mild winters make Ain Bay a retreat for every season, not only the summer.', image: IMG.villaDay },
      { title: 'Between mountain & sea', body: 'Homes are set on the slope so the Galala mountains rise behind and the bay opens ahead.', image: IMG.terrace },
      { title: 'Weekend evenings', body: 'Seaside dining and quiet terraces make every weekend feel like a longer escape.', image: IMG.villaNight },
    ],
    amenities: COASTAL_AMENITIES,
    units: COASTAL_UNITS([IMG.villaNight, IMG.villaDay, IMG.playa, IMG.interior]),
    zones: ['Terraced chalets', 'Bay-view villas', 'Beach club', 'Infinity pools', 'Marina walk', 'Main gate'],
    gallery: gallery(IMG.villaNight, IMG.terrace, IMG.villaDay, IMG.playa, IMG.interior, IMG.canal),
  },
];

export const projectPath = (key) => `/communities/${key}`;
export const getProject = (key) => PROJECTS.find((p) => p.key === key);
