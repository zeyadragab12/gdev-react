// Where each project sits on the Home map, and the real ground footprint of its master plan.
//
// !! EVERY ENTRY BELOW IS A PLACEHOLDER (verified: false). !!
// Positions are offsets from the destination pin in projects.js and the widths are guesses.
// Replace them with survey values, then set `verified: true` (the map shows an
// "Indicative location" note on every project that is not verified yet).
//
//   center     [lon, lat]  centre of the master plan on the ground (WGS84).
//   widthKm    number      real width of the plan image (left to right) in km. The height follows
//                          the image's aspect ratio, so the plan is never stretched.
//   heightKm   number      only for projects with no plan image: footprint height in km.
//   rotation   degrees     clockwise turn of the plan from north-up (0 = the top of the image is north).
//   mapImage   {src,width,height}  map-only plan image (a file in public/, e.g. '/images/x.png', and its exact pixel
//                          size). Use it when the project has no interactive master plan in projects.js; it only
//                          appears on the Home map and never touches the project page. Ignored if project.plan exists.
//   outline    [[lon,lat]] optional exact site boundary. Drawn as the highlighted area instead of
//                          the plan's rectangle (the image is still placed from center/widthKm/rotation).
//   verified   boolean     true once center, widthKm and rotation come from real survey data.
//
// Projects not listed here get no pin on the zoomed map. Ivy is not in projects.js yet; add it there
// first (its geo entry below then works as is).

// Centres are the Google Maps pins for each project (resolved from the shared links, 2026-10-08).
// A pin is a single point: widthKm and rotation are still estimates, so verified stays false.
export const PROJECT_GEO = {
  'seashell-rh': {
    center: [28.0722999, 31.0772685], widthKm: 1.953, rotation: 1.68, verified: false,
    outline: [
      [28.0663133, 31.066604],
      [28.0660465, 31.0680325],
      [28.0650125, 31.0686325],
      [28.063278, 31.0830306],
      [28.062611, 31.0853443],
      [28.0627103, 31.0869612],
      [28.0777344, 31.087654],
      [28.0788417, 31.0814903],
      [28.0795907, 31.0774461],
      [28.0803072, 31.0743779],
      [28.081985, 31.0675658],
      [28.0818222, 31.0670358],
      [28.0806824, 31.0668963],
      [28.0799659, 31.0665336],
      [28.0743971, 31.0662547],
      [28.0669394, 31.0662547],
    ],
  },
  'playa-rh': {
    center: [27.9741586, 31.0801974], widthKm: 0.545, rotation: 1.48, verified: false,
    outline: [
      [27.9716415, 31.0700761],
      [27.9716088, 31.080648],
      [27.9716761, 31.0814167],
      [27.9715415, 31.0825505],
      [27.971509, 31.0893987],
      [27.9717107, 31.0912549],
      [27.9771366, 31.0911614],
      [27.9758384, 31.0824109],
      [27.9760012, 31.0811165],
      [27.9761872, 31.0798419],
      [27.9764197, 31.078886],
      [27.9765114, 31.077745],
      [27.9757355, 31.0751435],
      [27.9759875, 31.0735126],
      [27.9762115, 31.0711861],
      [27.9759035, 31.0701308],
      [27.9745594, 31.0688356],
    ],
  },
  playa: {
    center: [28.5834837, 31.026627], widthKm: 1.84, rotation: 13.38, verified: false,
    outline: [
      [28.5717391, 31.015516],
      [28.5782649, 31.0390742],
      [28.5825229, 31.0383604],
      [28.586966, 31.0382017],
      [28.5894652, 31.0381621],
      [28.5890024, 31.0337602],
      [28.5901546, 31.0329691],
      [28.5901131, 31.0316187],
      [28.5888172, 31.0310238],
      [28.5884933, 31.0302703],
      [28.5880767, 31.0266613],
      [28.5877065, 31.0236867],
      [28.5878453, 31.0222985],
      [28.5881693, 31.0211483],
      [28.5885395, 31.0198791],
      [28.5888172, 31.0185305],
      [28.5886784, 31.0166663],
      [28.5878916, 31.015754],
      [28.5881693, 31.0144847],
      [28.5886321, 31.0134138],
    ],
  },
  seashell: {
    mapImage: { src: '/images/seashell-masterplan.png', width: 733, height: 999 }, center: [28.6928971, 30.9951367], widthKm: 1.269, rotation: 178.65, verified: false,
    outline: [
      [28.6932131, 30.9890291],
      [28.6965247, 30.9879402],
      [28.6968968, 30.9893217],
      [28.6975502, 30.9910679],
      [28.698242, 30.993852],
      [28.6979538, 30.9941979],
      [28.6977232, 30.9944944],
      [28.6973773, 30.9958452],
      [28.6969353, 30.9978549],
      [28.6960665, 31.0021816],
      [28.6955685, 31.0025018],
      [28.6945724, 31.0027365],
      [28.6930784, 31.0026725],
      [28.6921036, 31.002464],
      [28.690992, 31.002464],
      [28.6902661, 31.0024251],
      [28.6883378, 31.0023863],
      [28.6878388, 31.0023474],
      [28.6878841, 31.0008501],
      [28.688179, 30.9979333],
      [28.6884513, 30.994433],
      [28.6886554, 30.9924689],
      [28.6892453, 30.9921772],
      [28.69013, 30.9920994],
      [28.6909694, 30.9919827],
      [28.6914911, 30.9917883],
      [28.6916046, 30.9914966],
      [28.691786, 30.9906214],
      [28.6922851, 30.9903881],
      [28.6928069, 30.9900964],
    ],
  },
  newkairo: {
    mapImage: { src: '/images/newkairo-masterplan.jpg', width: 1651, height: 1443 }, center: [31.6789155, 30.1230226], widthKm: 3.535, rotation: -1.81, verified: false,
    outline: [
      [31.6730528, 30.1355135],
      [31.6757162, 30.1359277],
      [31.6781129, 30.1263451],
      [31.6901489, 30.1256097],
      [31.693777, 30.1096217],
      [31.6708756, 30.1092532],
      [31.668743, 30.119199],
      [31.6665062, 30.1301627],
      [31.6697508, 30.1308147],
      [31.6720409, 30.130308],
      [31.6748108, 30.1299853],
    ],
  },
  cityview: { center: [31.0906364, 30.0137085], widthKm: 1.0, heightKm: 1.0, rotation: 0, verified: false },
  ainbay: { center: [32.377057, 29.7309491], widthKm: 1.0, heightKm: 1.0, rotation: 0, verified: false },
  newgiza: {
    mapImage: { src: '/images/newgiza-masterplan.png', width: 789, height: 1057 }, center: [31.0580005, 30.0060659], widthKm: 3.507, rotation: 1.84, verified: false,
    outline: [
      [31.0596731, 29.9857474],
      [31.0437049, 30.0067028],
      [31.0508174, 30.010205],
      [31.0542341, 30.013526],
      [31.0549314, 30.016243],
      [31.053746, 30.0180543],
      [31.0495622, 30.019926],
      [31.0515844, 30.0222202],
      [31.0556985, 30.0221599],
      [31.0569536, 30.021375],
      [31.0584179, 30.0212542],
      [31.0603006, 30.0220391],
      [31.0622531, 30.0236692],
      [31.065112, 30.0249974],
      [31.0662974, 30.0252993],
      [31.069505, 30.0230655],
      [31.0701325, 30.0222202],
      [31.070272, 30.0215561],
      [31.0687379, 30.0199864],
      [31.0679709, 30.0177524],
      [31.0682498, 30.0170279],
      [31.0676223, 30.0164241],
      [31.0685288, 30.0138882],
      [31.0681104, 30.0128618],
      [31.066925, 30.0125599],
      [31.0665763, 30.0091181],
      [31.0688774, 30.0080916],
      [31.0709693, 30.0078501],
      [31.0729915, 30.0066424],
      [31.0688774, 29.992874],
      [31.0676223, 29.9929344],
      [31.0656698, 29.9927532],
      [31.0649028, 29.99227],
      [31.0651817, 29.9915453],
      [31.0644844, 29.9913641],
      [31.0657396, 29.990579],
      [31.0657396, 29.9893712],
      [31.0631596, 29.9884652],
      [31.0623228, 29.9892504],
      [31.0616952, 29.9897939],
      [31.0606493, 29.9897939],
      [31.0606493, 29.9889484],
      [31.0603006, 29.9881633],
      [31.0594639, 29.9879821],
    ],
  },
  // Not in projects.js yet, so it has no pin. Add the project entry, then this works as is.
  ivy: { center: [30.8521303, 30.1452414], widthKm: 1.0, heightKm: 1.0, rotation: 0, verified: false },
};
