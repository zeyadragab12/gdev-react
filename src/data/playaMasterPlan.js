// Interactive master plan for the Playa Ghazala plan image (TEST: attached to the `playa`
// project in projects.js; move it to the Playa Ghazala project once that exists).
//
// EDITING THE MAP, no component changes needed:
//   polygon  [[x, y], ...]  clickable boundary, in IMAGE pixels (the image is 993 x 1584).
//                           In dev, Alt+click on the map copies "[x, y]" to the clipboard.
//   pin      {x, y}         where the numbered marker sits (optional, defaults to `center`).
//   center   {x, y}         what the camera centres on (optional, defaults to the polygon's box).
//   zoom     number         optional zoom, as a multiple of the full-plan view
//                           (optional, by default the camera fits the polygon).
//   image    '/path.jpg'    optional photo for the panel (optional, by default a crop of the plan).
//
// The boundaries below are traced by eye from the raster plan (there are no vector
// paths in the source). Zone names follow the original plan; descriptions are
// placeholders until the official phasing copy is supplied. The Floating Chalets
// (03) position is a best guess and needs confirming.

const NOTE = 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.';

const plan = {
  image: '/images/playa-ghazala-masterplan.jpg',
  thumb: '/masterplans/thumbs/playa.webp',
  width: 993,
  height: 1584,
  alt: 'Master plan of Playa Ghazala',
  caption: 'Playa Ghazala · master plan',
  note: NOTE,
  phases: [
    {
      id: 'beach', number: '01', title: 'Private Beach & Promenade', status: 'Phase 01 · Shoreline',
      body: 'The community opens onto the sea: a private stretch of sand backed by a landscaped promenade of winding paths, planting and open lawns.',
      highlights: ['Private beach', 'Promenade', 'Landscaped park'],
      polygon: [[65, 128], [330, 97], [645, 56], [655, 185], [65, 185]],
      pin: { x: 330, y: 140 },
    },
    {
      id: 'lagoon-chalets', number: '02', title: 'Lagoon Chalets', status: 'Phase 02 · Beachfront',
      body: 'Long lagoons run back from the beach, each framed by rows of chalets so that every home faces water.',
      highlights: ['Lagoon-front chalets', 'Beach access', 'Waterside walks'],
      polygon: [[65, 185], [447, 185], [447, 350], [65, 350]],
      pin: { x: 255, y: 268 },
    },
    {
      id: 'floating-chalets', number: '03', title: 'Floating Chalets', status: 'Phase 03 · Beachfront',
      body: 'Chalets set out over the water at the eastern end of the lagoon blocks, closest to the main arrival plaza.',
      highlights: ['Over-water chalets', 'Lagoon views', 'Arrival plaza'],
      polygon: [[447, 185], [655, 185], [655, 350], [447, 350]],
      pin: { x: 550, y: 268 },
    },
    {
      id: 'villa-rows', number: '04', title: 'Villa Rows 1–8', status: 'Phase 04 · North',
      body: 'Eight ordered rows of villas on either side of the central green spine, a calm neighbourhood a short walk from the beach.',
      highlights: ['8 villa rows', 'Central green spine', 'Tree-lined streets'],
      polygon: [[65, 350], [655, 350], [668, 500], [684, 650], [318, 650], [65, 650]],
      pin: { x: 316, y: 500 },
    },
    {
      id: 'lagoon-quarter-west', number: '05', title: 'Lagoon Quarter · West', status: 'Phase 05 · Central west',
      body: 'Curving streets follow a ribbon of lagoons on the west side of the spine, so most homes sit beside water and green.',
      highlights: ['Winding lagoons', 'Waterside villas', 'Spine park access'],
      polygon: [[65, 650], [318, 650], [338, 750], [350, 850], [362, 960], [372, 1010], [65, 1010]],
      pin: { x: 190, y: 830 },
    },
    {
      id: 'lagoon-quarter-ne', number: '06', title: 'Lagoon Quarter · North East', status: 'Phase 06 · Central east',
      body: 'The largest lagoon network in the community winds through the north-east quarter, with villas stepping down to the water.',
      highlights: ['Largest lagoon network', 'Waterside villas', 'Green corridors'],
      polygon: [[318, 650], [684, 650], [700, 700], [745, 900], [782, 1010], [372, 1010], [362, 960], [350, 850], [338, 750]],
      pin: { x: 500, y: 830 },
    },
    {
      id: 'lagoon-quarter-se', number: '07', title: 'Lagoon Quarter · South East', status: 'Phase 07 · South east',
      body: 'The lagoon-and-garden pattern continues south of the central roundabout, with generous green corridors between neighbourhoods.',
      highlights: ['Winding lagoons', 'Green corridors', 'Waterside villas'],
      polygon: [[372, 1010], [782, 1010], [815, 1100], [850, 1200], [870, 1300], [640, 1300], [640, 1525], [400, 1525], [400, 1470], [420, 1400], [420, 1300], [418, 1200], [400, 1100]],
      pin: { x: 600, y: 1160 },
    },
    {
      id: 'lagoon-quarter-sw', number: '08', title: 'Lagoon Quarter · South West', status: 'Phase 08 · South west',
      body: 'Long east–west lagoons thread between rows of villas on the south-west side of the spine, ending at the southern gateway.',
      highlights: ['Long lagoons', 'Villa neighbourhoods', 'Southern gateway'],
      polygon: [[65, 1010], [372, 1010], [400, 1100], [418, 1200], [420, 1300], [420, 1400], [400, 1470], [400, 1525], [65, 1525]],
      pin: { x: 235, y: 1250 },
    },
    {
      id: 'clubhouse', number: '09', title: 'Clubhouse', status: 'Phase 09 · Clubhouse',
      body: 'The community clubhouse, pools and amenity buildings sit beside the highway, forming the southern entrance to Playa Ghazala.',
      highlights: ['Clubhouse', 'Pools', 'Amenity buildings'],
      polygon: [[640, 1300], [870, 1300], [905, 1400], [925, 1525], [640, 1525]],
      pin: { x: 775, y: 1410 },
    },
  ],
};

export default plan;
