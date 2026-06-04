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

  { id:13, name:"Rappahannock River Trail", cat:"Trail", hood:"Riverfront", color:"#2a7a8a",
    rating:0, reviews:0, open:true, until:"Dusk", status:"auto",
    coords:[38.2968,-77.4568],
    about:"A paved multi-use trail running along the Rappahannock River with views of the historic rail bridge. Popular with cyclists, runners, and walkers.",
    addr:"Sophia St riverfront", phone:"", web:"",
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
