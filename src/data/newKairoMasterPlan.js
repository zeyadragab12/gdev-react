// Interactive master plan for NewKairo. Same format and editing notes as playaMasterPlan.js
// (polygons are in IMAGE pixels; the image is 1651 x 1443). The boundaries are traced by eye
// from the aerial render, and the phase names and descriptions are placeholders until the
// official phasing is supplied.

const plan = {
  image: '/images/newkairo-masterplan.jpg',
  thumb: '/masterplans/thumbs/newkairo.jpg',
  width: 1651,
  height: 1443,
  alt: 'Master plan of NewKairo',
  caption: 'NewKairo · master plan',
  note: 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.',
  phases: [
    {
      id: 'landmark', number: '01', title: 'Landmark & Hotel', status: 'Phase 01 · Arrival',
      body: 'The community opens with its landmark building and hotel, set in landscaped gardens and pools beside the main entrance.',
      highlights: ['Landmark building', 'Hotel', 'Garden pools'],
      polygon: [[295, 335], [470, 315], [665, 400], [655, 520], [540, 540], [420, 480], [300, 480]],
      pin: { x: 500, y: 430 },
    },
    {
      id: 'boulevard-parks', number: '02', title: 'Boulevard Parks', status: 'Phase 02 · West edge',
      body: 'Long landscaped strips of lawn and planting run down the western edge, a green buffer between the community and the city.',
      highlights: ['Tree-lined lawns', 'Walking paths', 'Green buffer'],
      polygon: [[255, 450], [415, 450], [410, 1130], [350, 1135], [345, 890], [258, 880]],
      pin: { x: 335, y: 780 },
    },
    {
      id: 'mixed-use', number: '03', title: 'Mixed-Use Spine', status: 'Phase 03 · West spine',
      body: 'Low-rise apartment and commercial buildings line the western spine road, keeping daily needs a short walk from every home.',
      highlights: ['Apartments', 'Retail & services', 'Spine road'],
      polygon: [[400, 700], [520, 640], [600, 740], [620, 1000], [600, 1170], [520, 1240], [420, 1250], [405, 900]],
      pin: { x: 510, y: 960 },
    },
    {
      id: 'north-west-villas', number: '04', title: 'North West Villa Ridge', status: 'Phase 04 · North west',
      body: 'Curving villa streets follow the ridge above the golf course, with fairway views from the upper plots.',
      highlights: ['Villa streets', 'Fairway views', 'Quiet cul-de-sacs'],
      polygon: [[415, 490], [545, 545], [700, 520], [760, 680], [650, 760], [560, 700], [500, 600], [415, 640]],
      pin: { x: 600, y: 630 },
    },
    {
      id: 'northern-golf', number: '05', title: 'Northern Golf & Villas', status: 'Phase 05 · North east',
      body: 'Villa rows and low-rise homes stretch along the northern avenue, facing the fairways and lakes to the south.',
      highlights: ['Golf frontage', 'Lakes', 'Villa rows'],
      polygon: [[740, 690], [1000, 700], [1300, 670], [1320, 780], [1280, 860], [1000, 830], [780, 790]],
      pin: { x: 1030, y: 770 },
    },
    {
      id: 'eastern-crescent', number: '06', title: 'Eastern Villa Crescent', status: 'Phase 06 · East',
      body: 'A crescent of villas curves around the eastern fairways, giving each plot an open outlook over the course.',
      highlights: ['Crescent streets', 'Course outlook', 'Private gardens'],
      polygon: [[1000, 830], [1280, 860], [1330, 980], [1330, 1130], [1240, 1170], [1100, 1130], [990, 1040], [960, 900]],
      pin: { x: 1170, y: 1000 },
    },
    {
      id: 'central-golf', number: '07', title: 'Central Golf & Clubhouse', status: 'Phase 07 · Centre',
      body: 'The heart of the community: the golf course, its lakes and the clubhouse, with water, terraces and dining at the centre.',
      highlights: ['Golf course', 'Clubhouse', 'Lakes'],
      polygon: [[640, 780], [960, 860], [990, 1040], [960, 1160], [800, 1170], [690, 1100], [640, 950]],
      pin: { x: 830, y: 1010 },
    },
    {
      id: 'southern-gateway', number: '08', title: 'Southern Villas & Gateway', status: 'Phase 08 · South',
      body: 'Villa neighbourhoods run along the southern edge toward the ring-road gateway, set back behind a belt of planting.',
      highlights: ['Villa neighbourhoods', 'Ring-road access', 'Planted buffer'],
      polygon: [[520, 1240], [700, 1175], [960, 1165], [1240, 1175], [1195, 1290], [1010, 1330], [700, 1330], [525, 1320]],
      pin: { x: 870, y: 1255 },
    },
  ],
};

export default plan;
