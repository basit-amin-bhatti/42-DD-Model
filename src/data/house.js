// Authoring units: feet. X = paper left → right; Z = rear → front.
export const FT = 0.3048;
export const LEVEL_HEIGHT = 10.75;
export const WALL_HEIGHT = 10;
export const SLAB = 0.75;
export const STAIR = { x0: 22.25, x1: 34.75, z0: 40.375, z1: 51.625, width: 3.5, count: 22 };
const door = (side, at, width = 3) => ({ side, at, width, kind: 'door', sill: 0, head: 7 });
const win = (side, at, width = 5, sill = 3) => ({ side, at, width, kind: 'window', sill, head: 7.5 });
const open = (side, at, width) => ({ side, at, width, kind: 'opening', sill: 0, head: 9 });
const r = (id, name, x, z, w, d, label, type, openings = [], options = {}) => ({ id, name, x, z, w, d, label, type, openings, ...options });
const poly = (x, z, w, d) => [[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
export const FLOORS = [
  {
    id: 'basement', name: 'Lower ground', short: 'Basement', code: 'B1', elevation: -LEVEL_HEIGHT,
    drawing: 'Basement.jpeg', description: 'Private rooms & sunken courts',
    footprint: [[0,0],[22,0],[22,2.5],[39,2.5],[39,51.875],[35,51.875],[35,54],[24,54],[24,63],[16.5,63],[16.5,70],[0,70]],
    holes: [], spawn: [19,46],
    rooms: [
      r('b-staff','Staff quarter',0.75,2.75,14.25,9,'14′3″ × 9′','service',[door('e',1.2,2.75)],{ furniture:'single-bed' }),
      r('b-veranda','Rear veranda',15.5,0.75,6,7,'6′ × 7′','outdoor',[door('w',2),open('n',0.1,5.8)],{note:'Rear stair enclosure and offset are estimated from the photograph.'}),
      r('b-toilet','Staff toilet',15.5,8.25,6,4.5,'6′ × 4′6″','bath',[door('n',1.2,2.5)],{ furniture:'bath' }),
      r('b-master','Master bedroom',2.75,12.25,19,14,'19′ × 14′','bedroom',[door('s',15.2),door('s',8.2),win('w',2,10)],{ furniture:'bed', bedRotation:0 }),
      r('b-child-dress','Dressing',22.25,2.75,6.625,7,'6′7½″ × 7′','service',[open('s',2,3.3)],{ furniture:'wardrobe' }),
      r('b-child-bath','Child bathroom',29.375,2.75,9,7,'9′ × 7′','bath',[door('w',3.3,2.5),win('n',3,3,5)],{ furniture:'bath' }),
      r('b-child','Child bedroom',22.25,10.25,16,13,'16′ × 13′','bedroom',[door('s',0.8),open('n',0.5,5.2),win('e',4.7,7.5)],{ furniture:'bed' }),
      r('b-master-bath','Master bathroom',0.75,26.75,7,12,'7′ × 12′','bath',[door('e',2.1,2.5),win('w',5,3,5)],{ furniture:'bath' }),
      r('b-master-dress','Master dressing',8.25,26.75,6.5,13.875,'6′6″ × 13′10½″','service',[door('n',2.7)],{ furniture:'wardrobe' }),
      r('b-lounge','TV lounge',15.25,24,17,16.125,'17′ × 16′1½″','living',[open('n',0.5,16),door('s',1.2,4.5),win('e',2.4,9)],{ furniture:'lounge', kitchen:true, note:'Rear edge opens into the bedroom circulation recess; the recess is not included in the printed lounge size.' }),
      r('b-guest-bath','Guest bathroom',0.75,39.25,7,11.125,'7′ × 11′1½″','bath',[door('s',1.5,2.5),win('w',3.5,3,5)],{ furniture:'bath' }),
      r('b-store','Store',8.25,41.125,7.625,9.25,'7′7½″ × 9′3″','service',[door('e',6)],{ furniture:'shelves' }),
      r('b-stair','Stair hall',16.375,40.625,16.75,12,'16′9″ × 12′','circulation',[],{ noWalls:true, note:'Printed hall size retained. The shared L-shaped flight extends into its adjoining landing, as shown in the source.' }),
      r('b-powder','Powder room',35.5,44.25,3.125,7,'7′ × 3′10½″?','bath',[door('n',0.3,2.5)],{ furniture:'bath',note:'Narrow rotated label is unclear. 7 ft depth is readable; model width is provisionally 3 ft 1½ in to retain external access.' }),
      r('b-guest','Guest bedroom',0.75,51,15,17,'15′ × 17′','bedroom',[door('e',0.5),door('n',1.5,2.5),win('s',3.2,8)],{ furniture:'bed',bedRotation:Math.PI/2 }),
      r('b-guest-dress','Guest dressing',16.25,56.25,7,5.792,'7′ × 5′9½″','service',[open('w',0.4,4.9)],{ furniture:'wardrobe' }),
    ],
    courts: [r('b-west-court','West sunken court',-3.75,12.25,4,47,'4′ wide','court',[],{noWalls:true}),r('b-east-court','East sunken court',32.75,24,8.625,16.125,'8′7½″ wide','court',[],{noWalls:true}),r('b-rear-court','Rear access court',5,0,10,2.25,'Width inferred','court',[],{noWalls:true})],
  },
  {
    id:'ground',name:'Ground floor',short:'Ground',code:'00',elevation:0,drawing:'GF.jpeg',description:'Arrival, entertaining & daily living',
    footprint:[[0,0],[38.75,0],[38.75,18],[33.75,18],[33.75,39.125],[38.75,39.125],[38.75,52.125],[24.5,52.125],[24.5,67.375],[0,67.375]],
    holes:[[[22.25,41.625],[31.25,41.625],[31.25,40.375],[34.75,40.375],[34.75,51.625],[22.25,51.625]]],spawn:[20,56],
    rooms:[
      r('g-bath','Master bathroom',0.75,0.75,8,10,'8′ × 10′','bath',[door('e',3.5,2.5),win('n',2.4,3,5)],{furniture:'bath'}),
      r('g-hot','Hot kitchen',0.75,11.25,8,12.875,'8′ × 12′10½″','kitchen',[door('s',3),door('w',9.2),win('w',2.3,4)],{furniture:'kitchen'}),
      r('g-dressing','Master dressing',9.25,0.75,6.25,23.625,'6′3″ × 23′7½″','service',[door('e',2.5),door('w',3.5,2.5)],{furniture:'wardrobe',note:'The rear end is a circulation alcove connecting bathroom and master bedroom.'}),
      r('g-master','Master bedroom',16,0.75,22,17,'22′ × 17′','bedroom',[door('w',2.5),door('s',0.6),win('e',5,10)],{furniture:'bed'}),
      r('g-lounge','TV lounge',16.25,18.25,17,20.625,'17′ × 20′7½″','living',[door('n',0.35),door('s',0.5,4.5),open('w',8,10.7),win('e',2,14)],{furniture:'lounge'}),
      r('g-kitchen','Main kitchen',0.75,24.875,15,14,'15′ × 14′','kitchen',[door('n',3),open('e',1.5,11.9),win('w',2,6)],{furniture:'kitchen',island:true}),
      r('g-drawing','Drawing / dining',0.75,39.625,15,27,'15′ × 27′','living',[door('e',3.75,4),door('e',12,4.5),win('s',2,11),win('w',10,11)],{furniture:'drawing'}),
      r('g-stair','Double-height stair hall',16.25,39.625,21,12,'21′ × 12′','circulation',[],{noWalls:true}),
      r('g-lobby','Entrance lobby',16.25,52.125,7.5,8.167,'7′6″ wide','circulation',[door('s',1.5,4.5),open('n',0.1,7.3),door('w',0.2,4.5)],{note:'Lobby depth is unlabelled; aligned to the front podium and stair landing.'}),
      r('g-powder','Powder room',35.5,44.25,3.125,7,'7′ × 3′10½″?','bath',[door('n',0.3,2.5)],{furniture:'bath',note:'Rotated width text unclear; aligned with the lower-ground enclosure using a provisional narrow width.'}),
      r('g-podium','Entrance podium',16.25,60.792,8.25,5.583,'8′3″ × 5′7″','outdoor',[],{noWalls:true}),
      r('g-porch','Car porch',25,52.125,19.042,15.5,'19′½″ × 15′…','outdoor',[],{noWalls:true,furniture:'cars',note:'Porch depth is partly obscured by the car drawing. 15 ft 6 in is provisional.'}),
    ],
    courts:[r('g-west-court','West light well',-2.4,12.25,2.4,45,'Unlabelled width','court',[],{noWalls:true}),r('g-east-court','Sunken court below',33.75,19,5,20.125,'See lower-ground plan','court',[],{noWalls:true})],
  },
  {
    id:'first',name:'First floor',short:'First',code:'01',elevation:LEVEL_HEIGHT,drawing:'FF.jpeg',description:'Bedrooms, bridge & outdoor terraces',
    footprint:[[0,0],[38.75,0],[38.75,52],[44.125,52],[44.125,69.25],[25,69.25],[25,68.5],[0,68.5]],
    holes:[poly(17,40.375,17.75,11.25),poly(16.75,56.125,7.5,4.875),poly(16.75,61.5,7.5,7)],spawn:[19.5,37.7],
    rooms:[
      r('f-master','Master bedroom',0.75,0.75,14,19,'14′ × 19′','bedroom',[door('e',14.7),door('e',8.6),win('s',2,9)],{furniture:'bed',bedRotation:Math.PI/2}),
      r('f-dress-bath','Master dress / bath',15.25,0.75,7.25,14,'7′3″ × 14′','bath',[door('w',8.6),win('n',1.5,3,5)],{furniture:'bath',note:'The L-shaped wardrobe return is shown as a separate fitted cupboard; the labelled bathroom rectangle retains its written dimensions.'}),
      r('f-child','Child bedroom',25,0.75,13,14,'13′ × 14′','bedroom',[door('s',0.6),win('e',3,7.5)],{furniture:'bed'}),
      r('f-child-bath','Child bathroom',30,15.25,8,8,'8′ × 8′','bath',[door('n',0.8,2.5),win('e',4.5,2,5)],{furniture:'bath'}),
      r('f-living','Family living',12.583,15.5,16.25,17.625,'16′3″ × 17′7½″','living',[door('s',0.3,4.5)],{noWalls:true,furniture:'lounge',note:'Living dimension includes the open-kitchen edge. Its rear-left corner is clipped by the master suite, following the source topology.',clip:[[15.25,15.5],[29.5,15.5],[29.5,23.75],[29.167,23.75],[29.167,33.125],[12.583,33.125],[12.583,20.25],[15.25,20.25]]}),
      r('f-office','Office',29.667,23.75,8.333,9.875,'8′4″ × 9′10½″','office',[door('s',4.5),win('e',2.2,5.4)],{furniture:'office',note:'Fraction after 4 in is soft in the photo; 8 ft 4 in is provisional.'}),
      r('f-bbq','Barbecue terrace',0.75,20.25,10.5,28.625,'10′6″ × 28′7½″','outdoor',[door('e',13.3,3.5)],{noWalls:true,furniture:'bbq'}),
      r('f-cross-hall','Upper passage',12,34.125,26,5,'5′ wide','circulation',[],{noWalls:true,note:'Length inferred between side boundaries; width is printed.'}),
      r('f-side-hall','Gallery passage',12,39.625,4.5,12.625,'4′6″ wide','circulation',[],{noWalls:true,note:'Length inferred beside the stair void.'}),
      r('f-guest','Guest bedroom',0.75,52.75,15,15,'15′ × 15′','bedroom',[door('e',0.7),win('s',2,10)],{furniture:'bed',bedRotation:Math.PI/2,note:'Rear wardrobe recess extends 3 ft into the transition above the terrace, matching the drawing; 15 × 15 ft is the clear principal bedroom.'}),
      r('f-bridge','Bridge',16.25,52.125,8.25,3.5,'3′6″ wide','circulation',[],{noWalls:true,note:'Length inferred over the entrance; width is printed.'}),
      r('f-front-pass','Front passage',24.75,52.125,4.625,8.875,'4′7½″ wide','circulation',[door('s',0.5,3)],{noWalls:true,note:'Length inferred alongside the guest bathroom.'}),
      r('f-guest-bath','Guest bathroom',29.875,52.75,9.5,8,'9′6″ × 8′','bath',[door('w',3,2.5),win('s',2.5,5,5)],{furniture:'bath'}),
      r('f-terrace','Front terrace',25,61.5,19.125,8.25,'8′3″ wide','outdoor',[],{noWalls:true,note:'Depth 8 ft 3 in is printed; width and the east return are inferred from the porch and side boundary.'}),
    ],courts:[],
  },
];

// Supplemental enclosure segments use wall centre lines. Open-plan rooms deliberately
// omit selected partitions; these segments restore the actual irregular perimeter.
export const EXTRA_WALLS = {
  basement: [
    {a:[-4,12],b:[-4,59.5],height:10}, {a:[-4,12],b:[2.5,12]},
    {a:[41.625,23.5],b:[41.625,47.5]}, {a:[38.5,10],b:[38.5,23.5], openings:[{at:4.5,width:7,sill:3,head:7.5,kind:'window'}]},
    {a:[32.5,40.375],b:[39,40.375],openings:[{at:1,width:4,sill:0,head:9,kind:'opening'}]},
  ],
  ground:[
    {a:[16,39.375],b:[38.5,39.375],openings:[{at:0.75,width:4.5,sill:0,head:7,kind:'door'}]},
    {a:[38.5,39.375],b:[38.5,51.875]},
    {a:[23.75,51.875],b:[38.5,51.875]},
  ],
  first:[
    {a:[24.75,0.5],b:[24.75,14.75]}, {a:[22.75,0.5],b:[24.75,0.5]},
    {a:[15,15],b:[25,15],openings:[{at:8.3,width:1.7,sill:0,head:10,kind:'opening'}]},
    {a:[12.333,33.625],b:[29.417,33.625],openings:[{at:0.8,width:4.5,sill:0,head:7,kind:'door'}]},
    {a:[11.5,20],b:[11.5,49.125],openings:[{at:13.5,width:3.5,sill:0,head:7,kind:'door'}]},
    {a:[38.5,33.875],b:[38.5,52.5],openings:[{at:4,width:7,sill:3,head:7.5,kind:'window'}]},
    {a:[0.5,49.125],b:[11.5,49.125]}, {a:[0.5,49.125],b:[0.5,52.5]},
    {a:[0.5,52.5],b:[15.5,52.5],openings:[{at:11.1,width:3.4,sill:0,head:10,kind:'opening'}]},
  ],
};

export const ASSUMPTIONS = [
  ['Scale & plot','Room labels set the scale. The 90 ft depth is printed; 50 ft plot width is provisional. The 27 ft lawn and apparent 32 ft driveway labels cannot both fit this assumed width. The lawn retains 27 × 17 ft; driveway and boundary geometry remain provisional.'],
  ['Heights & structure','10 ft clear walls, 9 in slabs, 10 ft 9 in storeys. Exterior thickness is nominally 9 in, partitions 6 in. No structural or elevation drawings were supplied.'],
  ['Stairs & alignment','One shared L-shaped stair core connects all three levels. 22 risers and 3 ft 6 in flight width are assumed. Two exterior access stairs connect sunken courts.'],
  ['Doors & glazing','Locations follow the visible plan openings. Typical door: 3 × 7 ft; bathroom: 2 ft 6 in wide. Window heights and most widths are provisional.'],
  ['Irregular spaces','First-floor living has a clipped corner. Circulation, small entrance voids, wardrobe recesses and terrace returns use source proportions and shared alignment. Amber room flags explain local uncertainties.'],
  ['Materials & furnishings','Finishes, furnishings, facade appearance, roof and landscape are illustrative placeholders. The photographs do not define them.'],
];

export const getFloor = id => FLOORS.find(f => f.id === id) || FLOORS[1];
export const roomPolygon = room => room.clip || poly(room.x,room.z,room.w,room.d);
export const ALL_ROOMS = FLOORS.flatMap(f => f.rooms.map(r => ({...r, floorId:f.id})));
