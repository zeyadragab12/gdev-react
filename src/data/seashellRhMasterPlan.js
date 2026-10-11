// Interactive master plan for Seashell Ras El Hekma. Same format and editing notes as
// playaMasterPlan.js (polygons are in IMAGE pixels; the image is 1088 x 1445, a PNG with a
// transparent background). The boundaries are traced by eye from the raster, and the zone
// names and descriptions are placeholders until the official phasing is supplied.

const plan = {
  image: '/images/seashell-rh-masterplan.png',
  thumb: '/masterplans/thumbs/seashell-rh.webp',
  width: 1088,
  height: 1445,
  alt: 'Master plan of Seashell Ras El Hekma',
  caption: 'Seashell Ras El Hekma · master plan',
  note: 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.',
  phases: [
    {
      id: 'beach', number: '01', title: 'Private Beach', status: 'Phase 01 · Shoreline',
      body: 'A wide private beach and landscaped promenade run the full length of the community, opening every lagoon block onto the sea.',
      highlights: ['Private beach', 'Promenade', 'Beach pavilions'],
      polygon: [[18, 185], [200, 160], [420, 115], [640, 100], [830, 85], [835, 200], [20, 208]],
      pin: { x: 430, y: 160 },
    },
    {
      id: 'lagoon-chalets', number: '02', title: 'Lagoon Chalets', status: 'Phase 02 · Beachfront',
      body: 'Twelve long lagoons run back from the beach, each framed by rows of chalets so that every home faces the water.',
      highlights: ['12 lagoons', 'Lagoon-front chalets', 'Beach access'],
      polygon: [[150, 205], [835, 200], [838, 368], [150, 375]],
      pin: { x: 490, y: 290 },
    },
    {
      id: 'beach-club', number: '03', title: 'Beach Club', status: 'Phase 03 · Beachfront',
      body: 'The beach club sits at the western end of the lagoon blocks, with a pool deck and lounge buildings beside the shore.',
      highlights: ['Pool deck', 'Lounge & dining', 'Beach access'],
      polygon: [[35, 225], [146, 215], [148, 395], [75, 402], [35, 300]],
      pin: { x: 92, y: 310 },
    },
    {
      id: 'villa-blocks', number: '04', title: 'Villa Blocks', status: 'Phase 04 · North',
      body: 'Four blocks of villas laid out in ordered rows either side of the central avenue, a calm neighbourhood a short walk from the beach.',
      highlights: ['Ordered villa rows', 'Central avenue', 'Green corridors'],
      polygon: [[72, 385], [855, 370], [870, 440], [917, 672], [115, 692], [85, 540]],
      pin: { x: 500, y: 530 },
    },
    {
      id: 'lagoon-quarter-west', number: '05', title: 'Lagoon Quarter · West', status: 'Phase 05 · Central west',
      body: 'Curving streets of villas wrap around a ribbon of lagoons on the west side of the spine road.',
      highlights: ['Winding lagoons', 'Waterside villas', 'Spine road access'],
      polygon: [[118, 692], [520, 690], [535, 760], [555, 830], [575, 930], [590, 1000], [597, 1050], [162, 1050]],
      pin: { x: 340, y: 870 },
    },
    {
      id: 'lagoon-quarter-east', number: '06', title: 'Lagoon Quarter · East', status: 'Phase 06 · Central east',
      body: 'The largest lagoon network in the community winds through the east quarter, with villas stepping down to the water.',
      highlights: ['Largest lagoon network', 'Waterside villas', 'Green corridors'],
      polygon: [[520, 690], [917, 672], [935, 800], [960, 900], [988, 1050], [597, 1050], [590, 1000], [575, 930], [555, 830], [535, 760]],
      pin: { x: 760, y: 860 },
    },
    {
      id: 'lagoon-quarter-south-west', number: '07', title: 'Lagoon Quarter · South West', status: 'Phase 07 · South west',
      body: 'Looping lagoons weave between villa clusters in the south-west quarter, set back from the main road.',
      highlights: ['Looping lagoons', 'Villa clusters', 'Quiet cul-de-sacs'],
      polygon: [[162, 1050], [597, 1050], [610, 1110], [640, 1250], [660, 1302], [205, 1300]],
      pin: { x: 390, y: 1170 },
    },
    {
      id: 'lagoon-quarter-south-east', number: '08', title: 'Lagoon Quarter · South East', status: 'Phase 08 · South east',
      body: 'The lagoon-and-garden pattern continues in the south-east, with generous water frontage and parkland to the east.',
      highlights: ['Water frontage', 'Villa clusters', 'Parkland'],
      polygon: [[597, 1050], [988, 1050], [1020, 1150], [1040, 1260], [1010, 1342], [680, 1345], [660, 1302], [640, 1250], [610, 1110]],
      pin: { x: 830, y: 1190 },
    },
    {
      id: 'sports-club', number: '09', title: 'Sports & Clubhouse', status: 'Phase 09 · Southern gateway',
      body: 'A running track, tennis courts and the community clubhouse sit beside the main road, forming the southern gateway.',
      highlights: ['Running track', 'Tennis courts', 'Clubhouse'],
      polygon: [[215, 1300], [670, 1302], [675, 1362], [230, 1366]],
      pin: { x: 440, y: 1334 },
    },
  ],
};

export default plan;
