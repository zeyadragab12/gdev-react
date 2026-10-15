// Interactive master plan for Newgiza. Same format and editing notes as playaMasterPlan.js
// (polygons are in IMAGE pixels; the image is 789 x 1057). The boundaries are traced by eye
// from the raster, and the phase names and descriptions are placeholders until the official
// phasing is supplied.

const plan = {
  image: '/images/newgiza-masterplan.png',
  thumb: '/masterplans/thumbs/new_giza.jpg',
  width: 789,
  height: 1057,
  alt: 'Master plan of Newgiza',
  caption: 'Newgiza · master plan',
  note: 'Indicative layout. All materials, dimensions and drawings are approximate and subject to change without notice.',
  phases: [
    {
      id: 'northern-hub', number: '01', title: 'Northern Hub', status: 'Phase 01 · North gateway',
      body: 'The community’s northern gateway on the Cairo–Alexandria Desert Road: hotels, residential blocks and the first retail frontage gathered around a landscaped plaza.',
      highlights: ['Hotel & serviced living', 'Retail frontage', 'Desert Road access'],
      polygon: [[420, 80], [545, 50], [640, 95], [625, 185], [600, 265], [560, 275], [480, 240], [440, 170]],
      pin: { x: 540, y: 160 },
    },
    {
      id: 'northern-park', number: '02', title: 'Northern Park & Clubs', status: 'Phase 02 · North west',
      body: 'A green park of lawns and tree-lined paths holds the northern clubs and low-rise buildings, set apart from the residential quarters.',
      highlights: ['Landscaped park', 'Club buildings', 'Walking paths'],
      polygon: [[190, 168], [255, 130], [345, 128], [415, 160], [440, 215], [330, 225], [230, 200]],
      pin: { x: 320, y: 175 },
    },
    {
      id: 'northern-golf', number: '03', title: 'Northern Golf Quarter', status: 'Phase 03 · North',
      body: 'Villa streets wrap the northern fairways and lakes, so most homes look onto the course or the water.',
      highlights: ['Golf fairways', 'Lakes', 'Villa streets'],
      polygon: [[320, 255], [480, 235], [585, 285], [585, 462], [330, 462], [300, 350]],
      pin: { x: 450, y: 350 },
    },
    {
      id: 'west-residential', number: '04', title: 'West Residential Quarter', status: 'Phase 04 · West',
      body: 'Curving apartment and townhouse blocks surround small lakes and gardens along the western edge of the community.',
      highlights: ['Apartment blocks', 'Lakes & gardens', 'Western gate'],
      polygon: [[72, 515], [215, 462], [245, 520], [250, 650], [160, 645]],
      pin: { x: 165, y: 560 },
    },
    {
      id: 'east-residential', number: '05', title: 'East Residential Quarter', status: 'Phase 05 · East',
      body: 'Clustered homes around landscaped courts and water features, beside the sports courts and the eastern gate.',
      highlights: ['Garden courts', 'Sports courts', 'Eastern gate'],
      polygon: [[568, 465], [690, 462], [705, 600], [690, 700], [640, 750], [560, 760]],
      pin: { x: 630, y: 600 },
    },
    {
      id: 'central-golf', number: '06', title: 'Central Golf Quarter', status: 'Phase 06 · Centre',
      body: 'The heart of the community: long fairways and lakes run through the centre, with villa neighbourhoods stepping down on either side.',
      highlights: ['Central fairways', 'Lakeside villas', 'Green corridors'],
      polygon: [[215, 462], [568, 465], [560, 760], [500, 830], [400, 845], [310, 780], [250, 650], [245, 520]],
      pin: { x: 410, y: 640 },
    },
    {
      id: 'west-club', number: '07', title: 'West Club & Sports', status: 'Phase 07 · South west',
      body: 'Tennis courts, sports facilities and a small apartment cluster sit beside the western gate.',
      highlights: ['Tennis courts', 'Sports facilities', 'Western gate'],
      polygon: [[150, 660], [250, 650], [300, 780], [280, 800], [200, 765]],
      pin: { x: 235, y: 720 },
    },
    {
      id: 'southern-gateway', number: '08', title: 'Southern Quarter & Gateway', status: 'Phase 08 · South',
      body: 'Villa neighbourhoods and the community’s southern landmark building taper to the southern gate.',
      highlights: ['Villa neighbourhoods', 'Landmark building', 'Southern gate'],
      polygon: [[310, 790], [400, 850], [500, 835], [560, 770], [640, 800], [575, 885], [575, 940], [490, 955], [470, 985], [440, 1030], [385, 945], [340, 880]],
      pin: { x: 480, y: 900 },
    },
  ],
};

export default plan;
