// ---------------------------------------------------------------------------
// Fredericksburg local business directory — shared data & helpers
// ---------------------------------------------------------------------------

export const stars  = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
export const tone   = c => `radial-gradient(circle at 32% 26%, rgba(255,255,255,.26), rgba(0,0,0,.16)), ${c}`;
export const MAP_EMBED = "https://www.openstreetmap.org/export/embed.html?bbox=-77.4720%2C38.2940%2C-77.4470%2C38.3120&layer=mapnik&marker=38.3030%2C-77.4595";
export const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const monthDay = iso => { const p=(iso||"").split("-"); return p.length===3?{m:MO[+p[1]-1]||"",d:+p[2]}:{m:"",d:""}; };
export const fmtDate  = iso => { const {m,d}=monthDay(iso); return m?`${m} ${d}`:""; };
export const fmtLong  = iso => iso ? new Date(iso+"T00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "";
export const nextMonthISO = () => { const x=new Date(); x.setMonth(x.getMonth()+1); return x.toISOString().slice(0,10); };
export const fmtCard  = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
export const fmtExp   = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };
export const initials = n => n.split(" ").filter(w=>/[A-Za-z]/.test(w[0])).slice(0,2).map(w=>w[0]).join("");
export const KINDS    = ["% off","$ off","BOGO","Free item","Other"];

export const REVIEWS = [
  {n:"Dana R.",  c:"#5a6b7a", s:5, dt:"2 weeks ago", t:"Favorite spot downtown. Staff remember your order and the patio is perfect in the morning."},
  {n:"Marcus T.",c:"#7a5230", s:4, dt:"1 month ago",  t:"Solid every time. Gets busy on weekends but the line moves fast."},
  {n:"Priya N.", c:"#3f6b4a", s:5, dt:"1 month ago",  t:"Best pour-over in the area, and they actually know their beans. Highly recommend."},
];

export const DATA = [
  { id:1, name:"Caroline Street Coffee", cat:"Coffee & Tea", hood:"Downtown", color:"#7a5230",
    rating:4.8, reviews:214, open:true, until:"6:00 PM", status:"claimed",
    coords:[38.3013,-77.4607],
    about:"A small-batch roastery in a restored storefront on lower Caroline Street. Single-origin pour-overs, espresso, and pastries baked in-house each morning. Back patio open seasonally.",
    addr:"912 Caroline St", phone:"(540) 555-0142", web:"carolinestcoffee.com",
    hours:[["Mon","6:30 AM – 6:00 PM"],["Tue","6:30 AM – 6:00 PM"],["Wed","6:30 AM – 6:00 PM"],["Thu","6:30 AM – 6:00 PM"],["Fri","6:30 AM – 6:00 PM"],["Sat","7:00 AM – 5:00 PM"],["Sun","7:00 AM – 5:00 PM"]], todayIdx:2,
    offers:[{kind:"BOGO",title:"Buy one espresso drink, get one free",details:"Weekdays before 9:00 AM. Show your phone at the counter.",expires:"2026-08-31"},{kind:"$ off",title:"$2 off any pour-over",details:"First visit only.",expires:""}],
    events:[{title:"Latte art throwdown",date:"2026-06-14",time:"7:00 PM",desc:"Watch local baristas compete for the title."},{title:"Local roasters tasting",date:"2026-06-28",time:"2:00 PM",desc:""}],
    sub:{active:true,brand:"Visa",last4:"4242",since:"2025-09-03",renews:"2026-07-03"} },

  { id:2, name:"Hyperion Antiques", cat:"Antiques", hood:"Downtown", color:"#5a6b7a",
    rating:4.5, reviews:96, open:true, until:"6:00 PM", status:"claimed",
    coords:[38.3022,-77.4614],
    about:"Three floors of estate furniture, jewelry, and curiosities. A Caroline Street fixture for over forty years.",
    addr:"608 Caroline St", phone:"(540) 555-0188", web:"hyperionantiques.com",
    hours:[["Mon","Closed"],["Tue","10:00 AM – 6:00 PM"],["Wed","10:00 AM – 6:00 PM"],["Thu","10:00 AM – 6:00 PM"],["Fri","10:00 AM – 6:00 PM"],["Sat","10:00 AM – 6:00 PM"],["Sun","12:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[{kind:"% off",title:"15% off any single item",details:"Excludes appraised pieces over $500.",expires:"2026-07-15"}],
    events:[{title:"Independence Day estate sale",date:"2026-07-04",time:"9:00 AM",desc:""}],
    sub:{active:true,brand:"Mastercard",last4:"5318",since:"2025-11-20",renews:"2026-06-20"} },

  { id:3, name:"Battlefield Brewing Co.", cat:"Brewery", hood:"Route 1 Corridor", color:"#3f6b4a",
    rating:4.7, reviews:331, open:false, until:"3:00 PM", status:"claimed",
    coords:[38.2748,-77.4558],
    about:"Taproom and beer garden pouring small-batch ales brewed on site. Rotating food trucks most evenings.",
    addr:"1495 Emancipation Hwy", phone:"(540) 555-0223", web:"battlefieldbrewing.com",
    hours:[["Mon","Closed"],["Tue","Closed"],["Wed","3:00 PM – 10:00 PM"],["Thu","3:00 PM – 10:00 PM"],["Fri","3:00 PM – 11:00 PM"],["Sat","12:00 PM – 11:00 PM"],["Sun","12:00 PM – 8:00 PM"]], todayIdx:2,
    offers:[{kind:"Other",title:"$5 house pints, 3–5 PM daily",details:"Dine-in only.",expires:""}],
    events:[{title:"Bluegrass + food truck night",date:"2026-06-20",time:"6:00 PM",desc:""},{title:"Trivia night",date:"2026-06-21",time:"7:30 PM",desc:""}],
    sub:{active:true,brand:"Visa",last4:"1187",since:"2025-07-01",renews:"2026-07-01"} },

  { id:4, name:"The Bavarian Chef", cat:"Restaurant", hood:"Downtown", color:"#8a4b3a",
    rating:4.4, reviews:158, open:true, until:"9:00 PM", status:"auto",
    coords:[38.3002,-77.4589],
    addr:"414 William St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:5, name:"Riverby Books", cat:"Bookstore", hood:"Downtown", color:"#6a5a8a",
    rating:4.9, reviews:142, open:true, until:"7:00 PM", status:"auto",
    coords:[38.3016,-77.4609],
    addr:"805 Caroline St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:6, name:"Sunken Well Tavern", cat:"Restaurant", hood:"College Heights", color:"#996b35",
    rating:4.6, reviews:287, open:true, until:"10:00 PM", status:"auto",
    coords:[38.2993,-77.4583],
    addr:"720 Littlepage St", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:7, name:"Rappahannock River Plumbing", cat:"Services", hood:"Fredericksburg", color:"#4a6b7a",
    rating:4.7, reviews:89, open:true, until:"5:00 PM", status:"auto",
    coords:null,
    addr:"Service area: all of Fredericksburg", phone:"", web:"", about:"", hours:[], offers:[], events:[] },

  { id:10, name:"Central Rappahannock Library", cat:"Library", hood:"Downtown", color:"#3a6b8a",
    rating:0, reviews:0, open:true, until:"9:00 PM", status:"auto",
    coords:[38.3048,-77.4622],
    about:"The main branch of the Central Rappahannock Regional Library, serving Fredericksburg since 1954. Free Wi-Fi, community meeting rooms, and a local history collection.",
    addr:"1201 Caroline St", phone:"(540) 372-1144", web:"librarypoint.org",
    hours:[["Mon","10:00 AM – 9:00 PM"],["Tue","10:00 AM – 9:00 PM"],["Wed","10:00 AM – 9:00 PM"],["Thu","10:00 AM – 9:00 PM"],["Fri","10:00 AM – 6:00 PM"],["Sat","10:00 AM – 5:00 PM"],["Sun","1:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[], events:[] },

  { id:11, name:"Fredericksburg VRE & Amtrak Station", cat:"Transit", hood:"Downtown", color:"#5a5a7a",
    rating:0, reviews:0, open:true, until:"10:00 PM", status:"auto",
    coords:[38.2986,-77.4602],
    about:"Fredericksburg's commuter rail and intercity Amtrak station. VRE service to DC and Amtrak on the Northeast Regional and Silver Service routes.",
    addr:"200 Lafayette Blvd", phone:"", web:"vre.org",
    hours:[["Mon–Fri","First train ~5:15 AM"],["Sat–Sun","Amtrak only"]], todayIdx:0,
    offers:[], events:[] },

  { id:12, name:"Hurkamp Park", cat:"Park", hood:"Downtown", color:"#3f6b4a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.3038,-77.4617],
    about:"A small public green in the heart of downtown, bordered by William and Princess Anne Streets. Host to the Fredericksburg Farmers Market on Saturdays.",
    addr:"200 William St", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[{title:"Farmers Market",date:"2026-06-07",time:"8:00 AM",desc:"Every Saturday, year-round."}] },

  { id:13, name:"Virginia Central Railway Trail", cat:"Trail", hood:"Route 1 Corridor", color:"#2a7a8a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.2927,-77.4655],
    about:"A paved multi-use trail following the former Virginia Central Railway corridor from downtown Fredericksburg westward. Open to cyclists, joggers, and walkers.",
    addr:"Virginia Central Railway Trail", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[] },

  { id:20, name:"Heritage Trail", cat:"Trail", hood:"Northwest Fredericksburg", color:"#3a7a5a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.3162,-77.4800],
    about:"A paved multi-use trail winding through the northwest side of Fredericksburg, connecting neighborhoods and parks. Popular with cyclists and pedestrians.",
    addr:"Heritage Trail, Fredericksburg", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[] },

  { id:21, name:"Belmont-Ferry Farm Trail", cat:"Trail", hood:"Riverside", color:"#5a7a3a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.3140,-77.4590],
    about:"A paved bicycle and pedestrian path connecting the Belmont area with Ferry Farm, crossing varied terrain along the Rappahannock. Shared with cyclists and walkers.",
    addr:"Belmont-Ferry Farm Trail", phone:"", web:"",
    hours:[["Daily","Dawn – Dusk"]], todayIdx:0,
    offers:[], events:[] },

  { id:14, name:"Kenmore Plantation", cat:"Historic Site", hood:"Washington Ave", color:"#8a6b4a",
    rating:0, reviews:0, open:true, until:"5:00 PM", status:"auto",
    coords:[38.3044,-77.4636],
    about:"The 18th-century home of Fielding Lewis and Betty Washington Lewis, sister of George Washington. A National Historic Landmark offering tours and living-history programs.",
    addr:"1201 Washington Ave", phone:"(540) 373-3381", web:"kenmore.org",
    hours:[["Mon","Closed"],["Tue","10:00 AM – 5:00 PM"],["Wed","10:00 AM – 5:00 PM"],["Thu","10:00 AM – 5:00 PM"],["Fri","10:00 AM – 5:00 PM"],["Sat","10:00 AM – 5:00 PM"],["Sun","12:00 PM – 5:00 PM"]], todayIdx:2,
    offers:[], events:[] },
];

export const CATS = ["All","Restaurant","Coffee & Tea","Brewery","Antiques","Bookstore","Services","Library","Transit","Park","Trail","Historic Site"];
export const PLACE_CATS = new Set(["Library","Transit","Park","Trail","Historic Site"]);

// Trail IDs rendered as line paths on the map (not pins)
export const TRAIL_PATH_IDS = new Set([13, 20, 21]);

// GeoJSON path geometries for trails — coordinates from OpenStreetMap
export const TRAIL_PATHS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 13, name: 'Virginia Central Railway Trail', kind: 'multi-use', color: '#2a7a8a' },
      geometry: {
        type: 'LineString',
        coordinates: [
          // OSM way 251437423
          [-77.4605364,38.2965686],[-77.4605121,38.2965383],[-77.4603260,38.2963643],[-77.4604929,38.2962055],[-77.4607870,38.2960384],[-77.4610184,38.2958623],[-77.4613265,38.2957192],[-77.4614037,38.2956805],[-77.4619050,38.2953325],[-77.4621023,38.2951945],[-77.4622861,38.2950578],[-77.4632040,38.2943937],[-77.4640580,38.2937764],[-77.4645871,38.2933952],[-77.4652666,38.2929037],[-77.4655203,38.2927053],
          // OSM way 855192232
          [-77.4655922,38.2926508],[-77.4659470,38.2923486],[-77.4662534,38.2921249],[-77.4666204,38.2918573],[-77.4668246,38.2917120],[-77.4670948,38.2915285],[-77.4673233,38.2913607],[-77.4674428,38.2912708],[-77.4680141,38.2909213],[-77.4681818,38.2908459],[-77.4684814,38.2907766],[-77.4686642,38.2906963],[-77.4688665,38.2906416],[-77.4690559,38.2906389],[-77.4692712,38.2906852],[-77.4695230,38.2907249],[-77.4698235,38.2908508],[-77.4700213,38.2909467],
          // OSM way 633128627
          [-77.4743483,38.2898945],[-77.4744154,38.2899215],[-77.4746428,38.2901085],[-77.4748812,38.2902504],[-77.4750617,38.2902917],[-77.4756724,38.2903457],[-77.4762107,38.2903955],[-77.4766773,38.2904107],[-77.4772037,38.2903510],[-77.4775334,38.2902843],[-77.4778108,38.2902071],[-77.4782415,38.2901357],[-77.4784724,38.2900187],[-77.4786534,38.2899016],[-77.4790848,38.2896930],[-77.4806434,38.2887892],[-77.4817983,38.2881238],[-77.4821236,38.2879126],[-77.4824055,38.2877325],[-77.4828291,38.2875060],[-77.4831478,38.2873440],[-77.4835121,38.2872119],[-77.4839719,38.2870534],[-77.4845946,38.2869213],[-77.4853289,38.2867841],[-77.4865101,38.2866094],[-77.4871088,38.2865253],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 20, name: 'Heritage Trail', kind: 'multi-use', color: '#3a7a5a' },
      geometry: {
        type: 'LineString',
        coordinates: [
          // OSM way 792166160
          [-77.4859728,38.3167693],[-77.4858264,38.3167680],[-77.4854872,38.3167613],[-77.4851793,38.3167402],[-77.4849884,38.3167373],[-77.4845661,38.3167367],[-77.4840752,38.3167323],[-77.4838300,38.3167246],[-77.4836317,38.3167042],[-77.4834094,38.3166837],[-77.4830737,38.3165454],[-77.4828411,38.3164959],[-77.4826658,38.3164209],[-77.4824138,38.3163532],[-77.4822497,38.3163421],[-77.4820864,38.3163256],[-77.4818917,38.3162588],[-77.4816786,38.3162302],[-77.4814551,38.3162440],[-77.4811225,38.3162119],[-77.4809933,38.3162098],[-77.4808202,38.3162259],[-77.4805420,38.3162056],
          // OSM way 1003271412
          [-77.4800593,38.3162608],[-77.4795662,38.3163169],[-77.4793089,38.3163036],[-77.4791690,38.3162875],[-77.4789980,38.3163074],[-77.4788205,38.3164091],[-77.4785696,38.3166426],[-77.4783844,38.3167593],[-77.4781636,38.3169028],[-77.4779534,38.3171983],[-77.4777788,38.3173705],[-77.4776344,38.3175345],[-77.4775726,38.3178277],[-77.4773571,38.3181831],[-77.4771886,38.3184611],[-77.4769879,38.3187697],[-77.4768604,38.3189097],[-77.4766968,38.3190623],[-77.4765533,38.3191714],[-77.4763572,38.3192920],[-77.4761706,38.3193837],[-77.4758221,38.3195331],[-77.4755297,38.3196253],[-77.4752741,38.3196503],[-77.4749314,38.3196845],[-77.4746920,38.3196818],[-77.4744302,38.3196612],[-77.4741867,38.3196166],[-77.4739176,38.3195557],[-77.4736205,38.3194757],[-77.4733733,38.3194329],[-77.4730583,38.3194150],[-77.4728395,38.3194153],[-77.4725759,38.3193891],[-77.4722349,38.3193407],[-77.4720239,38.3193091],[-77.4716370,38.3192766],[-77.4714309,38.3191972],[-77.4711374,38.3190719],[-77.4709079,38.3189530],[-77.4706102,38.3187259],[-77.4704431,38.3185376],[-77.4702552,38.3182570],[-77.4701185,38.3180776],[-77.4699028,38.3179045],[-77.4698106,38.3178146],[-77.4697642,38.3177284],
          // OSM way 855539304
          [-77.4697496,38.3176667],[-77.4696848,38.3175057],[-77.4695253,38.3173426],[-77.4693370,38.3172120],[-77.4692513,38.3171305],[-77.4691892,38.3170237],[-77.4691581,38.3169266],[-77.4691175,38.3168162],[-77.4690805,38.3167700],[-77.4690002,38.3167030],[-77.4689272,38.3166440],[-77.4688446,38.3165580],[-77.4687467,38.3163990],[-77.4684956,38.3160768],[-77.4683397,38.3158753],[-77.4683796,38.3157956],[-77.4684097,38.3157354],[-77.4683145,38.3156051],[-77.4681916,38.3154607],[-77.4681284,38.3153847],[-77.4680474,38.3152878],[-77.4679938,38.3152073],[-77.4677173,38.3149064],[-77.4676668,38.3147823],[-77.4674923,38.3145942],[-77.4673654,38.3144798],[-77.4671209,38.3142464],[-77.4668946,38.3139768],[-77.4666541,38.3137027],[-77.4664425,38.3134482],[-77.4661496,38.3131312],[-77.4657600,38.3127391],[-77.4655875,38.3125650],[-77.4654193,38.3123863],[-77.4653704,38.3123311],[-77.4654754,38.3121627],[-77.4655473,38.3121603],[-77.4656766,38.3121672],[-77.4657641,38.3117730],[-77.4658377,38.3116645],[-77.4658665,38.3115933],[-77.4658686,38.3114805],[-77.4658318,38.3113937],[-77.4657141,38.3112243],[-77.4656338,38.3111120],[-77.4656501,38.3111023],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 21, name: 'Belmont-Ferry Farm Trail', kind: 'multi-use', color: '#5a7a3a' },
      geometry: {
        type: 'LineString',
        coordinates: [
          // OSM way 20510755 (reversed, south end first)
          [-77.4586276,38.3093190],[-77.4585886,38.3093450],[-77.4585623,38.3093813],[-77.4586111,38.3094652],[-77.4591716,38.3100104],[-77.4592449,38.3101385],[-77.4592690,38.3102620],[-77.4593207,38.3104090],[-77.4594538,38.3105992],[-77.4596133,38.3107598],[-77.4597810,38.3108720],[-77.4598650,38.3109560],[-77.4599330,38.3110480],[-77.4600350,38.3112430],[-77.4600739,38.3113518],[-77.4600736,38.3114000],[-77.4600481,38.3114544],[-77.4600092,38.3115019],[-77.4599514,38.3115377],[-77.4598741,38.3115767],[-77.4597847,38.3116033],[-77.4596882,38.3115909],
          // OSM way 354674105
          [-77.4595444,38.3115138],[-77.4594571,38.3114448],[-77.4593606,38.3113496],[-77.4592112,38.3113027],[-77.4590983,38.3113007],[-77.4587920,38.3113202],[-77.4586985,38.3112870],[-77.4585723,38.3111120],[-77.4585571,38.3109252],[-77.4584876,38.3108066],[-77.4583642,38.3107812],[-77.4583091,38.3108025],[-77.4582784,38.3108231],[-77.4582452,38.3108927],[-77.4582326,38.3110955],[-77.4582199,38.3111769],[-77.4581834,38.3112351],[-77.4581034,38.3113000],[-77.4580407,38.3113355],[-77.4579235,38.3113625],[-77.4578045,38.3114148],[-77.4577418,38.3114649],[-77.4576947,38.3115007],[-77.4576601,38.3115414],[-77.4576270,38.3116273],[-77.4576271,38.3117123],[-77.4576580,38.3117753],[-77.4577166,38.3118347],[-77.4580178,38.3120991],[-77.4581759,38.3122885],[-77.4582024,38.3123815],[-77.4582652,38.3126705],[-77.4583952,38.3127831],[-77.4585428,38.3128414],[-77.4586464,38.3128787],[-77.4587552,38.3129288],[-77.4589252,38.3130240],[-77.4594367,38.3134509],[-77.4598809,38.3138116],[-77.4599779,38.3139016],[-77.4602833,38.3142019],[-77.4606286,38.3145278],[-77.4612096,38.3150180],[-77.4617406,38.3155392],[-77.4619041,38.3156928],[-77.4619380,38.3158167],[-77.4618974,38.3158821],[-77.4618665,38.3159080],[-77.4617234,38.3159308],[-77.4615650,38.3159079],[-77.4610538,38.3159256],[-77.4607164,38.3159440],[-77.4603311,38.3158994],[-77.4598240,38.3158198],[-77.4594933,38.3157893],[-77.4592178,38.3157583],[-77.4588923,38.3156923],[-77.4587006,38.3156813],[-77.4585189,38.3157182],[-77.4583737,38.3157606],[-77.4581440,38.3157864],[-77.4579830,38.3157524],[-77.4578461,38.3156731],[-77.4577187,38.3155401],[-77.4575081,38.3151652],[-77.4573261,38.3149130],[-77.4570631,38.3145477],[-77.4567749,38.3141374],[-77.4566008,38.3140754],[-77.4565434,38.3140865],[-77.4564524,38.3141587],[-77.4564264,38.3143002],[-77.4564588,38.3144803],[-77.4566101,38.3147564],[-77.4568729,38.3150541],[-77.4568839,38.3154565],[-77.4569244,38.3156399],[-77.4569904,38.3158655],[-77.4570892,38.3159926],[-77.4571968,38.3162572],[-77.4572379,38.3164014],[-77.4573176,38.3166588],[-77.4573751,38.3167548],[-77.4574903,38.3168820],[-77.4575041,38.3170130],[-77.4574700,38.3172635],[-77.4575258,38.3174003],[-77.4575484,38.3177000],[-77.4577164,38.3178732],[-77.4579656,38.3183990],[-77.4580356,38.3184974],[-77.4581626,38.3186209],
        ],
      },
    },
  ],
};
