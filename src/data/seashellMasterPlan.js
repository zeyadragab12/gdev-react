// Interactive master plan for Seashell (North Coast). Same format and editing notes as
// playaMasterPlan.js (polygons are in IMAGE pixels; the image is 733 x 999, a PNG with a
// transparent background). The boundaries are traced by eye from the raster, and the phase
// names and descriptions are placeholders until the official phasing is supplied.

const plan = {
  image: '/images/seashell-masterplan.png',
  thumb: '/masterplans/thumbs/SEASHELL.jpg',
  width: 733,
  height: 999,
  alt: 'Master plan of Seashell',
  caption: 'Seashell · master plan',
  note: 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.',
  phases: [
    {
      id: 'gateway', number: '01', title: 'Main Gateway', status: 'Phase 01 · Arrival',
      body: 'The community’s entrance: a landscaped approach and gatehouse where the spine road begins.',
      highlights: ['Gatehouse', 'Landscaped approach', 'Spine road'],
      polygon: [[175, 70], [225, 30], [410, 70], [420, 95], [360, 135], [180, 135]],
      pin: { x: 300, y: 90 },
    },
    {
      id: 'northern-villas', number: '02', title: 'Northern Villa Rows', status: 'Phase 02 · North',
      body: 'Ordered rows of villas either side of the spine road, a calm neighbourhood at the top of the community.',
      highlights: ['Villa rows', 'Green corridors', 'Spine road access'],
      polygon: [[160, 135], [360, 135], [385, 200], [455, 285], [360, 270], [130, 262]],
      pin: { x: 280, y: 200 },
    },
    {
      id: 'lagoon-north-west', number: '03', title: 'Lagoon Quarter · North West', status: 'Phase 03 · North west',
      body: 'A winding lagoon on the north-west side, with villas curling around its banks so most homes sit at the water’s edge.',
      highlights: ['Winding lagoon', 'Waterside villas', 'Footbridge'],
      polygon: [[128, 262], [350, 268], [345, 398], [95, 405]],
      pin: { x: 235, y: 335 },
    },
    {
      id: 'lagoon-north-east', number: '04', title: 'Lagoon Quarter · North East', status: 'Phase 04 · North east',
      body: 'Looping lagoons wind through the north-east quarter, with villa clusters stepping down to the water.',
      highlights: ['Looping lagoons', 'Villa clusters', 'Waterside walks'],
      polygon: [[360, 270], [455, 285], [560, 305], [605, 330], [600, 470], [470, 455], [360, 440]],
      pin: { x: 490, y: 380 },
    },
    {
      id: 'central-villas', number: '05', title: 'Central Villa Rows', status: 'Phase 05 · Centre',
      body: 'Long east–west rows of villas fill the middle of the community, linked by the central spine and its green verges.',
      highlights: ['Villa rows', 'Central spine', 'Green verges'],
      polygon: [[100, 400], [345, 398], [360, 440], [470, 455], [600, 470], [615, 590], [345, 590], [140, 585]],
      pin: { x: 370, y: 515 },
    },
    {
      id: 'lagoon-south-west', number: '06', title: 'Lagoon Quarter · South West', status: 'Phase 06 · South west',
      body: 'A lagoon with a central island pavilion, framed by curving rows of villas on the south-west side.',
      highlights: ['Island pavilion', 'Lagoon-front villas', 'Quiet streets'],
      polygon: [[140, 585], [345, 590], [345, 760], [200, 765], [170, 700]],
      pin: { x: 265, y: 680 },
    },
    {
      id: 'lagoon-south-east', number: '07', title: 'Lagoon Quarter · South East', status: 'Phase 07 · South east',
      body: 'The largest lagoon in the community fills the south-east quarter, with villas stepping down to the water and an island pavilion at its centre.',
      highlights: ['Largest lagoon', 'Island pavilion', 'Waterside villas'],
      polygon: [[345, 590], [615, 590], [625, 730], [345, 760]],
      pin: { x: 480, y: 670 },
    },
    {
      id: 'southern-villas', number: '08', title: 'Southern Villa Rows', status: 'Phase 08 · South',
      body: 'Final rows of villas run along the southern road, a short walk from the beachfront lagoons.',
      highlights: ['Villa rows', 'Beach access', 'Southern road'],
      polygon: [[190, 760], [345, 760], [625, 730], [630, 810], [185, 810]],
      pin: { x: 410, y: 785 },
    },
    {
      id: 'beachfront', number: '09', title: 'Beachfront Lagoons & Club', status: 'Phase 09 · Beachfront',
      body: 'A row of lagoons opens onto the private beach, with chalets along their banks and the beach club and pool deck at the western end.',
      highlights: ['Beachfront lagoons', 'Beach club', 'Private beach'],
      polygon: [[185, 810], [630, 810], [615, 935], [430, 960], [200, 950]],
      pin: { x: 410, y: 880 },
    },
  ],
};

export default plan;
