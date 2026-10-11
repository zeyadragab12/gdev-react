// Single source of truth for every project page, card, map pin and footer link.
//
// PLACEHOLDER CONTENT: locations, taglines, copy, amenities, unit types and
// master-plan zones below are drafts written for layout purposes. Replace them
// with approved project content (and real renders / master plans) before launch.
// No figures (areas, prices, unit counts) are included on purpose, except Playa
// Ras El Hekma, which uses the real areas from its brochure (approximate, subject
// to change per the brochure disclaimer).

import playaMasterPlan from './playaMasterPlan.js';
import seashellRhMasterPlan from './seashellRhMasterPlan.js';
import seashellMasterPlan from './seashellMasterPlan.js';
import newKairoMasterPlan from './newKairoMasterPlan.js';
import newGizaMasterPlan from './newGizaMasterPlan.js';

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

// Playa Ras El Hekma: renders and plans extracted from the project brochures
// (see /public/images/playa-rh). File names carry the brochure page number.
const RH = (name) => `/images/playa-rh/${name}.jpg`;
const RH_IMG = {
  hero: RH('rh-62'),
  poolTerrace: RH('rh-11'),
  mansion: RH('rh-13'),
  livingPool: RH('rh-15'),
  seaViewVilla: RH('rh-29'),
  seaViewEvening: RH('rh-28'),
  beachHouse: RH('rh-35'),
  beachHouseTerrace: RH('rh-38'),
  twinHouse: RH('rh-49'),
  townHome: RH('rh-57'),
  horizon: RH('rh-63'),
  horizonPool: RH('rh-64'),
  grandBeachHouse: RH('rh-73'),
  grandBeachHouseFront: RH('rh-72'),
  lagoonBlocks: RH('rh-u-blocks'),
  sunset: RH('rh-cabanas'),
  masterplan: RH('rh-masterplan'),
};
Object.assign(CAPTIONS, {
  [RH_IMG.poolTerrace]: 'Pool Terrace',
  [RH_IMG.livingPool]: 'Indoor–Outdoor Living',
  [RH_IMG.seaViewEvening]: 'Sea View Villa',
  [RH_IMG.beachHouseTerrace]: 'Beach House Terrace',
  [RH_IMG.horizonPool]: 'Horizon Beach House',
  [RH_IMG.grandBeachHouseFront]: 'Grand Beach House',
});

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
  { id: 'ras-el-hekma', name: 'Ras El Hekma', region: 'Mediterranean Coast', coords: [28.02, 31.07], label: 'top' },
  { id: 'north-coast', name: 'North Coast', region: 'Mediterranean Coast', coords: [28.64, 31.0], label: 'bottom' },
  { id: 'cairo', name: 'Cairo', region: 'Capital Region', coords: [31.45, 30.03], label: 'left' },
  { id: 'sokhna', name: 'Ain Sokhna', region: 'Red Sea Coast', coords: [32.377, 29.731], label: 'right' },
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
    category: 'Beachfront Living',
    image: RH_IMG.hero,
    tagline: 'A captivating beachfront haven on the shores of Ras El Hekma.',
    overview: [
      'Playa Ras El Hekma is a captivating beachfront haven that embodies luxury living at its finest — an exclusive community for those with a discerning taste, an appreciation for natural beauty and a desire for a truly exceptional lifestyle.',
      'A harmonious blend of nature and elegant architecture, with convenient pathways through scenic greenery and sea-view homes. The main spine brings a vibrant culture of movement, a sports complex inspires wellbeing, and a lively downtown and a 5-star hotel complete the community.',
    ],
    lifestyle: [
      { title: 'Modern Mediterranean architecture', body: 'Functional, avant-garde architecture in cool whites and earthy tones, seeking serenity, tranquillity and peace.', image: RH_IMG.poolTerrace },
      { title: 'Indoor and outdoor as one', body: 'Openings stack away completely so living rooms, terraces and pools become one big space, with glass to capture the view and the sea breeze.', image: RH_IMG.livingPool },
      { title: 'A spine for every pace', body: 'Cycling, skateboarding and jogging along the main spine, a sports complex for wellbeing and a downtown for friends and families.', image: RH_IMG.sunset },
    ],
    amenities: [
      { icon: 'beach', label: 'Beachfront Setting' },
      { icon: 'lagoon', label: 'Beachfront Lagoon Blocks' },
      { icon: 'spa', label: '5-Star Hotel' },
      { icon: 'gym', label: 'Sports Complex' },
      { icon: 'retail', label: 'Lively Downtown' },
      { icon: 'park', label: 'Main Spine & Greenery' },
    ],
    units: [
      { type: 'Beachfront Mansions', image: RH_IMG.mansion, body: 'Two mansion plans on the beachfront: a skylit ground floor of reception, dining and generous bedroom suites, with a basement living level below.', highlights: ['701 m² and 633 m² total', 'Basement living level', 'Skylit reception'] },
      { type: 'Sea View One-Storey Villas', image: RH_IMG.seaViewVilla, body: 'Single-level five-bedroom villas in Grand and Deluxe plans, with a large reception and dining room, a big terrace and an optional open or closed kitchen.', highlights: ['5 bedrooms', '330 m² net', 'Optional open or closed kitchen'] },
      { type: 'Beach House Villas', image: RH_IMG.beachHouse, body: 'Two-storey villas with reception and dining on the ground floor, bedrooms upstairs and private terraces, in 5-bedroom Grand and 4-bedroom Deluxe plans.', highlights: ['4 and 5 bedrooms', '264–304 m² net', 'Private terraces'] },
      { type: 'Twin Houses', image: RH_IMG.twinHouse, body: 'Paired four-bedroom homes in Grand and Deluxe plans, with reception and dining downstairs and the bedrooms above.', highlights: ['4 bedrooms', '205–208 m² net', 'Maid’s and driver’s rooms'] },
      { type: 'Town Homes', image: RH_IMG.townHome, body: 'Three-bedroom town homes with a ground-floor reception and kitchen, and the bedrooms and dressing rooms upstairs.', highlights: ['3 bedrooms', '186 m² net', 'Maid’s and driver’s rooms'] },
      { type: 'Horizon Beach Houses', image: RH_IMG.horizon, body: 'Contemporary beach houses in three- and four-bedroom plans, with a basement level and generous roof terraces.', highlights: ['3 and 4 bedrooms', '191–271 m² net', 'Roof terrace and basement'] },
      { type: 'Grand Beach Houses', image: RH_IMG.grandBeachHouse, body: 'Five Grand Beach House plans, from three-bedroom homes with roof access to four-bedroom homes with a roof room and terraces.', highlights: ['3 and 4 bedrooms', '176–277 m² net', 'Roof terraces'] },
      { type: 'G Cabanas & G-Lofts', image: RH_IMG.lagoonBlocks, body: 'Compact cabanas and corner cabanas and two- and three-bedroom lofts, set around the beachfront lagoons alongside four- to six-bedroom villas.', highlights: ['Cabanas from 35 m²', 'Lofts 122–194.5 m² net', 'Lagoon-front blocks'] },
    ],
    zones: ['Beachfront lagoon blocks', 'Main spine', 'Villa neighbourhoods', 'Central lagoons', 'Downtown & sports', 'Hotel'],
    gallery: gallery(RH_IMG.poolTerrace, RH_IMG.livingPool, RH_IMG.seaViewEvening, RH_IMG.beachHouseTerrace, RH_IMG.horizonPool, RH_IMG.grandBeachHouseFront),
    // Real master plan (colored, 17-04-2024), sea at the top. The brochures do not define
    // phases, so the six sections below are a vertical division of the plan from the
    // beach to the highway. UNIT ALLOCATION PER SECTION IS INDICATIVE: only the
    // beachfront blocks are documented (G Cabanas & G-Lofts brochure); confirm the rest.
    // `region` is [x, y, w, h] in image pixels.
    plan: {
      image: RH_IMG.masterplan,
      thumb: '/masterplans/thumbs/playa-rh.webp',
      width: 1409,
      height: 6711,
      alt: 'Master plan of Playa Ras El Hekma',
      caption: 'Playa Ras El Hekma · master plan',
      note: 'Indicative layout and unit allocation. All materials, dimensions and drawings are approximate and subject to change without notice.',
      phases: [
        {
          id: 'beach', label: 'Phase 1', title: 'Beach & Landscaped Park', status: 'Phase 1 · The shoreline', region: [0, 0, 1409, 640],
          body: 'The community opens onto the sea: a wide sandy beach backed by a landscaped park of winding paths, planting and open lawns.',
          highlights: ['Private beach', 'Landscaped beach park', 'Walking paths'],
          units: [],
        },
        {
          id: 'beachfront', label: 'Phase 2', title: 'Beachfront Lagoon Blocks', status: 'Phase 2 · Beachfront', region: [0, 620, 1409, 1060],
          body: 'Lagoon-centred blocks stepping back from the beach, each pairing a long lagoon with rows of cabanas, lofts and villas, with the beachfront mansions closest to the water.',
          highlights: ['Lagoon blocks', 'Cabanas & lofts', 'Beachfront mansions'],
          units: [
            { name: 'Beachfront Mansions', area: '633–701 m² total' },
            { name: 'Villas (4BR, 5BR, 6BR)', beds: 'Corner & middle plots' },
            { name: 'G-Lofts (3BR)', beds: '3 BR', area: '194.5 m² net' },
            { name: 'G-Lofts (2BR)', beds: '2 BR', area: '122 m² net' },
            { name: 'Corner Cabanas', area: '43 m² net' },
            { name: 'Cabanas', area: '35 m² net' },
          ],
        },
        {
          id: 'north', label: 'Phase 3', title: 'Northern Villa Quarter', status: 'Phase 3 · North', region: [0, 1660, 1409, 1250],
          body: 'Ordered streets of villas and twin houses on either side of a central green spine, a calm residential neighbourhood a short walk from the beach.',
          highlights: ['Villa neighbourhoods', 'Central green spine', 'Tree-lined streets'],
          units: [
            { name: 'Twin Houses', beds: '4 BR', area: '205–208 m² net' },
            { name: 'Beach House Villas', beds: '4–5 BR', area: '264–304 m² net' },
            { name: 'Town Homes', beds: '3 BR', area: '186 m² net' },
            { name: 'Sea View One-Storey Villas', beds: '5 BR', area: '330 m² net' },
          ],
        },
        {
          id: 'lagoon-north', label: 'Phase 4', title: 'Lagoon Quarter · North', status: 'Phase 4 · Central north', region: [0, 2890, 1409, 1240],
          body: 'Curving streets follow a ribbon of lagoons through the heart of the community, so most homes sit beside water and green.',
          highlights: ['Winding lagoons', 'Waterside villas', 'Main spine access'],
          units: [
            { name: 'Horizon Beach Houses', beds: '3–4 BR', area: '191–271 m² net' },
            { name: 'Grand Beach Houses', beds: '3–4 BR', area: '176–277 m² net' },
            { name: 'Beach House Villas', beds: '4–5 BR', area: '264–304 m² net' },
            { name: 'Twin Houses', beds: '4 BR', area: '205–208 m² net' },
          ],
        },
        {
          id: 'lagoon-south', label: 'Phase 5', title: 'Lagoon Quarter · South', status: 'Phase 5 · Central south', region: [0, 4110, 1409, 1240],
          body: 'The lagoon-and-garden pattern continues south, with generous green corridors between the neighbourhoods.',
          highlights: ['Winding lagoons', 'Green corridors', 'Waterside villas'],
          units: [
            { name: 'Grand Beach Houses', beds: '3–4 BR', area: '176–277 m² net' },
            { name: 'Horizon Beach Houses', beds: '3–4 BR', area: '191–271 m² net' },
            { name: 'Town Homes', beds: '3 BR', area: '186 m² net' },
            { name: 'Twin Houses', beds: '4 BR', area: '205–208 m² net' },
          ],
        },
        {
          id: 'gateway', label: 'Phase 6', title: 'Southern Park & Gateway', status: 'Phase 6 · The entrance', region: [0, 5320, 1409, 1391],
          body: 'A landscaped park and the community buildings sit beside the highway, forming the southern gateway to Playa Ras El Hekma.',
          highlights: ['Landscaped park', 'Community buildings', 'Highway access'],
          units: [],
        },
      ],
    },
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
    key: 'newgiza',
    name: 'New Giza',
    destination: 'cairo',
    location: 'New Giza',
    category: 'Residential Community',
    image: IMG.villaDay,
    tagline: 'A landscaped residential community on the western edge of Cairo.',
    overview: [
      'New Giza is a master-planned residential community in 6th of October City, composed around landscape, open space and a calm sense of arrival.',
      'Its design draws on the spirit of Cairo’s older neighbourhoods, Zamalek and Garden City, in a modern and neo-classical architectural language, with a shared colour palette and softly curved, tree-lined streets.',
      'Homes are arranged in neighbourhoods linked by green corridors, and range from apartments and duplexes to townhouses, twin houses and villas. The community is built in nine phases: District One, The Groove, Carnell Park, Ivoryhill, Jasper Hill, Westridge, Amberville, Gold Cliff and Kingsrang.',
    ],
    facts: [
      { label: 'Location', value: '22nd km, Cairo–Alexandria Desert Road, 6th of October City' },
      { label: 'Land area', value: '1,500 acres' },
      { label: 'Green space', value: '87% of the land planned as open space, gardens and lakes' },
      { label: 'Entrances', value: '8 main gates' },
      { label: 'Downtown', value: '70 acres of retail, dining and leisure' },
      { label: 'Golf', value: '18-hole golf course' },
      { label: 'Healthcare', value: 'A dedicated medical district' },
      { label: 'Phases', value: 'Nine residential phases' },
    ],
    nearby: [
      { place: 'Ring Road', time: '5 min' },
      { place: 'Grand Egyptian Museum', time: '5 min' },
      { place: 'Al Wahat Road', time: '10 min' },
      { place: 'Sphinx International Airport', time: '25 min' },
      { place: 'Pyramids of Giza', time: '6 km' },
      { place: '26th of July Corridor', time: '2 km' },
    ],
    lifestyle: [
      { title: 'A considered arrival', body: 'Controlled gateways and tree-lined approaches set the tone as you enter the community.', image: IMG.villaDay },
      { title: 'Space to breathe', body: 'Generous open space and landscaped corridors run through every neighbourhood.', image: IMG.terrace },
      { title: 'Evenings at home', body: 'Residences are planned around light, privacy and views over the gardens.', image: IMG.villaNight },
    ],
    amenities: URBAN_AMENITIES,
    units: URBAN_UNITS([IMG.villaDay, IMG.terrace, IMG.interior, IMG.villaNight]),
    zones: ['Residential neighbourhoods', 'Landscaped open space', 'Clubhouse', 'Retail frontage', 'Kids’ area', 'Main gate'],
    gallery: gallery(IMG.villaDay, IMG.terrace, IMG.villaNight, IMG.interior, IMG.canal, IMG.playa),
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

// Master-plan phases. `shapes` index into the zones/plan shapes in ProjectDetail,
// `view` is the [x, y, w, h] the plan zooms to (keep w/h at 1.6:1). Placeholder
// copy: swap for the real phasing once the official master plan is supplied.
const makePhases = (zones) => [
  { id: 'phase-1', label: 'Phase 1', title: 'Arrival & First Neighbourhood', status: 'Phase 1', shapes: [1, 5], view: [40, 200, 440, 275],
    body: `The opening phase sets the tone: ${zones[5].toLowerCase()} and the first residential neighbourhood, delivered together so the community feels complete from day one.`,
    highlights: [zones[1], zones[5]] },
  { id: 'phase-2', label: 'Phase 2', title: 'The Heart of the Community', status: 'Phase 2', shapes: [2, 4], view: [340, 130, 400, 250],
    body: `Phase two brings the social centre online: ${zones[2].toLowerCase()} and ${zones[4].toLowerCase()} anchor daily life for residents.`,
    highlights: [zones[2], zones[4]] },
  { id: 'phase-3', label: 'Phase 3', title: 'Frontage & Villas', status: 'Phase 3', shapes: [0], view: [30, 50, 680, 425],
    body: `The ${zones[0].toLowerCase()} line the primary frontage, taking the best aspect on the site.`,
    highlights: [zones[0]] },
  { id: 'phase-4', label: 'Phase 4', title: 'Signature Feature', status: 'Phase 4', shapes: [3], view: [370, 210, 400, 250],
    body: `The final phase completes the masterplan around ${zones[3].toLowerCase()}, the signature feature of the community.`,
    highlights: [zones[3]] },
];

PROJECTS.forEach((p) => {
  p.phases = makePhases(p.zones);
});

// Real, image-based master plan (TEST: attached to `playa`). Data and editing notes live in playaMasterPlan.js.
PROJECTS.find((p) => p.key === 'playa').plan = playaMasterPlan;
PROJECTS.find((p) => p.key === 'seashell-rh').plan = seashellRhMasterPlan;
PROJECTS.find((p) => p.key === 'seashell').plan = seashellMasterPlan;
PROJECTS.find((p) => p.key === 'newkairo').plan = newKairoMasterPlan;
PROJECTS.find((p) => p.key === 'newgiza').plan = newGizaMasterPlan;

// Edits saved by the dev editors (/dev/projects, /dev/masterplan-editor) live in
// ./overrides/<key>.json and win over the code defaults above. Top-level fields replace the
// project's. `plan` replaces plan fields (or creates the plan, if the project had none);
// `plan.phases` is { [phaseId]: patch } merged into each phase, an unknown id adds a phase,
// null deletes one; `plan.order` is the phase order.
const OVERRIDES = import.meta.glob('./overrides/*.json', { eager: true, import: 'default' });
Object.entries(OVERRIDES).forEach(([file, { plan: planPatch, ...rest }]) => {
  const project = PROJECTS.find((p) => p.key === file.match(/([^/]+)\.json$/)[1]);
  if (!project) return;
  Object.assign(project, rest);
  if (!planPatch) return;
  const { phases: patches = {}, order, ...planRest } = planPatch;
  if (!project.plan && !planRest.image) return;
  project.plan = Object.assign(project.plan ?? { phases: [] }, planRest);
  const known = new Set(project.plan.phases.map((ph) => ph.id));
  const merged = [
    ...project.plan.phases.map((ph) => (patches[ph.id] === null ? null : { ...ph, ...patches[ph.id] })),
    ...Object.entries(patches)
      .filter(([id, patch]) => patch && !known.has(id))
      .map(([id, patch]) => ({ id, ...patch })),
  ].filter(Boolean);
  if (order) merged.sort((x, y) => (order.indexOf(x.id) + 1 || 1e9) - (order.indexOf(y.id) + 1 || 1e9));
  project.plan.phases = merged;
});

export const projectPath = (key) => `/community/${key}`;
export const getProject = (key) => PROJECTS.find((p) => p.key === key);
