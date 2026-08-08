import React, { useState, useEffect, useMemo, useRef } from "react";

/* ==========================================================
   HAPPIEST PLACE ON EARTH — styled after the Disneyland app
   ========================================================== */

const C = {
  blue: "#0578BE",
  blueDeep: "#0A62A0",
  blueTint: "#E4F1FA",
  navy: "#12283F",
  text: "#1B3A5C",
  grey: "#5E7186",
  greyLt: "#8FA1B3",
  border: "#CBDDEA",
  rule: "#E9EFF3",
  gap: "#EDF2F5",
  white: "#FFFFFF",
  pink: "#E5397F",
  amber: "#F0A02A",
  green: "#2FA84F",
  red: "#D64541",
  shadow: "0 1px 3px rgba(18,40,63,.16), 0 4px 12px rgba(18,40,63,.10)",
};
const F = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ---------------- game model (unchanged) ---------------- */
const DL_RAW = [
  ["railroad", "Main Street Station", "Main Street", "train", "B", 0, 10, 0, 0, 0, 0, 581, 837],
  ["rr_nos", "New Orleans Square Station", "New Orleans Sq.", "train", "B", 0, 10, 0, 0, 0, 0, 227, 688],
  ["rr_toon", "Toontown Depot", "Toontown", "train", "B", 0, 10, 0, 0, 0, 0, 621, 164],
  ["rr_tom", "Tomorrowland Station", "Tomorrowland", "train", "B", 0, 10, 0, 0, 0, 0, 943, 497],
  ["cinema", "Main Street Cinema", "Main Street", "show", "A", 10, 0, 4, 2, 0, 0, 589, 753],
  ["jolly", "Jolly Holiday Bakery", "Main Street", "dine", "—", 25, 12, 9, 10, 30, 16, 531, 606],
  ["emporium", "The Emporium", "Main Street", "shop", "—", 15, 0, 12, -2, 0, 48, 599, 802],
  ["parade", "Electrical Parade", "Main Street", "night", "E", 25, 20, 18, -2, 0, 0, 578, 581],
  ["fireworks", "Fireworks over the Castle", "Central Plaza", "night", "E", 25, 30, 28, -4, 0, 0, 582, 438],

  ["indy", "Indiana Jones Adventure", "Adventureland", "ride", "E", 5, 45, 20, -8, 0, 0, 426, 664],
  ["jungle", "Jungle Cruise", "Adventureland", "ride", "D", 12, 35, 13, -3, 0, 0, 461, 647],
  ["treehouse", "Adventureland Treehouse", "Adventureland", "ride", "B", 12, 5, 7, -6, 0, 0, 395, 657],
  ["tiki", "Enchanted Tiki Room", "Adventureland", "show", "B", 17, 10, 9, 8, 0, 0, 505, 597],
  ["bengal", "Bengal Barbecue", "Adventureland", "dine", "—", 20, 10, 10, 8, 28, 14, 429, 630],

  ["pirates", "Pirates of the Caribbean", "New Orleans Sq.", "ride", "D", 15, 30, 16, 2, 0, 0, 362, 652],
  ["mansion", "Haunted Mansion", "New Orleans Sq.", "ride", "D", 12, 38, 16, 0, 0, 0, 199, 603],
  ["bayou", "Blue Bayou Restaurant", "New Orleans Sq.", "dine", "—", 75, 20, 26, 25, 55, 72, 337, 692],
  ["julep", "Mint Julep Bar", "New Orleans Sq.", "dine", "—", 12, 12, 12, 4, 20, 11, 256, 683],
  ["tianas", "Tiana's Palace", "New Orleans Sq.", "dine", "—", 35, 18, 17, 14, 40, 26, 262, 665],

  ["tiana", "Tiana's Bayou Adventure", "Bayou Country", "ride", "E", 12, 53, 19, -6, 0, 0, 143, 524],
  ["pooh", "Winnie the Pooh", "Bayou Country", "ride", "C", 5, 12, 7, 2, 0, 0, 163, 496],
  ["bear", "Hungry Bear Restaurant", "Bayou Country", "dine", "—", 25, 12, 11, 10, 30, 19, 156, 475],

  ["rise", "Rise of the Resistance", "Galaxy's Edge", "ride", "E", 18, 64, 24, -10, 0, 0, 116, 282],
  ["falcon", "Smugglers Run", "Galaxy's Edge", "ride", "E", 8, 36, 16, -4, 0, 0, 291, 151],
  ["oga", "Oga's Cantina", "Galaxy's Edge", "dine", "—", 30, 25, 18, 6, 10, 34, 349, 181],
  ["ronto", "Ronto Roasters", "Galaxy's Edge", "dine", "—", 18, 12, 10, 8, 26, 17, 283, 227],
  ["dockingbay", "Docking Bay 7 Food and Cargo", "Galaxy's Edge", "dine", "—", 30, 14, 14, 11, 34, 21, 278, 198],

  ["thunder", "Big Thunder Mountain", "Frontierland", "ride", "E", 8, 40, 18, -7, 0, 0, 422, 504],
  ["twain", "Mark Twain Riverboat", "Frontierland", "ride", "C", 18, 10, 10, 12, 0, 0, 385, 515],
  ["horseshoe", "Golden Horseshoe", "Frontierland", "dine", "—", 25, 12, 12, 8, 30, 17, 427, 562],
  ["fantasmic", "Fantasmic!", "Frontierland", "night", "E", 30, 45, 30, -8, 0, 0, 312, 568],

  ["matterhorn", "Matterhorn Bobsleds", "Fantasyland", "ride", "E", 8, 45, 16, -9, 0, 0, 709, 367],
  ["peterpan", "Peter Pan's Flight", "Fantasyland", "ride", "D", 6, 36, 14, -2, 0, 0, 595, 388],
  ["smallworld", "it's a small world", "Fantasyland", "ride", "C", 16, 15, 11, 10, 0, 0, 713, 184],
  ["alice", "Alice in Wonderland", "Fantasyland", "ride", "C", 7, 22, 9, -1, 0, 0, 647, 381],
  ["toad", "Mr. Toad's Wild Ride", "Fantasyland", "ride", "C", 4, 20, 8, -1, 0, 0, 613, 363],
  ["snow", "Snow White's Enchanted Wish", "Fantasyland", "ride", "C", 5, 18, 8, -1, 0, 0, 566, 398],
  ["teacups", "Mad Tea Party", "Fantasyland", "ride", "C", 5, 15, 9, -5, 0, 0, 665, 362],
  ["storybook", "Storybook Land Canal Boats", "Fantasyland", "ride", "B", 10, 15, 9, 6, 0, 0, 668, 330],

  ["railway", "Mickey & Minnie's Runaway Railway", "Toontown", "ride", "E", 10, 40, 19, -3, 0, 0, 647, 73],
  ["roger", "Roger Rabbit's Car Toon Spin", "Toontown", "ride", "D", 6, 25, 11, -3, 0, 0, 690, 109],
  ["gadget", "Chip 'n' Dale's GADGETcoaster", "Toontown", "ride", "B", 3, 12, 6, -2, 0, 0, 518, 108],

  // --- classic Disneyland food & treats ---
  ["corndog", "Little Red Wagon Corn Dog", "Main Street", "dine", "—", 15, 25, 15, 6, 26, 13, 629, 650],
  ["gibson", "Gibson Girl Ice Cream Parlor", "Main Street", "dine", "—", 12, 15, 11, 4, 16, 9, 562, 681],
  ["candy", "Candy Palace Candy Apple", "Main Street", "dine", "—", 8, 8, 9, 2, 12, 11, 559, 674],
  ["plazainn", "Plaza Inn Fried Chicken", "Main Street", "dine", "—", 45, 18, 20, 18, 48, 34, 637, 599],
  ["carnation", "Carnation Café", "Main Street", "dine", "—", 40, 20, 17, 16, 42, 30, 560, 704],
  ["popcorn", "Popcorn Cart", "Main Street", "dine", "—", 6, 5, 7, 2, 10, 7, 563, 801],

  ["dolewhip", "Dole Whip at Tiki Juice Bar", "Adventureland", "dine", "—", 12, 20, 17, 6, 18, 8, 504, 594],
  ["hideaway", "The Tropical Hideaway", "Adventureland", "dine", "—", 18, 12, 12, 8, 24, 14, 510, 642],
  ["monte", "Café Orleans Monte Cristo", "New Orleans Sq.", "dine", "—", 50, 22, 21, 18, 46, 38, 303, 677],
  ["chowder", "Royal Street Veranda Chowder", "New Orleans Sq.", "dine", "—", 15, 10, 12, 8, 26, 14, 346, 677],

  ["harbour", "Harbour Galley Lobster Roll", "Bayou Country", "dine", "—", 18, 12, 13, 8, 26, 18, 225, 564],

  ["rancho", "Rancho del Zocalo", "Frontierland", "dine", "—", 30, 14, 14, 12, 36, 22, 451, 509],
  ["funnel", "Stage Door Café Funnel Cake", "Frontierland", "dine", "—", 12, 12, 13, 4, 20, 11, 422, 592],
  ["turkeyleg", "Turkey Leg Cart", "Frontierland", "dine", "—", 10, 8, 13, 6, 30, 15, 378, 495],

  ["maurice", "Maurice's Treats", "Fantasyland", "dine", "—", 10, 12, 11, 4, 18, 10, 548, 513],
  ["redrose", "Red Rose Taverne", "Fantasyland", "dine", "—", 25, 15, 13, 10, 32, 20, 515, 351],
  ["edelweiss", "Edelweiss Snacks", "Fantasyland", "dine", "—", 8, 8, 10, 4, 22, 12, 737, 361],

  ["milkstand", "Blue Milk at the Milk Stand", "Galaxy's Edge", "dine", "—", 10, 16, 13, 4, 12, 9, 381, 225],

  ["pizzaplanet", "Alien Pizza Planet", "Tomorrowland", "dine", "—", 25, 14, 12, 10, 34, 19, 830, 610],
  ["daisy", "Café Daisy", "Toontown", "dine", "—", 15, 10, 9, 8, 24, 14, 612, 61],

  // --- Fantasyland classics that were missing ---
  ["dumbo", "Dumbo the Flying Elephant", "Fantasyland", "ride", "C", 2, 30, 10, -2, 0, 0, 585, 323],
  ["carrousel", "King Arthur Carrousel", "Fantasyland", "ride", "B", 3, 8, 7, 0, 0, 0, 579, 372],
  ["pinocchio", "Pinocchio's Daring Journey", "Fantasyland", "ride", "C", 4, 15, 8, -1, 0, 0, 540, 368],
  ["caseyjr", "Casey Jr. Circus Train", "Fantasyland", "ride", "B", 4, 12, 7, 2, 0, 0, 537, 326],
  ["castlewalk", "Sleeping Beauty Castle Walkthrough", "Fantasyland", "ride", "A", 8, 5, 6, -2, 0, 0, 551, 434],
  ["pixiehollow", "Pixie Hollow", "Fantasyland", "show", "A", 10, 20, 7, 0, 0, 0, 671, 492],
  ["bluey", "Bluey's Best Day Ever!", "Fantasyland", "show", "C", 25, 15, 12, 8, 0, 0, 580, 202],
  ["royaltheatre", "Royal Theatre", "Fantasyland", "show", "B", 25, 10, 11, 10, 0, 0, 515, 500],

  // --- Frontierland & Bayou Country river attractions ---
  ["columbia", "Sailing Ship Columbia", "Frontierland", "ride", "C", 15, 10, 9, 10, 0, 0, 381, 544],
  ["tomsawyer", "Pirate's Lair on Tom Sawyer Island", "Frontierland", "ride", "B", 30, 5, 9, -8, 0, 0, 310, 539],
  ["shootin", "Frontierland Shootin' Exposition", "Frontierland", "ride", "A", 6, 0, 5, -1, 0, 1, 480, 527],
  ["canoes", "Davy Crockett's Explorer Canoes", "Bayou Country", "ride", "C", 15, 20, 10, -12, 0, 0, 211, 487],

  // --- Main Street & Tomorrowland ---
  ["lincoln", "Great Moments with Mr. Lincoln", "Main Street", "show", "A", 18, 5, 7, 8, 0, 0, 620, 812],
  ["vehicles", "Main Street Vehicles", "Main Street", "ride", "A", 5, 10, 6, 3, 0, 0, 606, 817],
  ["monorail", "Disneyland Monorail", "Tomorrowland", "ride", "B", 12, 15, 8, 6, 0, 0, 885, 434],
  ["launchbay", "Star Wars Launch Bay", "Tomorrowland", "show", "B", 15, 5, 7, 2, 0, 0, 839, 528],

  // --- Toontown ---
  ["mickeyhouse", "Mickey's House and Meet Mickey", "Toontown", "show", "B", 15, 30, 11, -1, 0, 0, 550, 70],
  ["minniehouse", "Minnie's House", "Toontown", "ride", "A", 8, 15, 6, -1, 0, 0, 571, 53],
  ["goofyyard", "Goofy's How-to-Play Yard", "Toontown", "ride", "A", 12, 5, 6, -4, 0, 0, 592, 111],

  ["space", "Space Mountain", "Tomorrowland", "ride", "E", 8, 58, 21, -8, 0, 0, 790, 630],
  ["startours", "Star Tours", "Tomorrowland", "ride", "D", 12, 35, 14, -5, 0, 0, 696, 563],
  ["buzz", "Buzz Lightyear Astro Blasters", "Tomorrowland", "ride", "C", 8, 30, 10, -2, 0, 0, 719, 537],
  ["nemo", "Finding Nemo Submarines", "Tomorrowland", "ride", "C", 15, 30, 10, 4, 0, 0, 834, 452],
  ["autopia", "Autopia", "Tomorrowland", "ride", "C", 10, 35, 8, -2, 0, 0, 873, 505],
  ["orbitor", "Astro Orbitor", "Tomorrowland", "ride", "B", 5, 20, 7, -3, 0, 0, 655, 540],
  ["grill", "Galactic Grill", "Tomorrowland", "dine", "—", 20, 10, 9, 8, 28, 16, 772, 512],
];

const DCA_RAW = [
  ["carthay", "Carthay Circle Restaurant", "Buena Vista St.", "dine", "—", 70, 18, 24, 22, 52, 68, 581, 1212],
  ["trolley", "Red Car Trolley", "Buena Vista St.", "ride", "B", 8, 8, 6, 4, 0, 0, 795, 1214],
  ["fiddler", "Fiddler, Fifer & Practical Café", "Buena Vista St.", "dine", "—", 18, 10, 8, 8, 24, 13, 528, 1140],

  ["monsters", "Monsters, Inc. Mike & Sulley", "Hollywood Land", "ride", "C", 6, 20, 9, -1, 0, 0, 775, 1107],
  ["philhar", "Mickey's PhilharMagic", "Hollywood Land", "show", "C", 14, 15, 11, 8, 0, 0, 707, 1158],
  ["animation", "Animation Academy", "Hollywood Land", "show", "B", 30, 10, 12, 12, 0, 0, 737, 1198],
  ["turtletalk", "Turtle Talk with Crush", "Hollywood Land", "show", "B", 15, 15, 11, 11, 0, 0, 725, 1201],

  ["webslingers", "WEB SLINGERS", "Avengers Campus", "ride", "D", 6, 45, 14, -3, 0, 0, 630, 1307],
  ["spiderman", "The Amazing Spider-Man!", "Avengers Campus", "show", "B", 10, 12, 12, 4, 0, 0, 592, 1313],
  ["guardians", "Guardians of the Galaxy", "Avengers Campus", "ride", "E", 7, 50, 21, -9, 0, 0, 835, 1298],
  ["danceoff", "Guardians of the Galaxy: Awesome Dance Off!", "Avengers Campus", "show", "B", 15, 10, 11, 2, 0, 0, 806, 1319],
  ["pym", "Pym Test Kitchen", "Avengers Campus", "dine", "—", 25, 15, 13, 10, 32, 24, 733, 1307],

  ["racers", "Radiator Springs Racers", "Cars Land", "ride", "E", 8, 75, 25, -6, 0, 0, 630, 1558],
  ["mater", "Mater's Junkyard Jamboree", "Cars Land", "ride", "C", 4, 18, 8, -4, 0, 0, 563, 1369],
  ["luigi", "Luigi's Rollickin' Roadsters", "Cars Land", "ride", "C", 4, 18, 8, -3, 0, 0, 685, 1477],
  ["flos", "Flo's V8 Café", "Cars Land", "dine", "—", 22, 12, 11, 9, 30, 18, 570, 1486],
  ["cozy", "Cozy Cone Motel", "Cars Land", "dine", "—", 10, 8, 7, 4, 16, 11, 612, 1424],

  ["ghirardelli", "Ghirardelli Soda Fountain", "San Fransokyo", "dine", "—", 18, 14, 12, 6, 20, 15, 502, 1429],
  ["lamplight", "Lamplight Lounge", "Pixar Pier", "dine", "—", 55, 22, 20, 18, 44, 52, 347, 1512],

  ["incredicoaster", "Incredicoaster", "Pixar Pier", "ride", "E", 5, 40, 19, -9, 0, 0, 372, 1628],
  ["palaround", "Pixar Pal-A-Round", "Pixar Pier", "ride", "D", 12, 30, 13, -1, 0, 0, 201, 1530],
  ["midway", "Toy Story Midway Mania", "Pixar Pier", "ride", "D", 7, 40, 14, -2, 0, 0, 254, 1609],
  ["critter", "Jessie's Critter Carousel", "Pixar Pier", "ride", "B", 4, 10, 6, 0, 0, 0, 324, 1633],
  ["whirlwind", "Inside Out Emotional Whirlwind", "Pixar Pier", "ride", "C", 5, 15, 8, -2, 0, 0, 122, 1532],

  ["mermaid", "Little Mermaid", "Paradise Gardens", "ride", "C", 6, 12, 9, 4, 0, 0, 332, 1381],
  ["cappuccino", "Cappuccino Cart", "Paradise Gardens", "dine", "—", 8, 8, 8, 8, 12, 8, 372, 1398],
  ["skyschool", "Goofy's Sky School", "Paradise Gardens", "ride", "D", 4, 30, 10, -6, 0, 0, 103, 1378],
  ["swings", "Silly Symphony Swings", "Paradise Gardens", "ride", "C", 5, 15, 9, -3, 0, 0, 146, 1469],
  ["zephyr", "Golden Zephyr", "Paradise Gardens", "ride", "B", 4, 10, 6, -1, 0, 0, 188, 1423],
  ["jellyfish", "Jumpin' Jellyfish", "Paradise Gardens", "ride", "A", 3, 12, 5, -1, 0, 0, 148, 1410],

  ["soarin", "Soarin'", "Grizzly Peak", "ride", "E", 12, 40, 20, 2, 0, 0, 457, 1090],
  ["grizzly", "Grizzly River Run", "Grizzly Peak", "ride", "E", 8, 40, 17, -8, 0, 0, 356, 1215],
  ["redwood", "Redwood Creek Challenge Trail", "Grizzly Peak", "ride", "B", 20, 0, 8, -10, 0, 0, 279, 1299],
  ["smokejumpers", "Smokejumpers Grill", "Grizzly Peak", "dine", "—", 20, 12, 9, 8, 28, 17, 493, 1138],

  // --- California Adventure food & treats ---
  ["schmoozies", "Schmoozies Smoothies", "Hollywood Land", "dine", "—", 10, 10, 9, 6, 16, 10, 731, 1171],
  ["wieners", "Award Wieners", "Hollywood Land", "dine", "—", 15, 12, 11, 6, 26, 15, 674, 1176],
  ["jackjack", "Jack-Jack Cookie Num Nums", "Pixar Pier", "dine", "—", 8, 14, 13, 3, 16, 8, 352, 1631],
  ["snowman", "Adorable Snowman Frosted Treats", "Pixar Pier", "dine", "—", 10, 12, 12, 4, 18, 9, 401, 1540],
  ["angrydogs", "Angry Dogs", "Pixar Pier", "dine", "—", 12, 10, 10, 5, 24, 13, 192, 1578],
  ["gardengrill", "Paradise Garden Grill", "Paradise Gardens", "dine", "—", 20, 12, 12, 10, 30, 18, 50, 1410],
  ["bayside", "Bayside Brews", "Paradise Gardens", "dine", "—", 10, 8, 8, 4, 12, 11, 117, 1446],
  ["lucky", "Lucky Fortune Cookery", "San Fransokyo", "dine", "—", 18, 12, 11, 8, 26, 16, 477, 1465],
  ["trattoria", "Wine Country Trattoria", "San Fransokyo", "dine", "—", 60, 20, 20, 18, 46, 44, 450, 1350],
  ["poultry", "Poultry Palace", "Pixar Pier", "dine", "—", 14, 10, 10, 6, 26, 14, 295, 1598],

  ["auntcass", "Aunt Cass Café", "San Fransokyo", "dine", "—", 22, 12, 12, 10, 32, 18, 452, 1455],
  ["cocina", "Cocina Cucamonga Mexican Grill", "San Fransokyo", "dine", "—", 20, 12, 11, 8, 30, 17, 425, 1493],
  ["corndogcastle", "Corn Dog Castle", "Paradise Gardens", "dine", "—", 10, 12, 10, 4, 24, 13, 169, 1372],
  ["hollywoodlounge", "Hollywood Lounge", "Hollywood Land", "dine", "—", 15, 10, 9, 8, 14, 16, 822, 1112],
  ["boardwalk", "Games of the Boardwalk", "Pixar Pier", "ride", "A", 8, 5, 6, -2, 0, 10, 160, 1571],
  ["djunior", "Disney Jr. Mickey Mouse Clubhouse Live", "Hollywood Land", "show", "B", 22, 10, 9, 8, 0, 0, 652, 1205],
  ["bakery", "The Bakery Tour", "San Fransokyo", "dine", "—", 15, 5, 8, 4, 14, 7, 488, 1418],

  ["woc", "World of Color", "Paradise Bay", "night", "E", 25, 45, 29, -6, 0, 0, 252, 1492],
];

// positions confirmed by hand against the real map
const REVIEWED = new Set(["alice", "auntcass", "autopia", "bakery", "bayou", "bear", "bengal", "bluey", "boardwalk", "buzz", "candy", "canoes", "carnation", "carrousel", "caseyjr", "castlewalk", "chowder", "cinema", "cocina", "columbia", "corndog", "corndogcastle", "critter", "daisy", "djunior", "dolewhip", "dumbo", "edelweiss", "falcon", "fantasmic", "fireworks", "funnel", "gadget", "gibson", "goofyyard", "grill", "guardians", "harbour", "hideaway", "hollywoodlounge", "horseshoe", "indy", "jellyfish", "jolly", "julep", "jungle", "launchbay", "lincoln", "mansion", "matterhorn", "maurice", "mickeyhouse", "milkstand", "minniehouse", "monorail", "monte", "nemo", "oga", "orbitor", "parade", "peterpan", "pinocchio", "pirates", "pixiehollow", "pizzaplanet", "plazainn", "pooh", "popcorn", "pym", "railroad", "railway", "rancho", "redrose", "rise", "roger", "ronto", "royaltheatre", "rr_nos", "rr_tom", "rr_toon", "shootin", "smallworld", "snow", "space", "startours", "storybook", "teacups", "thunder", "tiana", "tiki", "toad", "tomsawyer", "trattoria", "treehouse", "trolley", "turkeyleg", "turtletalk", "twain", "vehicles", "webslingers"]);

/* The Disneyland Railroad runs a one-way grand circle. These are the minutes
   between consecutive stops; a full loop is about twenty minutes. */
const RAIL_LOOP = ["railroad", "rr_nos", "rr_toon", "rr_tom"];
const RAIL_SEG = { railroad: 4, rr_nos: 7, rr_toon: 5, rr_tom: 4 };
const RAIL_FULL = Object.values(RAIL_SEG).reduce((a, b) => a + b, 0);   // the grand circle
function railMinutes(fromId, toId) {
  // staying aboard past your own station means riding the whole loop
  if (fromId === toId) return RAIL_FULL;
  let i = RAIL_LOOP.indexOf(fromId), mins = 0, guard = 0;
  if (i < 0 || RAIL_LOOP.indexOf(toId) < 0) return 0;
  while (RAIL_LOOP[i] !== toId && guard++ < 8) {
    mins += RAIL_SEG[RAIL_LOOP[i]];
    i = (i + 1) % RAIL_LOOP.length;
  }
  return mins;
}

/* Some queues never empty however quiet it is — the Mansion's stretch rooms and
   the big boat rides always hold a few minutes of people. */
/* Not everything is running when the rope drops — Space Mountain and Rise are
   notorious for opening late, and there is always something walled off for
   refurbishment. Both are rolled once at the start of the day. */
const LATE_OPENERS = ["space", "rise", "matterhorn", "racers", "incredicoaster", "guardians"];
const REFURB_CANDIDATES = ["mansion", "thunder", "pirates", "matterhorn", "startours", "buzz",
  "smallworld", "jungle", "monsters", "grizzly", "soarin", "midway", "luigi", "mermaid"];

const MIN_WAIT = { mansion: 13, pirates: 10, smallworld: 5, indy: 10, space: 10, racers: 15, rise: 25 };

/* Disney deliberately over-posts. A board reading 13 is often a walk-on, and a
   posted 60 is usually closer to 40 — the padding is proportionally heaviest at
   the low end. Everything the player SEES is the posted time; what they actually
   stand in is this. */
function actualWait(posted, id, t) {
  if (posted <= 0) return 0;
  const jitter = 0.88 + hash(id + "aw" + Math.floor(t / 25)) * 0.2;
  return Math.max(0, Math.round((posted * 0.7 - 5) * jitter));
}

// absolute minutes past midnight: Rise 10 PM, the river craft at dusk
const LAST_CALL = { rise: 1320, twain: 1140, columbia: 1140, tomsawyer: 1140, canoes: 1080, redwood: 1200 };

/* A few venues change over entirely in the evening — same building, different
   show. NIGHT_SWAP renames them (and can adjust what they're worth) past a
   given clock time. */
const NIGHT_SWAP = {
  djunior: { from: 1050, name: "Disney Friends Dance Party", joy: 2 },   // 5:30 PM
};

const NIGHT = {          // absolute minutes past midnight
  parade: [1180, 1280],
  fireworks: [1200, 1275],
  fantasmic: [1200, 1350],
  woc: [1180, 1320],
};

const KEYS = ["id", "name", "landName", "kind", "ticket", "dur", "wait", "joy", "en", "fuel", "cost", "x", "y"];
const build = (raw, park) =>
  raw.map((r) => {
    const o = { park };
    KEYS.forEach((k, i) => (o[k] = r[i]));
    if (NIGHT[o.id]) { o.open = NIGHT[o.id][0]; o.close = NIGHT[o.id][1]; }
    if (LAST_CALL[o.id] !== undefined) o.last = LAST_CALL[o.id];
    return o;
  });

/* Seasons change the crowd baseline, the weather range, and what's running.
   Dates from Disney's published 2026 calendar. */
const SEASONS = {
  regular:  { label: "A regular day", crowd: 1.00, warm: 0,
    blurb: "No festival, no overlay. The park as it usually is." },
  lunar:    { label: "Lunar New Year", crowd: 0.95, warm: -8,
    blurb: "Late January into February. Cool, and quieter than you'd expect.",
    booths: [["lunar1", "Lunar New Year Marketplace", "Paradise Gardens", 16, 12, 30]] },
  foodwine: { label: "Food & Wine Festival", crowd: 1.08, warm: -2,
    blurb: "March to April at California Adventure. Mild, and the food is the point.",
    booths: [["fw1", "Festival Marketplace: Coastal", "Paradise Gardens", 15, 13, 28],
             ["fw2", "Festival Marketplace: Citrus Grove", "San Fransokyo", 14, 12, 26],
             ["fw3", "Festival Marketplace: Nuts About Cheese", "Hollywood Land", 15, 14, 28]] },
  halloween:{ label: "Halloween Time", crowd: 1.18, warm: 6,
    blurb: "Late August to October. Hot, busy, and the overlays are worth it. "
         + "Oogie Boogie Bash takes over California Adventure in the evening.",
    overlay: { mansion: "Haunted Mansion Holiday", fireworks: "Halloween Screams" },
    boost: { mansion: 6, fireworks: 5 },
    /* Mission: BREAKOUT! runs its Monsters After Dark version only during the
       Bash — a different ride track, and the queue reflects it. */
    nightFrom: 1020,                                   // 5:00 PM, when the Bash starts
    nightOverlay: { guardians: { name: "Guardians of the Galaxy \u2013 Monsters After Dark", joy: 7, waitMult: 1.25 } },
    booths: [["hw1", "Plaza de la Familia Marketplace", "San Fransokyo", 14, 12, 26]],
    /* Oogie Boogie Bash is a separately ticketed evening event. These only
       exist during Halloween, and only after 5 PM. */
    extras: [
      ["oogie_trails", "Oogie Boogie Bash: Treat Trails", "Hollywood Land", "dine", 20, 14, 15, 6, 34, 0, 700, 1218],
      ["oogie_parade", "Frightfully Fun Parade", "Buena Vista St.", "night", 25, 20, 22, -2, 0, 0, 596, 1188],
      ["oogie_grove", "Villains Grove", "Grizzly Peak", "show", 18, 22, 19, 4, 0, 0, 430, 1250],
      ["oogie_mickey", "Mickey's Trick and Treat", "Hollywood Land", "show", 25, 18, 17, 8, 0, 0, 668, 1228],
    ] },
  holidays: { label: "The Holidays", crowd: 1.32, warm: -10,
    blurb: "Mid-November to early January. The busiest and the prettiest.",
    overlay: { mansion: "Haunted Mansion Holiday", smallworld: "\"it's a small world\" Holiday",
               fireworks: "Believe… in Holiday Magic" },
    boost: { mansion: 6, smallworld: 7, fireworks: 6 },
    booths: [["hol1", "Festival of Holidays Marketplace", "Paradise Gardens", 15, 13, 28]] },
};

const SEASON_FOOD = Object.entries(SEASONS).flatMap(([sk, sv]) => (sv.booths || []).map(
  ([id, name, land, dur, wait, fuel]) => ({
    id, name, landName: land, kind: "dine", ticket: "—", dur, wait,
    joy: 13, en: 6, fuel, cost: 17, x: 0, y: 0, park: "dca", season: sk,
  })));
// seasonal attractions, which unlike the booths have a place on the map and hours
const SEASON_EXTRA = Object.entries(SEASONS).flatMap(([sk, sv]) => (sv.extras || []).map(
  ([id, name, land, kind, dur, wait, joy, en, fuel, cost, x, y]) => ({
    id, name, landName: land, kind, ticket: kind === "dine" ? "—" : "B",
    dur, wait, joy, en, fuel, cost, x, y, park: "dca", season: sk,
    open: sv.nightFrom || 1020, close: 1440,
  })));
const ATTRACTIONS = [...build(DL_RAW, "dl"), ...build(DCA_RAW, "dca"), ...SEASON_FOOD, ...SEASON_EXTRA];
const byId = Object.fromEntries(ATTRACTIONS.map((a) => [a.id, a]));

const PARKS = {
  dl: { id: "dl", short: "Disneyland", name: "Disneyland Park", entry: { x: 584, y: 780 } },
  dca: { id: "dca", short: "California Adventure", name: "Disney California Adventure", entry: { x: 587, y: 985 } },
};

/* Attractions with a single rider line (Disney's own list, plus Indiana Jones
   which returned recently). Half the wait, but you skip most of the queue's
   scene-setting and get split from your group — so it pays less. */
/* Table service means a host, a menu and a real sit-down. Everything else is
   counter service, where you can take it away instead of finding a table. */
const TABLE_SERVICE = new Set([
  "bayou", "carthay", "tianas", "monte", "plazainn", "carnation",
  "lamplight", "oga", "hollywoodlounge",
]);
const isQuickService = (a) => a.kind === "dine" && !TABLE_SERVICE.has(a.id);
// a meal is one block of time; eating on the move trades the sit-down for speed
const seatedMinutes = (a) => a.wait + a.dur;
const TOGO_TIME = 0.4, TOGO_JOY = 0.6, TOGO_REST = 0.2;
// order while you walk — only works if you're far enough away to place it
const MOBILE_TIME = 0.65, MOBILE_MIN_WALK = 8;

/* Height requirements, in inches. Anything above your party's limit needs
   Rider Switch: you still ride, but one adult waits with the child and you get
   less out of it. */
const HEIGHT = {
  indy: 46, thunder: 40, matterhorn: 42, space: 40, startours: 40, rise: 40,
  falcon: 38, tiana: 40, autopia: 32, gadget: 35, skyschool: 42,
  incredicoaster: 48, racers: 40, grizzly: 42, guardians: 40, soarin: 40,
  swings: 40, jellyfish: 40, zephyr: 42, luigi: 32, mater: 32, midway: 0,
};

/* Who you're with changes which attractions are even available, how fast you
   wear out, and what you get out of things. */
const PARTY = {
  solo: { label: "On your own", limit: 99, energy: 1.0, drain: 1.0,
    thrill: 1.0, family: 0.95, show: 0.95, hunger: 1.0,
    blurb: "Move fast, ride what you like, answer to nobody." },
  partner: { label: "With a partner", limit: 99, energy: 1.0, drain: 0.95,
    thrill: 1.05, family: 1.05, show: 1.1, hunger: 1.0,
    blurb: "Everything is a bit better shared, and someone holds the bag." },
  child: { label: "With a small child", limit: 39, energy: 0.9, drain: 1.2,
    thrill: 0.9, family: 1.4, show: 1.25, hunger: 1.45,
    blurb: "Under 40 inches. The gentle stuff sings; the big rides need Rider Switch." },
  grandparents: { label: "With grandparents", limit: 99, energy: 0.8, drain: 1.3,
    thrill: 0.55, family: 1.1, show: 1.4, hunger: 1.1,
    blurb: "Slower going, more sitting down, and the shows are the point." },
};
const needsSwitch = (a, party) => (HEIGHT[a.id] || 0) > PARTY[party].limit;
const RIDER_SWITCH_JOY = 0.6;   // only half the party rides

const SINGLE_RIDER = new Set([
  "falcon", "matterhorn", "space", "indy",                       // Disneyland
  "racers", "grizzly", "incredicoaster", "skyschool", "webslingers", "soarin", // California Adventure
]);
const SINGLE_WAIT = 0.5;   // half the standby time
const SINGLE_JOY = 0.75;   // three quarters of the happiness
/* Single rider lines close when demand is too high or too low, so they are an
   opportunity to spot rather than a strategy to lean on. Stable in 45-minute
   blocks so the option does not flicker while you are looking at it. */

/* ---------------- comfort ----------------
   Heat and rain wear you down; air conditioning and a seat put it back.
   INDOOR is the properly climate-controlled stuff; WET rides are a relief in
   the heat and thoroughly unpleasant when it's already raining. */
const INDOOR = new Set([
  // Disneyland
  "pirates", "mansion", "smallworld", "peterpan", "snow", "toad", "pinocchio", "alice",
  "space", "startours", "buzz", "nemo", "indy", "tiki", "lincoln", "cinema", "rise",
  "falcon", "railway", "roger", "bluey", "launchbay", "mickeyhouse", "minniehouse",
  "oga", "dockingbay", "bayou", "monte", "tianas", "julep", "plazainn", "carnation", "gibson", "jolly", "redrose",
  "rancho", "bear", "harbour", "grill", "pizzaplanet", "daisy", "chowder",
  // California Adventure
  "guardians", "webslingers", "midway", "soarin", "monsters", "philhar", "animation",
  "turtletalk", "djunior", "lamplight", "carthay", "ghirardelli", "lucky", "bakery",
  "pym", "flos", "schmoozies", "boardwalk", "auntcass", "cocina", "hollywoodlounge",
  "trattoria",
]);
const WET = new Set(["grizzly", "tiana"]);

/* Comfort recovery is a RATE, not a lump: three minutes in Snow White should not
   restore as much as half an hour in a theatre. */
function comfortRate(a, weather, temp) {
  /* Getting soaked is a treat in real heat and grim otherwise, on a smooth
     curve rather than a threshold — being drenched at 65 degrees should not
     feel the same as being drenched at 95. Rain adds to it, because there's
     nowhere to dry off. */
  if (WET.has(a.id)) {
    const wet = Math.max(-2.6, Math.min(1.8, ((temp === undefined ? 75 : temp) - 78) / 9));
    return wet - (weather === "drizzle" ? 0.7 : 0);
  }
  if (INDOOR.has(a.id)) return 0.9;
  if (a.kind === "show") return 0.65;
  if (a.kind === "dine") return 0.5;
  if (a.kind === "train") return 0.5;
  return -0.25;                       // out in it
}

// comfort bleeds faster the hotter it actually is, and rain is its own penalty
function comfortDrain(weather, t) {
  return (weather === "drizzle" ? 0.14 : 0.07) + 0.15 * heatAt(weather, t);
}

/* Lightning Lane rosters, taken from Disney's own attraction lists.
   SINGLE Pass is bought per ride and is NOT part of Multi Pass: Rise of the
   Resistance at Disneyland, Radiator Springs Racers at California Adventure.
   Note Jungle Cruise and Pirates are not on Multi Pass, and Tiana's IS. */
const LL_OK = new Set([
  // Disneyland Park — 13
  "autopia", "thunder", "buzz", "mansion", "indy", "smallworld", "matterhorn",
  "railway", "falcon", "roger", "space", "startours", "tiana",
  // Disney California Adventure — 9
  "skyschool", "grizzly", "guardians", "incredicoaster", "mermaid",
  "monsters", "soarin", "midway", "webslingers",
]);

// bought individually, per ride, on top of everything else
const SINGLE_PASS = { rise: 25, racers: 25 };

/* A one-park ticket is exactly that. Hopping needs a paid upgrade — but as of
   2026 there's no longer a time restriction, so you can cross whenever you like. */
const HOPPER_PRICE = 65;/* ---------- clock, crowds, walking ---------- */
/* The day used to be hard-wired to 8 AM–midnight. Custom mode can move both
   ends, so the origin is a variable and every schedule below is expressed in
   ABSOLUTE minutes past midnight. M(t) converts game time to clock time. */
const OPEN = 0;
let DAY_START = 480;          // 8:00 AM
let CLOSE = 960;              // length of the day in minutes

/* California Adventure shuts hours before Disneyland — usually 9 or 10 PM
   against midnight or 1 AM. Modelling that makes the evening a real decision:
   whatever you want from DCA has to happen before it goes dark. */
let PARK_CLOSE = { dl: 1440, dca: 1320 };
const DCA_LATEST = 1320;      // 10:00 PM
const MAXW_NOTE = 2600;       // what an uploaded map gets shrunk to

const M = (t) => DAY_START + t;
function setDayWindow(startMin, endMin) {
  DAY_START = startMin;
  CLOSE = Math.max(120, endMin - startMin);
  PARK_CLOSE = { dl: endMin, dca: Math.min(endMin, DCA_LATEST) };
}
const parkOpenNow = (park, t) => M(t) <= (PARK_CLOSE[park] || CLOSE);
const HOP_MINUTES = 5;      // just the turnstile queue at the other gate — bags are already checked
const CANVAS_W = 1000;
const CANVAS_H = 1789;      // matches the stitched resort map (1560 x 2791)

function clock(t) {
  const h24 = Math.floor(M(t) / 60) % 24;
  const m = M(t) % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

/* Real hourly posted-wait shapes, from Queue-Times 2026 averages via
   mixinsomemagic.com's per-attraction breakdown. The key finding is that rides
   do NOT share one curve: Tiana's is 5 min at 8 AM and 53 by mid-afternoon,
   while Peter Pan opens at 34 and barely moves all day. Values below are a
   fraction of each ride's own afternoon peak, hourly from 8 AM to 11 PM. */
const PROFILES = {
  // huge rope-drop advantage: Tiana's, Runaway Railway, Matterhorn
  swing:  [0.18, 0.33, 0.65, 0.82, 0.92, 0.98, 1.00, 0.99, 0.93, 0.85, 0.75, 0.63, 0.50, 0.42, 0.37, 0.35],
  // busy from the moment the rope drops, easier late: Space Mountain, Indiana Jones
  thrill:  [0.60, 0.68, 0.83, 0.92, 0.98, 1.00, 0.99, 0.97, 0.94, 0.89, 0.82, 0.74, 0.66, 0.61, 0.55, 0.53],
  // genuine morning AND late-night windows: Big Thunder, Haunted Mansion, Smugglers Run
  classic: [0.33, 0.49, 0.70, 0.85, 0.94, 1.00, 1.00, 0.97, 0.92, 0.86, 0.78, 0.68, 0.58, 0.51, 0.46, 0.43],
  // opens busy and stays busy: Peter Pan, Rise of the Resistance
  flat:   [0.87, 0.89, 0.94, 1.00, 1.00, 0.98, 0.97, 0.95, 0.94, 0.92, 0.89, 0.85, 0.80, 0.74, 0.70, 0.64],
  // high capacity, gentle build: Pirates, small world, Jungle Cruise
  steady: [0.30, 0.45, 0.62, 0.78, 0.90, 0.97, 1.00, 1.00, 0.95, 0.90, 0.82, 0.72, 0.62, 0.55, 0.48, 0.42],
  // kid rides peak mid-morning as families arrive, then fade: Toad, Alice, Dumbo
  family: [0.35, 0.70, 1.00, 0.98, 0.95, 0.92, 0.92, 0.90, 0.88, 0.85, 0.80, 0.70, 0.58, 0.48, 0.40, 0.35],
};

const CURVE = {
  tiana: "swing", railway: "swing", matterhorn: "swing",
  grizzly: "swing", incredicoaster: "swing", soarin: "swing",
  space: "thrill", indy: "thrill", guardians: "thrill", racers: "thrill",
  thunder: "classic", mansion: "classic", falcon: "classic", webslingers: "classic",
  midway: "classic", startours: "classic", jungle: "classic", nemo: "classic",
  autopia: "classic", roger: "classic", skyschool: "classic",
  peterpan: "flat", rise: "flat",
  railroad: "steady", rr_nos: "steady", rr_toon: "steady", rr_tom: "steady",
  dumbo: "family", carrousel: "family", pinocchio: "family", caseyjr: "family",
  minniehouse: "family", goofyyard: "family",
  toad: "family", snow: "family", alice: "family", teacups: "family",
  storybook: "family", gadget: "family", pooh: "family", mermaid: "family",
  critter: "family", whirlwind: "family", jellyfish: "family", zephyr: "family",
  swings: "family", mater: "family", luigi: "family", monsters: "family",
};

// hourly points, linearly interpolated so waits drift rather than jump
function dayCurve(id, ticket, t) {
  const p = PROFILES[CURVE[id] || (ticket === "E" ? "thrill" : "steady")];
  const x = Math.max(0, Math.min(15, M(t) / 60 - 8));
  const i = Math.floor(x), f = x - i;
  return p[i] + (p[Math.min(15, i + 1)] - p[i]) * f;
}

// the hour a ride is typically at its shortest, for the planning hint
function bestHour(id, ticket) {
  const p = PROFILES[CURVE[id] || (ticket === "E" ? "thrill" : "steady")];
  let bi = 0;
  for (let i = 1; i < p.length; i++) if (p[i] < p[bi]) bi = i;
  const h = 8 + bi;
  return `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? "PM" : "AM"}`;
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

function singleRiderOpen(id, t) {
  if (!SINGLE_RIDER.has(id)) return false;
  return hash(id + "sr" + Math.floor(t / 45)) > 0.38;
}

function waitFor(a, t, crowd, weather, mods) {
  if (mods && mods.refurb === a.id) return -1;                       // down all day
  if (mods && mods.lateOpen && t < (mods.lateOpen[a.id] || 0)) return -1;   // not open yet
  if (mods && mods.closures && mods.closures[a.id] > t) return -1;   // temporarily closed
  if (a.kind === "night") return a.wait;
  if (!a.wait) return a.kind === "ride" ? 5 : 0;   // an operating ride never posts zero
  if (a.last !== undefined && M(t) > a.last) return 0;
  const jitter = 0.88 + hash(a.id + Math.floor(t / 20)) * 0.24;
  const wx = weather === "drizzle" ? 0.82 : weather === "hot" ? 1.04 : 1;
  // the fireworks pull people off the queues for about forty minutes
  const fw = M(t) >= 1260 && M(t) <= 1300 ? 0.9 : 1;
  const mult = mods && mods.until > t ? mods.mult : 1;
  const w = a.wait * dayCurve(a.id, a.ticket, t) * crowd * jitter * wx * fw * mult;
  /* At the moment the rope drops nobody is in a queue yet — everything is a
     walk-on. Lines build over the first forty minutes or so. This keys off the
     clock, not off t, so arriving at 3 PM gets no such gift. */
  const ramp = Math.max(0, Math.min(1, (M(t) - 480) / 40));
  const posted = Math.round((w * ramp) / 5) * 5;
  const floor = Math.round((MIN_WAIT[a.id] || 0) * ramp);
  /* The Disney app never posts zero — an open ride reads 5 minutes even when
     you'll walk straight on. actualWait() turns a posted 5 back into 0. */
  const board = Math.max(floor, posted);
  return a.kind === "ride" ? Math.max(5, board) : board;
}

/* Coordinates are measured off the real resort map, so distance is now
   geographic. The Disneyland berm spans ~752 units and is ~3,000 ft across,
   giving ~4 ft per unit; a guest covers ~250 ft/min through crowds. */
/* From about 45 minutes before a night show until it finishes, Main Street and
   the hub are effectively a wall of people. Routing through there costs real
   time — one of the most authentic frustrations of a Disneyland evening. */
const SHOW_CRUSH = [[1215, 1310], [1260, 1355]];   // parade build-up, then fireworks (absolute)
const CRUSH_LANDS = { "Main Street": 7, "Central Plaza": 7, "Fantasyland": 3, "Adventureland": 3, "Tomorrowland": 3 };
function crushPenalty(fromLand, toLand, t) {
  if (!SHOW_CRUSH.some(([a, b]) => M(t) >= a && M(t) <= b)) return 0;
  return Math.max(CRUSH_LANDS[fromLand] || 0, CRUSH_LANDS[toLand] || 0);
}

const UNITS_PER_MIN = 70;   // detour factor: real paths wind, they are not straight lines

/* Straight-line distance can't see the park's topology. Toontown is a
   cul-de-sac reached only through Fantasyland, and Galaxy's Edge has just two
   narrow entrances, so walks in or out of them take noticeably longer than the
   crow-flies distance suggests. */
const CUL_DE_SAC = { "Toontown": 3, "Galaxy's Edge": 2 };
function walkMinutes(pos, a, t) {
  const d = Math.hypot(pos.x - a.x, pos.y - a.y);
  // round once, at the end - rounding the distance first then adding a flat
  // overhead made neighbouring attractions read as 3 minutes apart
  let detour = 0;
  for (const land of Object.keys(CUL_DE_SAC)) {
    // only when crossing the boundary, not for walks inside the land
    if ((pos.landName === land) !== (a.landName === land)) detour += CUL_DE_SAC[land];
  }
  const base = Math.max(2, Math.round(d / UNITS_PER_MIN + 1.5)) + detour;
  // crossing between parks means bag check and turnstiles at the far gate
  const crush = t === undefined ? 0 : crushPenalty(pos.landName, a.landName, t);
  return base + crush + (pos.park !== a.park ? HOP_MINUTES : 0);
}

/* Temperature follows the day rather than sitting flat. Anaheim peaks around
   3 PM and is coolest before dawn, so rope drop and the last hour are the
   comfortable parts of a hot day — which is exactly how the park really feels. */
const WEATHERS = {
  clear:   { label: "Clear",   lo: 62, hi: 79 },
  hot:     { label: "Hot",     lo: 70, hi: 97 },
  drizzle: { label: "Drizzle", lo: 55, hi: 65 },
  cold:    { label: "Cold",    lo: 44, hi: 60 },   // an Anaheim winter morning is genuinely chilly
};
function tempAt(weather, t, warm) {
  const w = WEATHERS[weather] || WEATHERS.clear;
  const h = (M(t) / 60) % 24;
  const mid = (w.hi + w.lo) / 2, amp = (w.hi - w.lo) / 2;
  // a seasonal offset can stack on top, but Anaheim never actually freezes
  return Math.max(38, Math.round(mid + amp * Math.cos((2 * Math.PI * (h - 15)) / 24)) + (warm || 0));
}
// 0 when it's pleasant, 1 when it's punishing. Both ends wear you down.
function heatAt(weather, t, warm) {
  return Math.max(0, Math.min(1, (tempAt(weather, t, warm) - 76) / 22));
}
function coldAt(weather, t, warm) {
  return Math.max(0, Math.min(1, (58 - tempAt(weather, t, warm)) / 16));
}
const weatherLabel = (weather, t, warm) => `${WEATHERS[weather].label} · ${tempAt(weather, t, warm)}°`;

/* ---------------- difficulty ----------------
   Conditions are rolled from the chosen mode, and `drain` scales how fast
   energy and happiness bleed away per minute. */
const DIFFICULTY = {
  easy:   { label: "Easy",   drain: 0.85, budget: 300,
            blurb: "Clear skies, thin crowds and $300 to spend. A forgiving day." },
  medium: { label: "Medium", drain: 1.00, budget: 150,
            blurb: "Either the weather turns or the park is packed — not both. $150 to spend." },
  hard:   { label: "Hard",   drain: 1.30, budget: 75,
            blurb: "Bad weather, a packed park and only $75. Everything costs you more." },
  custom: { label: "Custom", drain: 1.00, budget: 150,
            blurb: "Set the day up however you like." },
};
/* Custom mode: every knob set by hand rather than rolled. */
const CUSTOM_DEFAULT = {
  startMin: 480, endMin: 1440,      // 8:00 AM to midnight
  crowd: 0.85, weather: "clear",
  budget: 150, unlimited: false,
  drain: 1.0, events: true,
};
/* ---------------- multi-day runs ----------------
   A single day is self-contained. A RUN chains days together: you wake up in
   whatever state you went to bed in, unspent money rolls over, and each day is
   harder than the last. Let any meter hit zero and the run is over. */
const RUN_MODES = {
  single:   { label: "One day",  days: 0,
    blurb: "A single day, scored on its own." },
  campaign: { label: "Campaign", days: 5,
    blurb: "Five days back to back. Survive all five and you've won." },
  arcade:   { label: "Arcade",   days: 0, endless: true,
    blurb: "Keep going until you burn out. How many days can you last?" },
};
/* Sleep gives some of it back, never all of it, and less the deeper into the
   run you are — the ceiling itself drops each night. Hunger goes the other way:
   you spend eight hours not eating, so you wake up emptier than you went to bed.
   Crowds are NOT part of this. How busy the park is has nothing to do with how
   many days you've been there. */
const overnight = {
  energy:  (v, d) => Math.round(Math.max(0, Math.min(100 - (d - 1) * 7, v * 0.62 + 26))),
  comfort: (v, d) => Math.round(Math.max(0, Math.min(100 - (d - 1) * 6, v * 0.58 + 28))),
  fuel:    (v) => Math.round(Math.max(0, v - 16)),
};
// cumulative fatigue: energy and comfort go faster every day. Nothing else does.
const dayFatigue = (d) => 1 + 0.14 * (d - 1);

const CROWD_CHOICES = [["Empty", 0.35], ["Light", 0.55], ["Moderate", 0.85], ["Busy", 1.15], ["Packed", 1.45]];
const BUDGET_CHOICES = [["$0", 0], ["$75", 75], ["$150", 150], ["$300", 300], ["Unlimited", 99999]];
const DRAIN_CHOICES = [["Gentle", 0.5], ["Normal", 1.0], ["Harsh", 1.4]];
// the gates never open before 8; later options are simply arriving late
const TIME_CHOICES = [["8 AM", 480], ["9 AM", 540], ["10 AM", 600], ["11 AM", 660],
                      ["Noon", 720], ["1 PM", 780], ["3 PM", 900], ["5 PM", 1020]];
// 6 PM happens on hard-ticket event days; Disneyland runs to midnight or 1 AM
const END_CHOICES = [["6 PM", 1080], ["9 PM", 1260], ["10 PM", 1320], ["Midnight", 1440], ["1 AM", 1500]];

function rollConditions(mode) {
  const bad = ["hot", "drizzle"];
  const pick = () => bad[Math.floor(Math.random() * bad.length)];

  if (mode === "easy") return { weather: "clear", crowd: 0.52 + Math.random() * 0.28 };
  if (mode === "hard") return { weather: pick(), crowd: 1.20 + Math.random() * 0.35 };
  return Math.random() < 0.5
    ? { weather: pick(), crowd: 0.78 + Math.random() * 0.27 }
    : { weather: "clear", crowd: 1.10 + Math.random() * 0.25 };
}

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
// Happiness is a running score: it has a floor but no ceiling, so a great day
// keeps climbing rather than pinning at 100.
const happy = (v) => Math.max(0, Math.round(v * 10) / 10);

/* ---------- basemap calibration ----------
   Two landmarks per park are enough to solve a similarity transform
   (uniform scale + rotation + translation) from my canonical park
   coordinates onto whatever map image you load. */
/* ---------------- coordinate frame ----------------
   THE PROBLEM THIS SOLVES

   Pin positions live in a "canonical" space; a calibration transform maps that
   space onto whatever map image you loaded. That is two coupled layers, and it
   kept breaking in two different ways:

     1. Anchors hard-coded  -> a bulk coordinate remap left them stale, and
                               recalibrating injected an 8-degree rotation.
     2. Anchors derived     -> adjusting the castle or Space Mountain moved the
                               anchors, and every saved calibration silently
                               re-solved with a 10-degree rotation.

   The fix is to stop needing two layers. FRAME_DEFAULT names where the two
   landmarks sit in canonical space. Once you "lock in" a calibration, every pin
   AND the frame itself are rewritten through the transform, so the canonical
   space becomes your map's space and the calibration collapses to the identity.
   After that nothing can shift: what you see is exactly what is stored. */
const FRAME_DEFAULT = {
  dl: [
    { label: "Sleeping Beauty Castle", hint: "the blue castle at the centre of the park", x: 551, y: 434 },
    { label: "Space Mountain", hint: "the big white ribbed dome in Tomorrowland", x: 790, y: 630 },
  ],
  dca: [
    { label: "Pixar Pal-A-Round", hint: "the Ferris wheel at Pixar Pier", x: 201, y: 1530 },
    { label: "Carthay Circle", hint: "the domed tower at the top of Buena Vista Street", x: 581, y: 1212 },
  ],
};
/* iOS keeps a home-screen web app's storage completely separate from Safari's.
   Calibrate in one and the other sees nothing and falls back to defaults, which
   draws every pin through a different transform. Detect it and say so. */
const RUNTIME = (() => {
  try {
    const ua = navigator.userAgent || "";
    const standalone = navigator.standalone === true
      || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
    if (standalone) return "Home screen app";
    if (/CriOS/.test(ua)) return "Chrome on iOS";
    if (/FxiOS/.test(ua)) return "Firefox on iOS";
    if (/EdgiOS/.test(ua)) return "Edge on iOS";
    if (/iPhone|iPad|iPod/.test(ua)) return "Safari on iOS";
    return "Browser tab";
  } catch (e) { return "Browser tab"; }
})();

const frameKey = (f) => Object.values(f).flat().map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join("|");

function solveTransform(defs, taps) {
  if (!taps || taps.length < 2) return null;
  const [P1, P2] = defs, [Q1, Q2] = taps;
  const px = P2.x - P1.x, py = P2.y - P1.y;
  const den = px * px + py * py;
  if (!den) return null;
  const qx = Q2.x - Q1.x, qy = Q2.y - Q1.y;
  const a = (qx * px + qy * py) / den;
  const b = (qy * px - qx * py) / den;
  const scale = Math.hypot(a, b);
  // two taps in the same place would collapse every pin onto one point
  if (!isFinite(scale) || scale < 1e-4) return null;
  const tx = Q1.x - (a * P1.x - b * P1.y);
  const ty = Q1.y - (b * P1.x + a * P1.y);
  if (![a, b, tx, ty].every(isFinite)) return null;
  return { a, b, tx, ty, scale };
}
const safe = (n, fallback) => (typeof n === "number" && isFinite(n) ? n : fallback);
const invT = (T, x, y) => {
  if (!T) return { x, y };
  const d = T.a * T.a + T.b * T.b;
  if (!d) return { x, y };
  const dx = x - T.tx, dy = y - T.ty;
  return { x: (T.a * dx + T.b * dy) / d, y: (-T.b * dx + T.a * dy) / d };
};
const applyT = (T, x, y) => (T ? { x: T.a * x - T.b * y + T.tx, y: T.b * x + T.a * y + T.ty } : { x, y });


/* ---------------- random events ----------------
   `when`: start = rolled once as the day begins; day = between activities.
   Effects are all optional and applied together. */
/* Events carry an optional `park`. Anything without one can happen anywhere;
   the rest only fire while you're actually standing in that park, so a Park
   Hopper day naturally sees both pools. */
const EVENTS = [
  // --- good ---
  { id: "pixie", kind: "good", when: "day", w: 10, title: "You got pixie dusted",
    text: "A cast member sprinkles a little pixie dust on you on your way past. Small thing. Made your morning.", joy: 8 },
  { id: "face", kind: "good", when: "day", w: 8, title: "A face character stopped to talk",
    text: "No line, no photographer rushing you along — just a proper conversation in character.", joy: 11, energy: -2 },
  { id: "frontrow", kind: "good", when: "day", w: 8, title: "Front row, no extra wait",
    text: "The cast member waves your group straight into the front car.", joy: 7 },
  { id: "llgift", kind: "good", when: "day", w: 6, title: "A family gave you their Lightning Lane",
    text: "They're heading out early and had one left on their pass. You'll take it.", ll: 1, joy: 4 },
  { id: "reride", kind: "good", when: "day", w: 5, title: "The ride broke down under you",
    text: "Everyone shuffles out through the service door. A cast member hands you 1 free Lightning Lane for the trouble.", ll: 1, joy: 3 },
  { id: "lull", kind: "good", when: "day", w: 8, title: "The park suddenly empties",
    text: "A tour group left and half the park went with them. Lines are unusually short for a while.",
    waitMult: 0.7, minutes: 70 },
  { id: "comped", kind: "good", when: "day", w: 5, title: "Your snack was comped",
    text: "The register wouldn't take the card, so the cast member just waved you through.", money: 14, fuel: 14, comfort: 3, joy: 5 },
  { id: "bench", kind: "good", when: "day", w: 7, title: "Perfect shady bench",
    text: "Empty, shaded, and right by a snack cart. You sit for a bit longer than planned, and buy something while you're there.",
    energy: 12, minutesLost: 10, joy: 3, comfort: 12, fuel: 10, money: -7 },
  { id: "breeze", kind: "good", when: "day", w: 6, title: "The weather turns lovely",
    text: "The heat breaks and a breeze comes through. Everything feels easier.", energy: 10, joy: 5, comfort: 20 },
  { id: "birthday", kind: "good", when: "day", w: 4, title: "Free celebration button",
    text: "City Hall hands you a button. Cast members wish you a happy day for the rest of the afternoon.", joy: 9 },

  // --- good, at the start ---
  { id: "ropedrop", kind: "good", when: "start", w: 8, title: "Perfect rope drop position",
    text: "You got to the turnstiles early and ended up at the front of the pack. The first hour is wide open.",
    waitMult: 0.45, minutes: 75 },
  { id: "hotelperk", kind: "good", when: "start", w: 6, title: "Hotel guest perk",
    text: "Staying on property gets you 1 free Lightning Lane.",
    ll: 1, joy: 6 },
  { id: "closepark", kind: "good", when: "start", w: 5, title: "Front-row parking",
    text: "You land a spot near the tram and glide straight in, legs fresh.", energy: 6, comfort: 4, joy: 3 },

  // --- bad, at the start ---
  { id: "traffic", kind: "bad", when: "start", w: 9, title: "Traffic on the 5",
    text: "Forty-five minutes of brake lights. The park has been open a while by the time you're through the gate.",
    timeShift: 45, joy: -6, energy: -4, comfort: -5 },
  { id: "parking", kind: "bad", when: "start", w: 6, title: "Parking structure chaos",
    text: "Level six, far end, and a long wait for the tram. You start the day already footsore.",
    timeShift: 25, energy: -10, comfort: -8, joy: -4 },
  { id: "underdressed", kind: "bad", when: "start", w: 5, title: "Colder than you dressed for",
    text: "You checked the forecast for a Californian theme park and packed accordingly. The morning has other ideas.",
    comfort: -16, energy: -4, joy: -3 },
  { id: "cocoa", park: "dl", kind: "good", when: "day", w: 6, title: "Hot chocolate on Main Street",
    text: "Whipped cream, a cinnamon stick, and both hands round the cup while the cold afternoon goes by.",
    comfort: 16, fuel: 8, energy: 4, money: -7, joy: 5 },
  { id: "forgot", kind: "bad", when: "start", w: 5, title: "You forgot the sunscreen",
    text: "Thirty dollars at the Emporium for the small bottle. It stings — but at least you won't burn.", money: -30, comfort: 7, joy: -4 },

  // --- bad ---
  { id: "breakdown", kind: "bad", when: "day", w: 12, title: "{ride} has gone down",
    text: "Cast members are turning people away at the entrance. No word on how long.",
    closeRide: true, minutes: 45, joy: -3, comfort: -3 },
  { id: "surge", kind: "bad", when: "day", w: 9, title: "A tour group descends",
    text: "Forty matching lanyards just walked into the land. Every queue in sight jumps.",
    waitMult: 1.3, minutes: 60, joy: -3, comfort: -5 },
  { id: "rain", kind: "bad", when: "day", w: 7, title: "Sudden downpour",
    text: "It comes down hard for a while. Lines shrink, but so does everyone's patience.",
    waitMult: 0.8, minutes: 50, energy: -8, joy: -6, comfort: -22 },
  { id: "spill", kind: "bad", when: "day", w: 7, title: "You dropped it",
    text: "The churro made it about four steps. A bird got there before you did.", money: -8, joy: -5 },
  { id: "lost", kind: "bad", when: "day", w: 5, title: "Lost something",
    text: "A trip to Lost and Found eats a chunk of the afternoon. You do get it back.",
    minutesLost: 25, energy: -5, comfort: -6, joy: -5 },
  { id: "cutline", kind: "bad", when: "day", w: 6, title: "A group cut in front of you",
    text: "Six people 'meeting friends' who were somehow already at the merge point.", joy: -6, comfort: -4 },
  { id: "blister", kind: "bad", when: "day", w: 6, title: "Your feet have had enough",
    text: "That specific hot spot on your heel has become the main character.", energy: -10, comfort: -18, joy: -4 },
  { id: "wharf", park: "dca", kind: "good", when: "day", w: 7, title: "The sourdough smells incredible",
    text: "You weren't hungry until you walked past the bakery. Now you are.",
    fuel: 12, money: -6, joy: 5, comfort: 3 },
  { id: "carsgold", park: "dca", kind: "good", when: "day", w: 6, title: "Cars Land at golden hour",
    text: "The whole of Radiator Springs lights up at once and everyone stops walking to watch.",
    joy: 12, comfort: 4 },
  { id: "seagull", park: "dca", kind: "bad", when: "day", w: 6, title: "A gull took your churro",
    text: "Straight out of your hand on Pixar Pier. It didn't even hesitate.",
    money: -8, joy: -6 },
  { id: "phone", kind: "bad", when: "day", w: 5, title: "Phone at 4%",
    text: "You'll be rationing it from here. Checking wait times suddenly feels expensive.", joy: -5 },
];


/* ---------------- breaks ----------------
   Everything here trades one resource for another. `window` limits an option
   to part of the day (minutes from 8 AM). */
const BREAKS = [
  { id: "bench", name: "Sit down for a bit", mins: 20, cost: 0, joy: -2, en: 22, fuel: 0, comfort: 10,
    desc: "Find a bench in the shade and let your feet recover." },
  { id: "water", name: "Water and shade", mins: 10, cost: 0, joy: 2, en: 8, fuel: 4, comfort: 18,
    desc: "Free cup of ice water and ten minutes out of the sun." },
  { id: "people", name: "People watching on Main Street", mins: 30, cost: 0, joy: 5, en: 14, fuel: 0, comfort: 8,
    desc: "Park yourself by the hub and watch the world go by. Costs nothing but time." },
  { id: "snack", name: "Grab a snack", mins: 10, cost: 0, joy: 0, en: 0, fuel: 0, comfort: 0,
    desc: "Something from a cart. It's never really about the hunger.",
    options: [
      { id: "churro", name: "Churro", mins: 10, cost: 7, joy: 6, en: 4, fuel: 12, comfort: 3,
        desc: "Cinnamon sugar, still warm. Non-negotiable." },
      { id: "popcorn", name: "Popcorn", mins: 8, cost: 6, joy: 5, en: 2, fuel: 10, comfort: 2,
        desc: "A box you'll carry around for the next two hours." },
      { id: "pickle", name: "Giant Pickle", mins: 5, cost: 3, joy: 4, en: 3, fuel: 14, comfort: 5,
        desc: "Cheapest thing in the park and weirdly the most filling." },
      { id: "pineapple", name: "Pineapple Spear", mins: 6, cost: 5, joy: 6, en: 5, fuel: 8, comfort: 11,
        desc: "Cold, sharp and exactly right when the heat is winning." },
      { id: "pretzel", name: "Mickey Pretzel", mins: 8, cost: 8, joy: 6, en: 3, fuel: 20, comfort: 2,
        desc: "Warm, salty, and bigger than it looks. Genuinely filling." },
      { id: "icecream", name: "Mickey Ice Cream Bar", mins: 6, cost: 7, joy: 8, en: 3, fuel: 10, comfort: 9,
        desc: "Eat it fast. The ears go first." },
    ] },
  { id: "coffee", name: "Cold brew", mins: 12, cost: 6, joy: 2, en: 14, fuel: 5, comfort: 6,
    desc: "The afternoon wall is real. This helps." },
  { id: "pins", name: "Pin trading", mins: 20, cost: 14, joy: 9, en: -2, fuel: 0, comfort: 4,
    desc: "Buy a starter pin and work the lanyards. Cast members always trade." },
  { id: "photo", name: "Find a PhotoPass spot", mins: 15, cost: 0, joy: 7, en: -2, fuel: 0, comfort: 2,
    desc: "A proper photo of everyone, for once." },
  { id: "shopping", name: "Browse the shops", mins: 35, cost: 45, joy: 14, en: 3, fuel: 0, comfort: 26,
    desc: "Air conditioning, a slow lap of the Emporium, and something you didn't plan to buy." },
  { id: "nap", name: "Mid-day break at the hotel", mins: 240, cost: 0, joy: 12, en: 95, fuel: 16, comfort: 100,
    window: [600, 1080],   // 10 AM to 6 PM, absolute
    desc: "Back to the room, feet up, an actual nap. You lose four hours of park time and come back a different person." },
  { id: "wander", name: "Wander with no plan", mins: 25, cost: 0, joy: -5, en: -5, fuel: 0, comfort: -6,
    desc: "Drift around. Pleasant for five minutes, then the day is quietly slipping away." },
];


/* Events where you actually decide something. Several are deliberately
   context-dependent rather than balanced 50/50 — the walk-up table is a bargain
   when you're starving and a waste when you've just eaten. */
const CHOICES = [
  { id: "dapperdans", park: "dl", w: 10, title: "The Dapper Dans are singing on Main Street",
    text: "Four-part harmony, straw hats, the works. A small crowd is gathering.",
    options: [
      { label: "Stop and watch", sub: "Fifteen minutes of your day", joy: 9, energy: 4, comfort: 4, minutesLost: 15 },
      { label: "Keep moving", sub: "You've somewhere to be", joy: -1, comfort: -1 },
    ] },
  { id: "paradecross", park: "dl", w: 9, title: "A parade is forming across your path",
    text: "The rope is up and cast members are holding the crossing.",
    options: [
      { label: "Wait and watch it go by", sub: "Twenty minutes", joy: 10, energy: 2, comfort: 3, minutesLost: 20 },
      { label: "Take the long way round", sub: "Faster, but it's a hike", joy: -2, energy: -11, comfort: -7, minutesLost: 10 },
    ] },
  { id: "poncho", w: 8, title: "It starts absolutely pelting down",
    text: "There are ponchos in the shop on the corner, or a covered walkway you could sit out under.",
    options: [
      { label: "Buy a poncho and carry on", sub: "$15, no time lost", money: -15, joy: -2, comfort: 8 },
      { label: "Shelter until it passes", sub: "Half an hour, but you rest", joy: -3, energy: 13, comfort: 20, minutesLost: 30, waitMult: 0.8, minutes: 40 },
    ] },
  { id: "spareLL", w: 7, title: "A stranger offers you their spare Lightning Lane",
    text: "They're heading home early and would rather someone got the use of it. It's good for 1 ride. They ask twenty dollars.",
    options: [
      { label: "Take it", sub: "$20 for one line skip", money: -20, ll: 1, joy: 3 },
      { label: "Politely decline", sub: "Keep the cash", joy: 1 },
    ] },
  { id: "heel", w: 7, title: "A hot spot on your heel is becoming a problem",
    text: "First Aid would sort it out properly. There's also moleskin in the shop right here.",
    options: [
      { label: "Go to First Aid", sub: "Twenty minutes, done properly", joy: 2, energy: 12, comfort: 16, minutesLost: 20 },
      { label: "Walk it off", sub: "This will not improve", joy: -5, energy: -10, comfort: -18 },
    ] },
  { id: "walkup", w: 7, title: "A walk-up table has opened at a sit-down restaurant",
    text: "No reservation needed. It isn't cheap and it will take a while.",
    options: [
      { label: "Take the table", sub: "$58 and an hour", money: -58, joy: 17, energy: 20, fuel: 48, comfort: 22, minutesLost: 60 },
      { label: "Grab something quick instead", sub: "$12 and ten minutes", money: -12, joy: 4, fuel: 18, comfort: 2, minutesLost: 10 },
    ] },
  { id: "shortline", w: 9, title: "You pass a headliner with almost no line",
    text: "It won't last. You were on your way somewhere else entirely.",
    options: [
      { label: "Divert and take it", sub: "Waits drop for you briefly", joy: 5, waitMult: 0.5, minutes: 25 },
      { label: "Stick to the plan", sub: "You'll wonder about it later", joy: -3 },
    ] },
  { id: "lostbear", w: 6, title: "There's a child's stuffed bear on a bench",
    text: "Nobody nearby seems to be looking for it. Lost and Found is a walk away.",
    options: [
      { label: "Hand it in yourself", sub: "Ten minutes out of your day", joy: 9, energy: -4, comfort: -2, minutesLost: 10 },
      { label: "Tell the nearest cast member", sub: "Someone else's problem now", joy: -1 },
    ] },
  { id: "fireworkspot", park: "dl", w: 7, title: "Fireworks in twenty minutes and you're across the park",
    text: "The hub is already filling up with people staking out spots.",
    options: [
      { label: "Hurry for a good spot", sub: "Costs your legs, worth the view", joy: 14, energy: -15, comfort: -8, minutesLost: 20 },
      { label: "Watch from where you are", sub: "You'll see most of it", joy: 5, comfort: 2, minutesLost: 15 },
    ] },
  { id: "club33", park: "dl", w: 3, title: "You've been invited to Club 33",
    text: "A member you got talking to in the queue has a spare seat at lunch. Behind the unmarked "
        + "door on Royal Street, up the lift, and into the only place in the park that serves it properly. "
        + "It will take most of the afternoon.",
    options: [
      { label: "Go", sub: "Two hours you will not get back", joy: 46, energy: 26, fuel: 60, comfort: 30, minutesLost: 120 },
      { label: "Thank them and carry on", sub: "You came here to ride things", joy: -4 },
    ] },
  { id: "pintrade", w: 6, title: "A cast member has a pin you've been after",
    text: "They'll trade for it — but the one they want back is your favourite.",
    options: [
      { label: "Make the trade", sub: "", joy: 8 },
      { label: "Keep yours", sub: "", joy: 2 },
    ] },
];


/* ---------------- milestones ----------------
   Not advertised anywhere. You find them by playing, and they land on the
   results screen at the end of the day. */
const MILESTONES = [
  { id: "dl_e", bonus: 30, name: "Disneyland E-Ticket Sweep",
    blurb: "Rode every E-Ticket in Disneyland",
    test: (c) => c.eTickets("dl").every((a) => c.did(a.id)) },
  { id: "dca_e", bonus: 30, name: "California Adventure E-Ticket Sweep",
    blurb: "Rode every E-Ticket in California Adventure",
    test: (c) => c.eTickets("dca").every((a) => c.did(a.id)) },
  { id: "thrifty", bonus: 35, name: "Not a Penny",
    blurb: "Got through the whole day without spending anything",
    test: (c) => c.spent === 0 },
  { id: "ropedrop", bonus: 18, name: "Rope Drop Runner",
    blurb: "Three attractions done before 10 AM",
    test: (c) => c.before(120) >= 3 },
  { id: "nightowl", bonus: 18, name: "Last Ones Out",
    blurb: "Still riding after 11 PM",
    test: (c) => c.lastAt >= 1380 },
  { id: "grandcircle", bonus: 15, name: "Grand Circle Tour",
    blurb: "Boarded the railroad at all four stations",
    test: (c) => RAIL_LOOP.every((id) => c.did(id)) },
  { id: "wellfed", bonus: 15, name: "Ate Your Way Round",
    blurb: "Ate at six different places",
    test: (c) => c.kinds("dine") >= 6 },
  { id: "everyland", bonus: 25, name: "Every Corner",
    blurb: "Did something in all seventeen lands",
    test: (c) => c.lands >= 17 },
  { id: "showgoer", bonus: 20, name: "Dinner and a Show",
    blurb: "Caught three of the night-time shows",
    test: (c) => c.nights >= 3 },
  { id: "unbroken", bonus: 22, name: "Never Flagged",
    blurb: "Energy never dropped below 40 all day",
    test: (c) => c.minEnergy >= 40 },
  { id: "comfy", bonus: 22, name: "Kept Your Cool",
    blurb: "Comfort never dropped below 40 all day",
    test: (c) => c.minComfort >= 40 },
  { id: "bothparks", bonus: 12, name: "Park Hopper",
    blurb: "Did something in both parks",
    test: (c) => c.parks === 2 },
];

function earnedMilestones(ctx) {
  return MILESTONES.filter((m) => { try { return m.test(ctx); } catch (e) { return false; } });
}

/* ---------------- icons ---------------- */
const I = {
  star: (c, f) => <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z" fill={f ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round" />,
  fork: (c) => <g fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round"><path d="M7 3v7a2 2 0 004 0V3M9 12v9" /><path d="M17 3c-1.6 1-2.4 3-2.4 5.2 0 1.7.8 2.8 2.4 2.8V21" /></g>,
  // an upended top hat with the magic coming out of it
  hat: (c) => (
    <g>
      <g fill="none" stroke={c} strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round">
        <path d="M3.6 12.4h16.8" />                        {/* brim, uppermost */}
        <path d="M6.9 12.4v7.3a1.5 1.5 0 001.5 1.5h7.2a1.5 1.5 0 001.5-1.5v-7.3" />
      </g>
      <g fill={c} stroke="none">
        <path d="M12 1.2l.95 2.5 2.5.95-2.5.95-.95 2.5-.95-2.5-2.5-.95 2.5-.95z" />
        <path d="M6.2 6.0l.55 1.45 1.45.55-1.45.55-.55 1.45-.55-1.45L4.2 8l1.45-.55z" />
        <path d="M17.9 5.6l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" />
      </g>
    </g>
  ),
  mickey: (c, f) => <g fill={f ? c : "none"} stroke={c} strokeWidth="1.7"><circle cx="6.4" cy="7.4" r="3.1" /><circle cx="17.6" cy="7.4" r="3.1" /><circle cx="12" cy="15.2" r="5.2" /></g>,
  home: (c, f) => <path d="M3.5 11L12 4l8.5 7v8.2a1 1 0 01-1 1h-15a1 1 0 01-1-1z" fill={f ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round" />,
  pin: (c, f) => <path d="M12 21.5s7-6.4 7-11.4a7 7 0 10-14 0c0 5 7 11.4 7 11.4z" fill={f ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round" />,
  list: (c) => <g stroke={c} strokeWidth="1.9" strokeLinecap="round"><path d="M4 6.5h.01M4 12h.01M4 17.5h.01M8.5 6.5H20M8.5 12H20M8.5 17.5H20" /></g>,
  clock: (c, f) => <g fill={f ? c : "none"} stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="8.6" /><path d="M12 7v5.2l3.2 2" strokeLinecap="round" fill="none" stroke={f ? C.white : c} /></g>,
  gear: (c, f) => <g fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="3.2" fill={f ? c : "none"} /><path d="M19.2 14.4a1.5 1.5 0 00.3 1.7l.1.1a1.8 1.8 0 11-2.6 2.6l-.1-.1a1.5 1.5 0 00-2.6 1.1v.2a1.8 1.8 0 11-3.6 0v-.1a1.5 1.5 0 00-2.6-1.1l-.1.1a1.8 1.8 0 11-2.6-2.6l.1-.1a1.5 1.5 0 00-1.1-2.6h-.2a1.8 1.8 0 110-3.6h.1a1.5 1.5 0 001.1-2.6l-.1-.1A1.8 1.8 0 117.9 4.7l.1.1a1.5 1.5 0 002.6-1.1V3.5a1.8 1.8 0 113.6 0v.1a1.5 1.5 0 002.6 1.1l.1-.1a1.8 1.8 0 112.6 2.6l-.1.1a1.5 1.5 0 001.1 2.6h.2a1.8 1.8 0 110 3.6h-.1a1.5 1.5 0 00-1.4.9z" /></g>,
  locate: (c) => <path d="M21 3L3 10.5l7.6 2.9L13.5 21z" fill={c} />,
  chevron: (c) => <path d="M15 5l-7 7 7 7" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  // a steam engine: boiler, cab, funnel and big driving wheels
  train: (c) => (
    <g fill="none" stroke={c} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round">
      <path d="M2.6 18.6h18.8" />                          {/* rail */}
      <path d="M2.9 8.6h9.6v7.3H2.9z" />                    {/* boiler */}
      <path d="M12.5 5.4h5.4a1.2 1.2 0 011.2 1.2v9.3h-6.6z" />   {/* cab */}
      <path d="M4.3 8.6V5.1h3.1v3.5" />                     {/* funnel */}
      <path d="M3.4 5.1h4.9" />                             {/* flared lip */}
      <path d="M13.9 7.6h3.4v2.5h-3.4z" />                  {/* cab window */}
      <circle cx="6.3" cy="16" r="2.5" />                   {/* driving wheel */}
      <circle cx="16.4" cy="16.4" r="2.1" />
    </g>
  ),
  ff: (c) => <g fill={c}><path d="M4 5.2l8.2 6.8L4 18.8z" /><path d="M12.6 5.2l8.2 6.8-8.2 6.8z" /></g>,
  person: (c, f) => (
    <g fill={f ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round">
      <circle cx="12" cy="7.4" r="3.6" />
      <path d="M4.9 20.4a7.1 7.1 0 0114.2 0z" />
    </g>
  ),
  ll: (c) => <path d="M13.6 2L4 13.4h5.2L8.4 22 20 9.6h-6z" fill={c} />,
};
const Icon = ({ d, c = C.grey, f = false, s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}>{I[d](c, f)}</svg>
);

const CATS = [
  { id: "ride", label: "Attractions", icon: "star" },
  { id: "dine", label: "Dining", icon: "fork" },
  { id: "show", label: "Entertainment", icon: "hat" },
  { id: "all", label: "Everything", icon: "mickey" },
];

/* ================= root ================= */
export default function HappiestPlace() {
  // the font is inlined in the page, so there is nothing to fetch

  const [screen, setScreen] = useState("title");
  const [t, setT] = useState(OPEN);
  const [joy, setJoy] = useState(50);
  const [energy, setEnergy] = useState(100);
  const [fuel, setFuel] = useState(72);
  const [comfort, setComfort] = useState(100);
  const [wallet, setWallet] = useState(DIFFICULTY.medium.budget);
  const [pos, setPos] = useState({ park: "dl", x: 592, y: 675, landName: "Main Street" });
  const [mapPark, setMapPark] = useState("dl");
  const [visited, setVisited] = useState({});
  const [track, setTrack] = useState({ minEnergy: 100, minComfort: 100, spent: 0, lastAt: 0, before10: 0 });
  const [llUsed, setLlUsed] = useState({});   // one redemption per eligible ride
  const [boughtLl, setBoughtLl] = useState(false);
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState("map");
  const [cat, setCat] = useState("ride");
  const [eOnly, setEOnly] = useState(false);
  const [hideDone, setHideDone] = useState(false);
  const [sel, setSel] = useState(null);
  const [seed, setSeed] = useState({ crowd: 1, weather: "clear", lateOpen: {}, refurb: null });
  const [mode, setMode] = useState("medium");
  const [party, setParty] = useState("partner");
  const [season, setSeason] = useState("regular");
  const [startPark, setStartPark] = useState("dl");
  const [custom, setCustom] = useState(CUSTOM_DEFAULT);
  const [runMode, setRunMode] = useState("single");
  const [runDay, setRunDay] = useState(1);
  const [runTotal, setRunTotal] = useState(0);
  const [runLog, setRunLog] = useState([]);        // one line per completed day
  const [carry, setCarry] = useState(null);        // how yesterday ended
  const [burnedOut, setBurnedOut] = useState(null);
  const isCustom = mode === "custom";
  const budgetOf = isCustom ? custom.budget : DIFFICULTY[mode].budget;
  const unlimited = isCustom ? custom.unlimited : !!DIFFICULTY[mode].unlimited;
  const isRun = runMode !== "single";
  const drain = (isCustom ? custom.drain : DIFFICULTY[mode].drain) * PARTY[party].drain;
  const fatigue = isRun ? dayFatigue(runDay) : 1;
  const [flash, setFlash] = useState(null);
  const [run, setRun] = useState(null);      // the activity playing out in real time
  const [speed, setSpeed] = useState(2);
  const [mods, setMods] = useState({ mult: 1, until: 0, closures: {} });
  const [eventCard, setEventCard] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const lastEvent = useRef(-999);
  const dcaWarned = useRef(false);

  const [basemap, setBasemap] = useState(null);
  const [anchors, setAnchors] = useState({ dl: [], dca: [] });
  const [calib, setCalib] = useState(null);
  const [calibWarn, setCalibWarn] = useState(null);
  const [usedPreset, setUsedPreset] = useState(false);
  const [frame, setFrame] = useState(FRAME_DEFAULT);
  const [lockedMsg, setLockedMsg] = useState(null);
  const [saveWarn, setSaveWarn] = useState(false);
  const [showBoth, setShowBoth] = useState(false);
  const [nudges, setNudges] = useState({});      // id -> corrected canonical {x,y}
  const [editing, setEditing] = useState(false);
  const [editIdx, setEditIdx] = useState(0);
  const [placeOk, setPlaceOk] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [goingHome, setGoingHome] = useState(false);
  const setupFile = useRef(null);

  const ANCHORS = frame;
  const PRESET = useMemo(() => Object.fromEntries(
    Object.entries(frame).map(([k, v]) => [k, v.map((p) => ({ x: p.x, y: p.y }))])), [frame]);
  const transforms = useMemo(() => ({
    dl: solveTransform(frame.dl, anchors.dl),
    dca: solveTransform(frame.dca, anchors.dca),
  }), [anchors, frame]);

  // corrected positions win over my estimates
  /* Seasonal overlays rename an attraction and make it worth more — Haunted
     Mansion Holiday and small world Holiday are genuinely better than the
     originals, and the queues reflect that. */
  const sea = SEASONS[season];
  const dress = (a) => {
    let out = a;
    const sw = NIGHT_SWAP[a.id];
    if (sw && M(t) >= sw.from) out = { ...out, name: sw.name, joy: out.joy + (sw.joy || 0) };
    const nm = sea.overlay && sea.overlay[a.id];
    if (nm) out = { ...out, name: nm, joy: out.joy + ((sea.boost && sea.boost[a.id]) || 0) };
    // a seasonal night overlay wins over both
    const nn = sea.nightOverlay && sea.nightOverlay[a.id];
    if (nn && M(t) >= (sea.nightFrom || 1020)) {
      out = { ...out, name: nn.name, joy: out.joy + (nn.joy || 0), wait: Math.round(out.wait * (nn.waitMult || 1)) };
    }
    return out;
  };
  const place = (a) => dress(nudges[a.id] ? { ...a, ...nudges[a.id] } : a);

  // walkthrough order: park, then land, so corrections move across the map sensibly
  const [editUnchecked, setEditUnchecked] = useState(true);
  const [editQueue, setEditQueue] = useState(null);   // specific ids chosen by hand
  const [pickSearch, setPickSearch] = useState("");
  const [pasteBox, setPasteBox] = useState("");
  const editList = useMemo(() => (editQueue
    ? editQueue.map((id) => byId[id]).filter(Boolean)
    : ATTRACTIONS
    .filter((a) => a.kind !== "shop")
    .filter((a) => !editUnchecked || !REVIEWED.has(a.id))
    .slice().sort((p, q) => (p.park === q.park ? p.landName.localeCompare(q.landName) || p.name.localeCompare(q.name) : p.park < q.park ? -1 : 1))), [editUnchecked, editQueue]);
  const editTarget = editing ? editList[Math.min(editIdx, editList.length - 1)] : null;

  useEffect(() => {
    if (editing && editTarget && editTarget.park !== mapPark) setMapPark(editTarget.park);
  }, [editing, editTarget && editTarget.id]);

  // build a walkthrough queue: whole resort, one park, and optionally only the
  // positions that have never been confirmed
  function startWalk(parkId) {
    const list = ATTRACTIONS
      .filter((a) => a.kind !== "shop")
      .filter((a) => !parkId || a.park === parkId)
      .filter((a) => !editUnchecked || !REVIEWED.has(a.id))
      .slice()
      .sort((p, q) => (p.park === q.park
        ? p.landName.localeCompare(q.landName) || p.name.localeCompare(q.name)
        : p.park < q.park ? -1 : 1))
      .map((a) => a.id);
    if (!list.length) return;
    setEditQueue(list);
    setEditIdx(0);
    setEditing(true);
    if (parkId) setMapPark(parkId);
    if (screen === "play") setTab("map");
  }
  const walkCount = (parkId) => ATTRACTIONS.filter((a) => a.kind !== "shop"
    && (!parkId || a.park === parkId)
    && (!editUnchecked || !REVIEWED.has(a.id))).length;

  function placePin(pt) {
    if (!editTarget || !pt) return;
    // a tap that lands off the map is a stray, not a placement
    if (pt.x < 0 || pt.x > CANVAS_W || pt.y < 0 || pt.y > CANVAS_H) return;
    const T = transforms[editTarget.park];
    const c = basemap && T ? invT(T, pt.x, pt.y) : pt;
    if (!isFinite(c.x) || !isFinite(c.y)) return;
    setNudges((n) => ({ ...n, [editTarget.id]: { x: Math.round(c.x), y: Math.round(c.y) } }));
    setPlaceOk({ name: editTarget.name, key: Math.random() });
    setTimeout(() => setPlaceOk(null), 1200);
    setEditIdx((i) => Math.min(i + 1, editList.length - 1));
  }

  function undoPin() {
    const i = Math.max(0, editIdx - 1);
    const prev = editList[i];
    if (prev) setNudges((n) => { const c = { ...n }; delete c[prev.id]; return c; });
    setEditIdx(i);
  }

  /* The repo is the source of truth. Always look for a bundled map, even when a
     copy is already saved locally — otherwise one browser uses a stale upload
     while another asks you to upload again. */
  const [bundleState, setBundleState] = useState("looking");
  useEffect(() => {
    let dead = false;
    (async () => {
      const names = ["map.jpg", "map.jpeg", "map.png", "map.webp", "map.JPG", "map.JPEG", "map.PNG"];
      for (const name of names) {
        try {
          const res = await fetch(name, { cache: "no-cache" });
          if (!res.ok) continue;
          const blob = await res.blob();
          if (!blob.type || !blob.type.startsWith("image/")) continue;
          const url = URL.createObjectURL(blob);
          const img = new Image();
          await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = url; });
          if (dead) return;
          applyBasemap(url, img.width, img.height, true);
          setBundleState(name);
          return;
        } catch (e) { /* try the next filename */ }
      }
      if (!dead) setBundleState("missing");
    })();
    return () => { dead = true; };
  }, []);

  function applyBasemap(src, w, h, bundled) {
    setBasemap({ src, w, h, bundled: !!bundled });
    const official = Math.abs(h / w - CANVAS_H / CANVAS_W) < 0.035;
    setAnchors(official ? { dl: [...PRESET.dl], dca: [...PRESET.dca] } : { dl: [], dca: [] });
    setUsedPreset(official);
  }

  /* Rewrite every pin AND the frame through the current calibration, then reset
     the calibration to identity. Afterwards the stored coordinates ARE the map's
     coordinates, so no future edit or rebuild can shift anything. */
  function lockInCalibration() {
    const next = { ...nudges };
    let moved = 0;
    for (const a of ATTRACTIONS) {
      if (a.kind === "shop") continue;
      const T = transforms[a.park];
      if (!T) continue;
      const cur = nudges[a.id] || { x: a.x, y: a.y };
      const p = applyT(T, cur.x, cur.y);
      if (!isFinite(p.x) || !isFinite(p.y)) continue;
      next[a.id] = { x: Math.round(p.x), y: Math.round(p.y) };
      moved++;
    }
    const newFrame = Object.fromEntries(Object.entries(frame).map(([park, list]) => {
      const T = transforms[park];
      return [park, list.map((pt) => {
        const q = T ? applyT(T, pt.x, pt.y) : pt;
        return { ...pt, x: Math.round(q.x), y: Math.round(q.y) };
      })];
    }));
    setNudges(next);
    setFrame(newFrame);
    setAnchors({
      dl: newFrame.dl.map((p) => ({ x: p.x, y: p.y })),
      dca: newFrame.dca.map((p) => ({ x: p.x, y: p.y })),
    });
    setLockedMsg(`Locked in. ${moved} pins and both calibration landmarks were rewritten into your map's coordinates — the calibration is now the identity, so nothing can shift again.`);
  }

  function loadBasemap(file) {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        /* Only uploads get shrunk, and only because localStorage caps out
           around 5 MB. A map committed to the repo as map.jpg skips this path
           entirely and is used at full resolution — that's the way to get a
           sharp zoomed-in map. */
        let src = r.result;
        const MAXW = 2600;
        if (img.width > MAXW) {
          try {
            const c = document.createElement("canvas");
            c.width = MAXW;
            c.height = Math.round(img.height * MAXW / img.width);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            src = c.toDataURL("image/jpeg", 0.9);
          } catch (e) { /* tainted or unsupported — keep the original */ }
        }
        applyBasemap(src, img.width, img.height, false);
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  function placeAnchor(park, pt) {
    if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) return;
    const cur = anchors[park].length >= 2 ? [] : anchors[park];
    if (cur.length === 1 && Math.hypot(cur[0].x - pt.x, cur[0].y - pt.y) < 25) {
      setCalibWarn("Those points are almost on top of each other. Pick a landmark further away — the distance between them sets the scale.");
      return;
    }
    const next = [...cur, { x: pt.x, y: pt.y }];
    setCalibWarn(null);
    setAnchors((A) => ({ ...A, [park]: next }));
    if (next.length === 2) setCalib(null);
  }

  /* Close out a day inside a run and set up the next one. */
  function nextDay(park) {
    setRunTotal((x) => x + joy);
    setRunLog((L) => [...L, { day: runDay, joy: Math.round(joy), spent: track.spent,
      rides: Object.keys(visited).filter((id) => byId[id]).length }]);
    const c = { energy, fuel, comfort, wallet, hopper };   // the Hopper is a run-long upgrade
    setCarry(c);
    setRunDay((d) => d + 1);
    setStartPark(park);
    start(park, c, runDay + 1);
  }
  function endRun() {
    setRunTotal((x) => x + joy);
    setScreen("end");
  }

  function start(parkOverride, carryOverride, dayOverride) {
    const c = carryOverride !== undefined ? carryOverride : carry;
    const day = dayOverride !== undefined ? dayOverride : runDay;
    setDayWindow(isCustom ? custom.startMin : 480, isCustom ? custom.endMin : 1440);
    const cond = isCustom
      ? { weather: custom.weather, crowd: custom.crowd }
      : rollConditions(mode);
    cond.crowd *= SEASONS[season].crowd;
    cond.warm = SEASONS[season].warm;
    // one or two headliners open late, and one attraction is down all day
    const late = {};
    const pool = [...LATE_OPENERS].sort(() => Math.random() - 0.5);
    const n = Math.random() < 0.55 ? (Math.random() < 0.3 ? 2 : 1) : 0;
    for (let i = 0; i < n; i++) late[pool[i]] = 20 + Math.floor(Math.random() * 25);
    const refurb = Math.random() < 0.5
      ? REFURB_CANDIDATES[Math.floor(Math.random() * REFURB_CANDIDATES.length)] : null;
    setSeed({ ...cond, lateOpen: late, refurb });
    setScreen("play"); setT(OPEN); setJoy(50);
    setEnergy(c ? overnight.energy(c.energy, day) : Math.round(100 * PARTY[party].energy)); setFuel(carry ? overnight.fuel(carry.fuel) : 72);
    setComfort(c ? overnight.comfort(c.comfort, day) : 100);
    setWallet(budgetOf + (c ? Math.max(0, Math.round(c.wallet)) : 0));
    const gp = (parkOverride === "dl" || parkOverride === "dca") ? parkOverride : startPark;
    const gate = gp === "dl"
      ? { park: "dl", x: 595, y: 690, landName: "Main Street" }
      : { park: "dca", x: 590, y: 1000, landName: "Buena Vista St." };
    setPos(gate); setMapPark(gp); setVisited({});
    // Lightning Lane is a daily purchase; the Park Hopper carries across a run
    setLlUsed({}); setBoughtLl(false); setSinglePass({}); setFreeLL(0);
    setHopper(c ? !!c.hopper : false);
    setTrack({ minEnergy: 100, minComfort: 100, spent: 0, lastAt: 0, before10: 0 }); setLog([]); setTab("map"); setSel(null); setCat("ride");
    setGoingHome(false); dcaWarned.current = false;
    setMods({ mult: 1, until: 0, closures: {} });
    setEventCard(null); setEventLog([]);
    lastEvent.current = 0;
    if (!isCustom || custom.events) setTimeout(() => fireEvent("start", OPEN), 450);
    const notes = [];
    if (refurb && byId[refurb]) notes.push(`${byId[refurb].name} is closed for refurbishment today.`);
    for (const id of Object.keys(late)) if (byId[id]) notes.push(`${byId[id].name} opens about ${late[id]} minutes late.`);
    if (notes.length) setTimeout(() => push(notes.join(" "), "bad"), 700);
  }

  const waits = useMemo(() => {
    const w = {};
    const m = { ...mods, refurb: seed.refurb, lateOpen: seed.lateOpen };
    for (const a of ATTRACTIONS) {
      w[a.id] = parkOpenNow(a.park, t) ? waitFor(a, t, seed.crowd, seed.weather, m) : -1;
    }
    return w;
  }, [t, seed, mods]);

  const isOpen = (a) => a.open === undefined || (M(t) >= a.open && M(t) <= a.close);

  const visible = useMemo(() => ATTRACTIONS.filter((a) => {
    if (!isOpen(a) || a.kind === "shop") return false;
    if (a.season && a.season !== season) return false;
    if (a.last !== undefined && M(t) > a.last) return false;
    if (!(showBoth && basemap) && a.park !== mapPark) return false;
    if (cat === "ride" && a.kind !== "ride" && a.kind !== "train") return false;
    if (cat === "dine" && a.kind !== "dine") return false;
    if (cat === "show" && a.kind !== "show" && a.kind !== "night") return false;
    if (eOnly && a.ticket !== "E") return false;
    if (hideDone && visited[a.id]) return false;
    return true;
  }), [mapPark, cat, eOnly, hideDone, visited, t, showBoth, basemap]);

  const push = (text, tone) =>
    setLog((L) => [{ text, tone, at: clock(t), key: Math.random() }, ...L].slice(0, 60));

  function passTime(mins) {
    const hot = 1 + 0.55 * heatAt(seed.weather, t, seed.warm) + 0.30 * coldAt(seed.weather, t, seed.warm);
    setEnergy((e) => clamp(e - (mins / 10) * 0.3 * hot * drain * fatigue));
    setFuel((f) => clamp(f - (mins / 10) * 0.95 * PARTY[party].hunger * drain));
    setComfort((c) => clamp(c - mins * comfortDrain(seed.weather, t, seed.warm) * drain * fatigue));
    setJoy((j) => happy(j - (mins / 10) * 0.35 * drain));
    setT((x) => x + mins);
  }

  /* One minute of an activity. Kept pure so the same maths drives both the
     live tick and the Skip button. */
  function minuteDelta(r, i, atMin, dr, wx, fat = 1) {
    const hot = 1 + 0.55 * heatAt(wx, atMin, seed.warm) + 0.30 * coldAt(wx, atMin, seed.warm);
    const { a, walk, wait, dur } = r;
    const phase = i < walk ? "walk" : i < walk + wait ? "wait" : "do";
    const base = comfortDrain(wx, atMin, seed.warm);
    let dJoy = -0.035 * dr, dEn = -0.03 * hot * dr * fat, dFu = -0.095 * dr, dCf = -base * dr * fat;
    if (phase === "walk") { dEn -= 0.45 * hot * dr * fat; dJoy -= 0.05 * dr; dCf -= base * 1.1 * dr * fat; }
    if (phase === "wait") { dEn -= 0.06 * dr * fat; dJoy -= r.painRate * dr; dCf -= base * 0.9 * dr * fat; }
    if (phase === "do") {
      dJoy += r.gain / dur;
      dEn += (a.en > 0 ? a.en : a.en * hot) / dur;
      dFu += a.fuel / dur;
      dCf += (r.comfortRate || 0) + (r.comfort || 0) / dur;
    }
    return { dJoy, dEn, dFu, dCf, phase };
  }

  function beginTrain(station, destId) {
    if (run) return;
    const from = place(station);
    const to = place(byId[destId]);
    const mins = railMinutes(station.id, destId);
    if (!mins) return;
    const circle = station.id === destId;
    const walk = walkMinutes(pos, from, t);
    const wait = actualWait(waits[station.id], station.id, t);
    // a slow lap round the park: gentle, scenic, and a real rest for your feet
    const synthetic = {
      ...to, kind: "train", dur: mins, cost: 0, fuel: 0,
      joy: 5 + mins * 0.35, en: mins * 0.45,
      name: circle ? "Grand Circle Tour" : `Railroad to ${to.name.replace(" Station", "").replace(" Depot", "")}`,
    };
    const eF = energy > 60 ? 1 : energy > 35 ? 0.85 : energy > 15 ? 0.62 : 0.4;
    setSel(null);
    setTab("map");
    setMapPark("dl");
    setRun({
      a: synthetic, useLL: false, walk, wait, dur: Math.max(1, mins),
      painRate: 0.06, gain: synthetic.joy * eF, reps: 0, comfortRate: 0.5,
      i: 0, net: 0, paid: true, from: { ...pos }, board: { x: from.x, y: from.y },
    });
  }

  function beginAttraction(raw, opt) {
    const a = place(raw);
    if (run || a.cost > wallet || waits[a.id] < 0) return;
    if (needsSwitch(a, party) && opt !== "switch") return;
    if (hopBlock(a)) return;
    const useLL = (opt === true || opt === "ll") && llReady(a.id);
    const single = opt === "single" && singleRiderOpen(a.id, t);
    const walk = walkMinutes(pos, a, t);
    const togo = opt === "togo" && isQuickService(a);
    const mobile = opt === "mobile" && isQuickService(a) && walkMinutes(pos, a, t) >= MOBILE_MIN_WALK;
    const posted = useLL ? 5
      : single ? Math.max(5, Math.round((waits[a.id] * SINGLE_WAIT) / 5) * 5)
      : waits[a.id];
    // no queue phase for dining: the whole visit is one seated block
    const wait = a.kind === "dine" ? 0 : actualWait(posted, a.id, t);
    const dur = a.kind === "dine"
      ? Math.max(1, Math.round(seatedMinutes(a) *
          (togo ? TOGO_TIME : mobile ? MOBILE_TIME : 1)))
      : Math.max(1, a.dur);
    const reps = visited[a.id] || 0;
    const rep = reps === 0 ? 1 : reps === 1 ? 0.5 : reps === 2 ? 0.28 : 0.15;
    const eF = energy > 60 ? 1 : energy > 35 ? 0.85 : energy > 15 ? 0.62 : 0.4;
    const fF = fuel > 25 ? 1 : 0.72;
    const cF = comfort > 60 ? 1 : comfort > 35 ? 0.9 : comfort > 15 ? 0.76 : 0.6;
    let gain = a.joy * rep * eF * fF * cF;
    if (seed.weather === "hot" && a.kind === "dine") gain += 2;
    if (seed.weather === "drizzle" && a.kind === "ride") gain -= 1.5;
    if (single) gain *= SINGLE_JOY;
    if (togo) gain *= TOGO_JOY;   // eaten standing up, on the way somewhere
    const P = PARTY[party];
    if (a.kind === "ride") gain *= (a.ticket === "E" || HEIGHT[a.id] >= 40) ? P.thrill : P.family;
    if (a.kind === "show" || a.kind === "night") gain *= P.show;
    const switching = opt === "switch" && needsSwitch(a, party);
    if (switching) gain *= RIDER_SWITCH_JOY;
    if (!unlimited) {
      gain -= a.cost > 20 ? (a.cost - 20) * 0.09 : 0;                 // sticker shock
      gain -= wallet - a.cost < budgetOf * 0.15 ? 3 : 0;              // running low
    }   // scales with your budget
    const painRate = a.kind === "dine" || a.kind === "night" ? 0.05 : energy < 30 ? 0.2 : 0.11;
    setSel(null);
    setTab("map");
    setMapPark(a.park);
    setRun({
      a: togo ? { ...a, en: Math.round(a.en * TOGO_REST), name: `${a.name} (to go)` } : a,
      useLL, single, togo, switching, walk, wait, posted, dur, painRate, gain, reps,
      comfortRate: togo ? -0.25 : comfortRate(a, seed.weather, tempAt(seed.weather, t, seed.warm)),
      i: 0, net: 0, paid: false, from: { ...pos },
    });
  }

  function applyEffects(e, atTime) {
    if (e.waitMult) setMods((m) => ({ ...m, mult: e.waitMult, until: atTime + (e.minutes || 60) }));
    if (e.joy) setJoy((j) => happy(j + e.joy));
    if (e.energy) setEnergy((en) => clamp(en + e.energy));
    if (e.fuel) setFuel((f) => clamp(f + e.fuel));
    if (e.comfort) setComfort((c) => clamp(c + e.comfort));
    if (e.money) setWallet((w) => Math.max(0, w + e.money));
    if (e.ll) grantLL();
    if (e.timeShift) setT((x) => x + e.timeShift);
    if (e.minutesLost) setT((x) => x + e.minutesLost);
  }

  function chooseOption(ev, opt) {
    applyEffects(opt, t);
    const kind = (opt.joy || 0) >= 0 ? "good" : "bad";
    setEventLog((L) => [{ title: `${ev.title} — ${opt.label}`, kind, at: clock(t), key: Math.random() }, ...L].slice(0, 40));
    push(`${ev.title} → ${opt.label}`, kind);
    setEventCard(null);
  }

  function fireEvent(when, atTime) {
    if (when === "day" && Math.random() < 0.42) {
      const pool = CHOICES.filter((e) => !e.park || e.park === pos.park);
      const total = pool.reduce((x, e) => x + e.w, 0);
      let roll = Math.random() * total;
      const ev = pool.find((e) => (roll -= e.w) <= 0) || pool[0];
      if (!ev) return;
      lastEvent.current = atTime;
      setEventCard({ ...ev, choice: true, key: Math.random() });
      return;
    }
    const pool = EVENTS.filter((e) => e.when === when && (!e.park || e.park === pos.park));
    const total = pool.reduce((x, e) => x + e.w, 0);
    let roll = Math.random() * total;
    const ev = pool.find((e) => (roll -= e.w) <= 0) || pool[0];
    if (!ev) return;

    let title = ev.title, ride = null;
    if (ev.closeRide) {
      // pick something with a real line — closing a walk-on is not a story
      const open = ATTRACTIONS.filter((a) => a.kind === "ride" && a.wait >= 25 &&
        (a.open === undefined || (M(atTime) >= a.open && M(atTime) <= a.close)) &&
        (a.last === undefined || M(atTime) <= a.last));
      ride = open[Math.floor(Math.random() * open.length)];
      if (!ride) return;
      title = title.replace("{ride}", ride.name);
      setMods((m) => ({ ...m, closures: { ...m.closures, [ride.id]: atTime + (ev.minutes || 45) } }));
    }
    if (ev.waitMult) setMods((m) => ({ ...m, mult: ev.waitMult, until: atTime + (ev.minutes || 60) }));
    if (ev.joy) setJoy((j) => happy(j + ev.joy));
    if (ev.energy) setEnergy((e) => clamp(e + ev.energy));
    if (ev.fuel) setFuel((f) => clamp(f + ev.fuel));
    if (ev.comfort) setComfort((c) => clamp(c + ev.comfort));
    if (ev.money) setWallet((w) => Math.max(0, w + ev.money));
    if (ev.ll) grantLL();
    if (ev.timeShift) setT((x) => x + ev.timeShift);
    if (ev.minutesLost) setT((x) => x + ev.minutesLost);

    lastEvent.current = atTime;
    const card = { ...ev, title, key: Math.random() };
    setEventCard(card);
    setEventLog((L) => [{ title, kind: ev.kind, at: clock(atTime), key: card.key }, ...L].slice(0, 40));
    push(`${ev.kind === "good" ? "✦" : "!"} ${title}`, ev.kind === "good" ? "good" : "bad");
  }

  function finishRun(r, net) {
    const { a } = r;
    setPos({ park: a.park, x: a.x, y: a.y, landName: a.landName });
    setMapPark(a.park);
    setVisited((v) => ({ ...v, [a.id]: (v[a.id] || 0) + 1 }));
    setTrack((k) => ({ ...k, lastAt: Math.max(k.lastAt, t), before10: k.before10 + (M(t) < 600 ? 1 : 0) }));
    if (r.useLL) {
      setLlUsed((u) => ({ ...u, [r.a.id]: true }));
      // a comped skip is only spent when the pass didn't already cover the ride
      if (!boughtLl && !singlePass[r.a.id]) setFreeLL((n) => Math.max(0, n - 1));
    }
    const bits = [`${r.walk} min walk`];
    if (r.wait) bits.push(`${r.wait} min ${r.single ? "single rider" : "line"}`);
    else if (r.posted > 0) bits.push("walked straight on");
    if (a.cost) bits.push(`$${a.cost}`);
    push(`${a.name} — ${bits.join(", ")}`, net >= 4 ? "good" : net >= 0 ? "ok" : "bad");
    setFlash({ name: a.name, net, key: Math.random() });
    setTimeout(() => setFlash(null), 2600);
    setRun(null);
    // roughly one event every couple of activities, never twice inside an hour
    const now = t;
    if ((!isCustom || custom.events) && now - lastEvent.current > 55 && Math.random() < 0.34) {
      setTimeout(() => fireEvent("day", now), 700);
    }
  }

  function stepMinute() {
    const r = run;
    if (!r) return;
    const total = r.walk + r.wait + r.dur;
    const { dJoy, dEn, dFu, dCf, phase } = minuteDelta(r, r.i, t + r.i, drain, seed.weather, fatigue);

    setT((x) => x + 1);
    setJoy((j) => happy(j + dJoy));
    setEnergy((e) => { const n = clamp(e + dEn); setTrack((k) => (n < k.minEnergy ? { ...k, minEnergy: n } : k)); return n; });
    setFuel((f) => clamp(f + dFu));
    setComfort((c) => { const n = clamp(c + dCf); setTrack((k) => (n < k.minComfort ? { ...k, minComfort: n } : k)); return n; });

    const target = r.board || r.a;   // the train is boarded at a platform, not at the destination
    if (phase === "walk" && r.walk > 0) {
      const p = (r.i + 1) / r.walk;
      setPos({ park: p > 0.5 ? r.a.park : r.from.park, landName: p > 0.5 ? r.a.landName : r.from.landName,
        x: r.from.x + (target.x - r.from.x) * p, y: r.from.y + (target.y - r.from.y) * p });
    }
    if (phase === "do" && r.board) {
      // ride the loop: slide the marker from the platform to where you get off
      const p = (r.i + 1 - r.walk - r.wait) / Math.max(1, r.dur);
      setPos({ park: r.a.park, landName: r.a.landName,
        x: r.board.x + (r.a.x - r.board.x) * p, y: r.board.y + (r.a.y - r.board.y) * p });
    }
    if (phase === "do" && !r.paid && r.a.cost) setWallet((w) => w - r.a.cost);

    const net = r.net + dJoy;
    const next = r.i + 1;
    if (next >= total) finishRun(r, net);
    else setRun({ ...r, i: next, net, paid: r.paid || phase === "do" });
  }

  function skipRun() {
    const r = run;
    if (!r) return;
    const total = r.walk + r.wait + r.dur;
    let dJ = 0, dE = 0, dF = 0, dC = 0;
    for (let i = r.i; i < total; i++) {
      const d = minuteDelta(r, i, t + i, drain, seed.weather, fatigue);
      dJ += d.dJoy; dE += d.dEn; dF += d.dFu; dC += d.dCf;
    }
    setT((x) => x + (total - r.i));
    setJoy((j) => happy(j + dJ));
    setEnergy((e) => clamp(e + dE));
    setFuel((f) => clamp(f + dF));
    setComfort((c) => clamp(c + dC));
    if (!r.paid && r.a.cost) setWallet((w) => w - r.a.cost);
    finishRun(r, r.net + dJ);
  }

  // the clock: one real second per park minute, at 1x
  useEffect(() => {
    if (!run || screen !== "play") return;
    const id = setTimeout(stepMinute, Math.max(45, 1000 / speed));
    return () => clearTimeout(id);
  }, [run, speed, screen]);

  function beginBreak(b) {
    if (run || b.cost > wallet) return;
    if (b.window && (M(t) < b.window[0] || M(t) > b.window[1])) return;
    setSel(null);
    setTab("map");
    setRun({
      a: { ...pos, id: "break:" + b.id, name: b.name, kind: "break", runLabel: b.name,
           dur: b.mins, cost: b.cost, en: b.en, fuel: b.fuel, landName: pos.landName, park: pos.park },
      useLL: false, walk: 0, wait: 0, dur: Math.max(1, b.mins),
      painRate: 0, gain: b.joy, reps: 0, comfort: b.comfort || 0,
      i: 0, net: 0, paid: false, from: { ...pos },
    });
  }

  // the only non-break action left: buying line skips
  /* Multi Pass: one redemption per eligible attraction across the day, not a
     pool of interchangeable skips. */
  const buyLightningLane = () => {
    if (wallet < 32 || boughtLl) return;
    setWallet((w) => w - 32); setBoughtLl(true);
    setTrack((k) => ({ ...k, spent: k.spent + 32 }));
    setJoy((j) => happy(j - 2));
    push(`Bought Lightning Lane Multi Pass — $32, one skip on each of ${LL_OK.size} attractions`, "ok");
  };
  // a gifted pass clears the skip on one ride you haven't used yet
  /* A comped Lightning Lane — from the hotel perk, or handed over when a ride
     breaks down under you — is good for ONE eligible attraction of your choosing.
     It used to set boughtLl, which quietly unlocked all 22. */
  const grantLL = () => setFreeLL((n) => n + 1);
  const [freeLL, setFreeLL] = useState(0);
  const [hopper, setHopper] = useState(false);
  const buyHopper = () => {
    if (hopper || wallet < HOPPER_PRICE) return;
    setWallet((w) => w - HOPPER_PRICE);
    setTrack((k) => ({ ...k, spent: k.spent + HOPPER_PRICE }));
    setHopper(true);
    push(`Upgraded to a Park Hopper — $${HOPPER_PRICE}`, "ok");
  };
  // why you can't start this attraction, if you can't
  /* Without a Park Hopper your day ends when your own park shuts — California
     Adventure closes hours before Disneyland, so a one-park DCA ticket is a
     genuinely shorter day. */
  const closeAt = hopper
    ? CLOSE
    : Math.min(CLOSE, Math.max(60, (PARK_CLOSE[startPark] || CLOSE + DAY_START) - DAY_START));

  const hopBlock = (a) => {
    if (!a || a.park === pos.park) return null;
    return hopper ? null : "hopper";
  };
  const [singlePass, setSinglePass] = useState({});
  const buySinglePass = (a) => {
    const price = SINGLE_PASS[a.id];
    if (!price || wallet < price || singlePass[a.id]) return;
    setWallet((w) => w - price);
    setTrack((k) => ({ ...k, spent: k.spent + price }));
    setSinglePass((p) => ({ ...p, [a.id]: true }));
    push(`Bought a Lightning Lane Single Pass for ${a.name} — $${price}`, "ok");
  };
  const llReady = (id) => !llUsed[id]
    && (singlePass[id] || (LL_OK.has(id) && (boughtLl || freeLL > 0)));
  const llLeft = (boughtLl ? [...LL_OK].filter((id) => !llUsed[id]).length : 0) + freeLL
    + Object.keys(singlePass).filter((id) => !llUsed[id]).length;


  useEffect(() => {
    if (screen !== "play") return;
    // in a run, burning out on ANY meter is the end of it
    const dead = energy <= 0 || (isRun && (fuel <= 0 || comfort <= 0));
    if (dead && isRun && !burnedOut) {
      setBurnedOut(energy <= 0 ? "energy" : fuel <= 0 ? "hunger" : "comfort");
    }
    if (t >= closeAt || dead) setScreen(isRun && !dead ? "recap" : "end");
    // a heads-up while there's still time to act on it
    if (!dcaWarned.current && PARK_CLOSE.dca < PARK_CLOSE.dl
        && M(t) >= PARK_CLOSE.dca - 60 && M(t) < PARK_CLOSE.dca) {
      dcaWarned.current = true;
      push(hopper || startPark !== "dca"
        ? "California Adventure closes in an hour."
        : "California Adventure closes in an hour — and that's your day, without a Park Hopper.", "bad");
    }
  }, [t, energy, screen]);

  const mapReady = !!(basemap && transforms.dl && transforms.dca);
  if (screen === "title")
    return <Title ready={mapReady} mode={mode} setMode={setMode}
      runMode={runMode} setRunMode={(m) => { setRunMode(m); setRunDay(1); setRunTotal(0); setRunLog([]); setCarry(null); setBurnedOut(null); }}
      party={party} setParty={setParty} season={season} setSeason={setSeason}
      startPark={startPark} setStartPark={setStartPark} custom={custom} setCustom={setCustom}
      onSetup={() => setScreen("setup")}
      onStart={() => (mapReady ? start() : setScreen("setup"))} />;
  if (screen === "end")
    return <End joy={joy} t={t} wallet={wallet} energy={energy} comfort={comfort} visited={visited} track={track} log={log} seed={seed} mode={mode} unlimited={unlimited} closeAt={closeAt}
      isRun={isRun} runDay={runDay} runTotal={runTotal} runLog={runLog} burnedOut={burnedOut}
      won={isRun && RUN_MODES[runMode].days > 0 && runDay >= RUN_MODES[runMode].days && !burnedOut}
      onAgain={() => { setRunDay(1); setRunTotal(0); setRunLog([]); setCarry(null); setBurnedOut(null); start(); }} onTitle={() => setScreen("title")} />;

  const mapProps = {
    park: mapPark, waits, pos, basemap, transforms, anchors, calib,
    onAnchor: placeAnchor, calibWarn, showBoth,
    onCancelCalib: () => { setCalib(null); setCalibWarn(null); },
    moving: !!run && run.i < run.walk, closures: mods.closures, onSwitchPark: setMapPark,
    editing, editTarget, onPlacePin: placePin,
    editIdx, editCount: editList.length, nudged: Object.keys(nudges).length,
    onEditStep: (d) => setEditIdx((i) => Math.max(0, Math.min(editList.length - 1, i + d))),
    onEditUndo: undoPin, placeOk,
    onEditDone: () => { setEditing(false); setEditQueue(null); },
  };

  /* ---------- setup ---------- */
  if (screen === "setup") {
    const ready = !basemap || (transforms.dl && transforms.dca);
    return (
      <Shell>
        <NavBar title={calib ? "Calibrate" : editing ? "Adjust Pins" : "Map Setup"}
          onBack={calib || editing ? undefined : () => setScreen("title")} />
        {calib || editing ? (
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <ParkMap {...mapProps}
              park={calib || mapPark}
              items={editing ? ATTRACTIONS.filter((x) => x.kind !== "shop"
                && ((showBoth && basemap) || x.park === mapPark)).map(place) : []}
              sel={null} onSelect={() => {}} visited={{}} />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", background: C.gap }}>
            <div style={{ flex: 1, overflowY: "auto", background: C.gap }}>
          <Card>
            <Note>
              If every pin looks uniformly shifted or scaled — all of them pulled in toward the
              centre, or pushed out — that is a calibration mismatch, not 128 wrong pins. Redo the
              two anchor points below and the whole set corrects at once.
            </Note>
            <div style={{ fontSize: 15.5, color: C.grey, lineHeight: 1.5, marginBottom: 12, marginTop: 10 }}>
              {bundleState === "looking" ? "Checking the site for a map file…"
                : basemap && basemap.bundled ? `Using ${bundleState} from the site — nothing to upload, on any device.`
                : basemap ? `Using a map from this device, shrunk to ${MAXW_NOTE}px wide to fit browser storage — which is why it softens when you zoom in. Commit the file to the repo as map.jpg instead and it loads at full resolution.`
                : "Playing on the built-in map."}
            </div>
            {saveWarn && (
              <Note tone="bad">
                This browser wouldn't keep the image between visits (storage is full or blocked).
                It works for now, but you'll need to load it again next time — or add it to the
                site as map.jpg to skip that.
              </Note>
            )}
            {bundleState === "missing" && (
              <Note tone="bad">
                No map file was found next to index.html. That is why this browser asks you to
                upload one while another remembers an old copy. Commit the image to the repo as
                <b> map.jpg</b> and every browser will load it on its own.
              </Note>
            )}
            <input ref={setupFile} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) loadBasemap(f); e.target.value = ""; }} />
            <Row>
              <Pill solid onClick={() => setupFile.current && setupFile.current.click()}>
                {basemap ? "Change image" : "Load map image"}
              </Pill>
              {basemap && <Pill onClick={() => { setBasemap(null); setAnchors({ dl: [], dca: [] }); setShowBoth(false); }}>Remove</Pill>}
            </Row>
            {basemap && Object.values(PARKS).map((p) => {
              const T = transforms[p.id];
              const skew = T ? Math.abs(Math.atan2(T.b, T.a) * 180 / Math.PI) : 0;
              const scl = T ? T.scale : 1;
              // rotation is the tell-tale of a bad calibration. A scale difference
              // is usually just a map image cropped differently, which is fine.
              const odd = T && (skew > 4 || scl < 0.82 || scl > 1.22);
              return (
              <div key={p.id} style={{ marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.navy, fontSize: 15.5 }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: T ? (odd ? C.red : C.green) : C.red, fontWeight: 600 }}>
                      {T ? `Calibrated · scale ${scl.toFixed(2)}, tilt ${skew.toFixed(1)}°` : `${anchors[p.id].length}/2 points placed`}
                    </div>
                  </div>
                  <Pill onClick={() => { setAnchors((A) => ({ ...A, [p.id]: [] })); setCalib(p.id); setTab("map"); }}>
                    {T ? "Redo" : "Start"}
                  </Pill>
                </div>
                {odd && (
                  <div style={{ marginTop: 7 }}>
                    <Note tone="bad">
                      This calibration is tilting or stretching the pins noticeably. If they look wrong, reset it.
                    </Note>
                    <div style={{ marginTop: 6 }}>
                      <Pill onClick={() => setAnchors((A) => ({ ...A, [p.id]: [...PRESET[p.id]] }))}>
                        Reset to default
                      </Pill>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
            {basemap && transforms.dl && transforms.dca && (
              <div style={{ marginTop: 16 }}>
                <Toggle on={showBoth} onClick={() => setShowBoth(!showBoth)} label="Show both parks at once" />
              </div>
            )}

            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.rule}` }}>
              <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>
                Where you're running
              </div>
              <div style={{ fontSize: 15.5, color: C.navy, fontWeight: 700, lineHeight: 1.45 }}>
                {RUNTIME}
              </div>
              <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45, marginTop: 4 }}>
                On iOS, Chrome, Safari and a home screen app each get their own separate storage.
                A calibration saved in one is invisible to the others, so they fall back to
                defaults and draw the pins differently. That is almost certainly why the map keeps
                looking wrong in one place and right in another.
              </div>
              <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45, marginTop: 8 }}>
                Copy the text below and paste it into the others to match them up — or send it to
                me and I will build it in, after which none of them need saved settings at all.
              </div>
              <textarea readOnly onFocus={(e) => e.target.select()}
                value={JSON.stringify({
                  frame: { dl: frame.dl.map((p) => [p.x, p.y]), dca: frame.dca.map((p) => [p.x, p.y]) },
                  anchors, nudges,
                })}
                style={{
                  width: "100%", height: 70, marginTop: 8, padding: 9, boxSizing: "border-box",
                  border: `1px solid ${C.border}`, borderRadius: 10, background: C.gap,
                  fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, color: C.text, resize: "vertical",
                }} />
              <input value={pasteBox} onChange={(e) => setPasteBox(e.target.value)}
                placeholder="Paste settings from the other one here…"
                style={{
                  width: "100%", boxSizing: "border-box", marginTop: 8, padding: "10px 12px",
                  borderRadius: 10, border: `1.5px solid ${C.border}`, fontFamily: F, fontSize: 14.5, outline: "none",
                }} />
              {pasteBox.trim() && (
                <div style={{ marginTop: 8 }}>
                  <Pill solid onClick={() => {
                    try {
                      const v = JSON.parse(pasteBox);
                      if (v.frame) setFrame({
                        dl: FRAME_DEFAULT.dl.map((p, i) => ({ ...p, x: v.frame.dl[i][0], y: v.frame.dl[i][1] })),
                        dca: FRAME_DEFAULT.dca.map((p, i) => ({ ...p, x: v.frame.dca[i][0], y: v.frame.dca[i][1] })),
                      });
                      if (v.anchors) setAnchors(v.anchors);
                      if (v.nudges) setNudges(v.nudges);
                      setPasteBox("");
                      setLockedMsg("Settings applied from the other instance.");
                    } catch (err) { setLockedMsg("That doesn't look like settings text."); }
                  }}>Apply pasted settings</Pill>
                </div>
              )}
            </div>

            {(() => {
              const identity = transforms.dl && transforms.dca
                && Math.abs(transforms.dl.scale - 1) < 1e-6 && Math.abs(transforms.dl.b) < 1e-6
                && Math.abs(transforms.dca.scale - 1) < 1e-6 && Math.abs(transforms.dca.b) < 1e-6;
              return (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.rule}` }}>
                  <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 6 }}>
                    Coordinate frame
                  </div>
                  <div style={{ fontSize: 15, color: identity ? C.green : C.text, fontWeight: identity ? 700 : 400, lineHeight: 1.45 }}>
                    {identity
                      ? "Locked. Pin positions are stored exactly as drawn — no transform is being applied."
                      : "A calibration transform is being applied on top of the stored positions. Lock it in and the two collapse into one, so nothing can drift."}
                  </div>
                  {!identity && transforms.dl && transforms.dca && (
                    <div style={{ marginTop: 10 }}>
                      <Pill solid onClick={lockInCalibration}>Lock these positions in</Pill>
                    </div>
                  )}
                  {lockedMsg && <Note tone="good">{lockedMsg}</Note>}
                </div>
              );
            })()}
          </Card>

          <Card>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Adjust pin positions</div>
            <div style={{ fontSize: 15.5, color: C.grey, lineHeight: 1.5, marginBottom: 12 }}>
              My placements are estimates, so some pins sit in the wrong spot. This walks you through
              every attraction one at a time — tap where it really is and it advances to the next.
              Pinch to zoom in first; corrections are saved as you go.
            </div>
            <div style={{ marginBottom: 12 }}>
              <Toggle on={editUnchecked} onClick={() => setEditUnchecked(!editUnchecked)}
                label={`Only the ${ATTRACTIONS.filter((a) => a.kind !== "shop" && !REVIEWED.has(a.id)).length} still unconfirmed`} />
            </div>
            <div style={{ marginTop: 4, marginBottom: 14 }}>
              <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 7 }}>
                Fix just one
              </div>
              <input value={pickSearch} onChange={(e) => setPickSearch(e.target.value)}
                placeholder="Search attractions…"
                style={{
                  width: "100%", boxSizing: "border-box", padding: "10px 13px", borderRadius: 12,
                  border: `1.5px solid ${C.border}`, fontFamily: F, fontSize: 15.5, color: C.navy, outline: "none",
                }} />
              {pickSearch.trim().length > 0 && (
                <div style={{ maxHeight: 220, overflowY: "auto", marginTop: 8, border: `1px solid ${C.rule}`, borderRadius: 12 }}>
                  {ATTRACTIONS.filter((a) => a.kind !== "shop" &&
                      (a.name + " " + a.landName).toLowerCase().includes(pickSearch.trim().toLowerCase()))
                    .slice(0, 40).map((a) => (
                      <button key={a.id} onClick={() => {
                        setEditQueue([a.id]); setEditIdx(0); setEditing(true);
                        setPickSearch(""); if (screen === "play") setTab("map");
                      }} style={{
                        display: "flex", width: "100%", alignItems: "center", gap: 10, cursor: "pointer",
                        background: C.white, border: "none", borderBottom: `1px solid ${C.rule}`,
                        padding: "10px 12px", fontFamily: F, textAlign: "left",
                      }}>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, color: C.navy }}>{a.name}</span>
                          <span style={{ display: "block", fontSize: 13.5, color: C.grey }}>
                            {a.landName} · {PARKS[a.park].short}
                          </span>
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.blue }}>Adjust</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
              Walk through a set
            </div>
            <Row>
              <Pill solid onClick={() => startWalk(null)}>
                Whole resort · {walkCount(null)}
              </Pill>
              {Object.values(PARKS).map((p) => (
                <Pill key={p.id} onClick={() => walkCount(p.id) && startWalk(p.id)}>
                  {p.short} · {walkCount(p.id)}
                </Pill>
              ))}
            </Row>
            <div style={{ height: 10 }} />
            <Row>
              <Pill onClick={() => {
                if (!confirmReset) { setConfirmReset(true); return; }
                setNudges({});
                setEditQueue(null);
                setEditUnchecked(false);   // a clean pass means every attraction
                setEditIdx(0);
                setConfirmReset(false);
                setEditing(true);
                if (screen === "play") setTab("map");
              }}>
                {confirmReset ? "Tap again to confirm" : "Start over from scratch"}
              </Pill>
            </Row>
            {confirmReset && (
              <Note tone="bad">
                This clears every adjustment you've made and walks you through all{" "}
                {ATTRACTIONS.filter((a) => a.kind !== "shop").length} attractions from the beginning.
              </Note>
            )}
            {Object.keys(nudges).length > 0 && (
              <>
                <Note tone="good">
                  {Object.keys(nudges).length} of {ATTRACTIONS.filter((a) => a.kind !== "shop").length} repositioned this session.
                </Note>
                <div style={{ fontSize: 14.5, color: C.grey, marginTop: 14, lineHeight: 1.5 }}>
                  Every attraction is listed below — the ones you haven't re-checked are marked,
                  so a partial pass is still safe to send:
                </div>
                <textarea readOnly onFocus={(e) => e.target.select()}
                  value={"const FRAME = " + JSON.stringify({
                    dl: frame.dl.map((p) => [p.x, p.y]), dca: frame.dca.map((p) => [p.x, p.y]),
                  }) + ";\n\nconst FIXED = {\n" + ATTRACTIONS.filter((a) => a.kind !== "shop").map((a) => {
                    const p = nudges[a.id] || { x: a.x, y: a.y };
                    return `  "${a.id}": [${p.x}, ${p.y}],${nudges[a.id] ? "" : "   // not re-checked"}`;
                  }).join("\n") + "\n};"}
                  style={{
                    width: "100%", height: 140, marginTop: 8, padding: 10, boxSizing: "border-box",
                    border: `1px solid ${C.border}`, borderRadius: 10, background: C.gap,
                    fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: C.text, resize: "vertical",
                  }} />
              </>
            )}
          </Card>
        </div>
            <div style={{ padding: "4px 16px 26px" }}>
              <BigButton disabled={!ready} onClick={() => start()}>
                {ready ? "Open the Gates" : "Calibrate both parks first"}
              </BigButton>
            </div>
          </div>
        )}
      </Shell>
    );
  }

  /* ---------- overnight recap ---------- */
  if (screen === "recap") {
    const total = RUN_MODES[runMode].days;
    const won = total > 0 && runDay >= total;
    if (won) { setTimeout(endRun, 0); return <Shell><div /></Shell>; }
    const rows = [
      ["Energy", energy, overnight.energy(energy, runDay + 1), C.amber],
      ["Hunger", fuel, overnight.fuel(fuel), C.green],
      ["Comfort", comfort, overnight.comfort(comfort, runDay + 1), C.blue],
    ];
    return (
      <Shell>
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 18px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 12.5, letterSpacing: ".18em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>
            {total ? `Day ${runDay} of ${total}` : `Day ${runDay}`} · done
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.pink, margin: "6px 0 0", lineHeight: 1.1 }}>
            {Math.round(joy)}
          </div>
          <div style={{ fontSize: 15, color: C.grey, marginBottom: 4 }}>happiness today</div>
          <div style={{ fontSize: 15.5, color: C.navy, fontWeight: 700, marginBottom: 20 }}>
            {Math.round(runTotal + joy)} across the run
          </div>

          <div style={{ maxWidth: 340, margin: "0 auto 18px", textAlign: "left" }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
              After a night's sleep
            </div>
            <div style={{ fontSize: 14, color: C.grey, lineHeight: 1.45, marginBottom: 9 }}>
              You get some of it back, never all of it — and you spend eight hours not eating.
            </div>
            {rows.map(([label, was, will, col]) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10, background: C.gap,
                borderRadius: 11, padding: "10px 13px", marginBottom: 7,
              }}>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700, color: C.navy }}>{label}</span>
                <span style={{ fontSize: 15, color: C.greyLt }}>{Math.round(was)}</span>
                <span style={{ fontSize: 15, color: C.greyLt }}>→</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: will < 40 ? C.red : col }}>{will}</span>
              </div>
            ))}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, background: C.gap,
              borderRadius: 11, padding: "10px 13px",
            }}>
              <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700, color: C.navy }}>Money kept</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: C.green }}>
                ${Math.max(0, Math.round(wallet))}
              </span>
            </div>
            <div style={{ fontSize: 14, color: C.grey, lineHeight: 1.45, marginTop: 9 }}>
              Tomorrow you get another ${budgetOf} on top of what's left. The park will be as busy
              as it happens to be — but you'll tire and wilt
              {" "}{Math.round((dayFatigue(runDay + 1) - 1) * 100)}% faster than on day one, and there's
              only so much a night's sleep gives back.
            </div>
          </div>

          <div style={{ maxWidth: 340, margin: "0 auto", textAlign: "left" }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
              Start tomorrow in
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {Object.values(PARKS).map((p) => (
                <button key={p.id} onClick={() => nextDay(p.id)} style={{
                  flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer", fontFamily: F,
                  fontSize: 15.5, fontWeight: 800, border: "none", background: C.blue, color: C.white,
                }}>{p.short}</button>
              ))}
            </div>
            <TextLink onClick={endRun} style={{ display: "block", textAlign: "center", marginTop: 16 }}>
              Stop here and score the run
            </TextLink>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---------- play ---------- */
  const selA = sel ? byId[sel] : null;
  const listed = visible
    .map((a) => ({ a, w: walkMinutes(pos, place(a), t) }))
    .sort((p, q) => p.w - q.w);

  return (
    <Shell>
      <StatusBar t={t} joy={joy} energy={energy} fuel={fuel} comfort={comfort} wallet={wallet} ll={llLeft} seed={seed} unlimited={unlimited} />

      {(tab === "map" || tab === "list") && !editing && !run && (
        <>
          <CatTabs cat={cat} setCat={setCat} />
          <FilterRow
            mapPark={mapPark} setMapPark={setMapPark}
            eOnly={eOnly} setEOnly={setEOnly}
            hideDone={hideDone} setHideDone={setHideDone}
            onReset={() => { setEOnly(false); setHideDone(false); setCat("ride"); }}
          />
        </>
      )}

      {tab === "map" && (
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <ParkMap {...mapProps}
            items={(editing ? ATTRACTIONS.filter((a) => a.kind !== "shop" && ((showBoth && basemap) || a.park === mapPark)) : visible).map(place)}
            sel={sel} onSelect={setSel} visited={visited} />
          {flash && <Flash key={flash.key} name={flash.name} net={flash.net} />}
          {run && <ActivityRunner run={run} speed={speed} setSpeed={setSpeed} onSkip={skipRun} />}
          {!editing && !run && <ShowListButton onClick={() => setTab("list")} />}
        </div>
      )}

      {tab === "list" && !run && (
        <div style={{ flex: 1, overflowY: "auto", background: C.gap }}>
          {listed.length === 0 && <Empty>Nothing matches those filters right now.</Empty>}
          {listed.map(({ a, w }) => (
            <AttractionCard key={a.id} a={dress(a)} wait={waits[a.id]} walk={w} reps={visited[a.id] || 0}
              llOk={llReady(a.id)} llFree={!boughtLl && !singlePass[a.id]} freeLeft={freeLL}
              mustSwitch={needsSwitch(a, party)} hopBlocked={hopBlock(a)} parkShut={!parkOpenNow(a.park, t)} t={t} wallet={wallet}
              onOpen={() => setSel(a.id)} onGo={beginAttraction} />
          ))}
          <div style={{ height: 12 }} />
        </div>
      )}

      {tab === "day" && <DayLog log={log} />}
      {tab === "you" && <YouTab onBreak={beginBreak} onBuyLL={buyLightningLane} onBuyHopper={buyHopper} hopper={hopper} wallet={wallet} freeLeft={freeLL} closeAt={closeAt} freeLL={freeLL} ll={llLeft} boughtLl={boughtLl}
        energy={energy} fuel={fuel} comfort={comfort} joy={joy} visited={visited} t={t} seedWeather={seed.weather} />}
      {(() => {
        const shutSoon = PARK_CLOSE.dca - M(t);
        if (!(shutSoon > 0 && shutSoon <= 60) || dcaWarned.current) return null;
        return null;
      })()}

      {goingHome && (
        <>
          <div onClick={() => setGoingHome(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(18,40,63,.42)", zIndex: 30 }} />
          <div style={{
            position: "absolute", left: 18, right: 18, top: "26%", zIndex: 31, background: C.white,
            borderRadius: 18, boxShadow: "0 8px 30px rgba(18,40,63,.3)", padding: "18px 18px 20px",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>Call it a day?</div>
            <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.5, marginTop: 6 }}>
              {t < closeAt
                ? `There are still ${Math.floor((closeAt - t) / 60)}h ${(closeAt - t) % 60}m before the park closes. Heading back now ends the day and scores it where it stands.`
                : "The park is closing anyway."}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", marginTop: 12, padding: "10px 12px",
              background: C.gap, borderRadius: 10, fontSize: 15.5,
            }}>
              <span style={{ color: C.grey }}>Happiness so far</span>
              <span style={{ fontWeight: 800, color: C.pink }}>{Math.round(joy)}</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <BigButton onClick={() => { setGoingHome(false); setScreen("end"); }}>Head home</BigButton>
            </div>
            <TextLink onClick={() => setGoingHome(false)} style={{ display: "block", textAlign: "center", marginTop: 12 }}>
              Keep going
            </TextLink>
          </div>
        </>
      )}

      {eventCard && <EventCard ev={eventCard} onClose={() => setEventCard(null)} onChoose={chooseOption} />}

      {selA && !calib && !editing && !run && (
        <Sheet a={dress(selA)} wait={waits[selA.id]} walk={walkMinutes(pos, place(selA), t)}
          hop={pos.park !== selA.park} reps={visited[selA.id] || 0}
          wallet={wallet} llOk={llReady(selA.id)}
          llFree={!boughtLl && !singlePass[selA.id]} freeLeft={freeLL}
          spPrice={singlePass[selA.id] ? 0 : (SINGLE_PASS[selA.id] || 0)} onBuySingle={buySinglePass}
          mustSwitch={needsSwitch(selA, party)} hopBlocked={hopBlock(selA)} onBuyHopper={buyHopper} t={t}
          onClose={() => setSel(null)} onGo={beginAttraction} onTrain={beginTrain} />
      )}

      <TabBar tab={tab} setTab={(id) => (id === "home" ? setGoingHome(true) : setTab(id))} disabled={!!run} />
    </Shell>
  );
}

/* ================= map ================= */
function ParkMap({ park, items, waits, pos, sel, onSelect, visited, basemap, transforms, calib, anchors, onAnchor, calibWarn, onCancelCalib, showBoth,
                  editing, editTarget, onPlacePin, editIdx, editCount, nudged, onEditStep, onEditDone, onEditUndo,
                  moving, closures, onSwitchPark, placeOk }) {
  const H = basemap ? Math.round(CANVAS_W * basemap.h / basemap.w) : CANVAS_H;
  const T = transforms[park];
  const fitted = !!(basemap && T);

  const [view, setView] = useState(null);
  const drag = useRef(null), moved = useRef(false), pinch = useRef(null), layer = useRef(null);
  const raf = useRef(0), pendingRef = useRef(null), lastTap = useRef(0);

  useEffect(() => {
    if (fitted && !showBoth) {
      const c = applyT(T, 500, park === "dl" ? 420 : 1120);
      const raw = 1 / (T.scale * 1.02);
      setView({ cx: safe(c.x, 500), cy: safe(c.y, H / 2), k: isFinite(raw) ? Math.max(0.35, Math.min(9, raw)) : 1 });
    } else if (basemap) {
      setView({ cx: 500, cy: H / 2, k: 1 });
    } else {
      setView({ cx: 500, cy: park === "dl" ? 420 : 1120, k: 1.5 });
    }
  }, [park, fitted, showBoth, basemap && basemap.src, T && T.scale, T && T.tx]);

  const v = view || { cx: 500, cy: H / 2, k: 1 };
  const viewRef = useRef(v);
  useEffect(() => { viewRef.current = v; }, [v.cx, v.cy, v.k]);
  const clampK = (k) => (isFinite(k) ? Math.max(0.35, Math.min(18, k)) : 1);

  const paint = (nv) => {
    const g = layer.current;
    if (!g) return;
    g.setAttribute("transform",
      `translate(500 ${H / 2}) scale(${safe(nv.k, 1)}) translate(${-safe(nv.cx, 500)} ${-safe(nv.cy, H / 2)})`);
  };
  const schedule = (nv) => {
    pendingRef.current = nv;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => { raf.current = 0; if (pendingRef.current) paint(pendingRef.current); });
  };
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  /* Freeze the screen->map matrix at gesture start. Recomputing it per frame
     made the same finger position map to a moving coordinate, which is what
     caused the pan to judder. */
  const onDown = (cx, cy) => {
    const g = layer.current, m = g && g.getScreenCTM();
    if (!m) return;
    drag.current = { inv: m.inverse(), sx: cx, sy: cy, cx: v.cx, cy: v.cy, last: null };
    moved.current = false;
  };
  const onMove = (cx, cy) => {
    const d = drag.current, g = layer.current;
    if (!d || !g) return;
    const svg = g.ownerSVGElement;
    const p1 = svg.createSVGPoint(); p1.x = d.sx; p1.y = d.sy;
    const p2 = svg.createSVGPoint(); p2.x = cx; p2.y = cy;
    const a = p1.matrixTransform(d.inv), b = p2.matrixTransform(d.inv);
    const dx = b.x - a.x, dy = b.y - a.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved.current = true;
    const nv = { k: v.k, cx: d.cx - dx, cy: d.cy - dy };
    d.last = nv; schedule(nv);
  };
  const onUp = () => { const d = drag.current; drag.current = null; if (d && d.last) setView(d.last); };

  const zoom = (m) => {
    const cur = viewRef.current;
    setView({ ...cur, k: clampK(cur.k * m) });
  };

  /* Zoom about the cursor rather than the centre: the map point under the
     pointer must land in the same place before and after.
       screen = (p - c) * k     =>     c' = p - (p - c) * k / k'          */
  const wrap = useRef(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      // a Mac trackpad pinch arrives as a wheel event with ctrlKey set
      const factor = Math.pow(e.ctrlKey ? 0.985 : 0.9985, e.deltaY);
      const cur = viewRef.current;
      const k = clampK(cur.k * factor);
      if (k === cur.k) return;
      const p = toMap(e.clientX, e.clientY);
      if (!p || !isFinite(p.x) || !isFinite(p.y)) { setView({ ...cur, k }); return; }
      setView({
        cx: p.x - (p.x - cur.cx) * (cur.k / k),
        cy: p.y - (p.y - cur.cy) * (cur.k / k),
        k,
      });
    };
    // must be non-passive, or preventDefault is ignored and the page scrolls
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const spread = (e) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  const touchStart = (e) => {
    if (e.touches.length >= 2) {
      const d = spread(e);
      pinch.current = d > 0 ? { d, k: v.k, cx: v.cx, cy: v.cy } : null;
      drag.current = null; moved.current = true;
    } else if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
  };
  const touchMove = (e) => {
    if (e.touches.length >= 2) {
      const p = pinch.current;
      if (!p || !(p.d > 0)) return;
      const d = spread(e);
      if (!(d > 0)) return;
      const nv = { cx: p.cx, cy: p.cy, k: clampK(p.k * (d / p.d)) };
      p.last = nv; schedule(nv);
      p.n = (p.n || 0) + 1;
      if (p.n % 5 === 0) setView(nv);
    } else if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const touchEnd = (e) => {
    const left = e && e.touches ? e.touches.length : 0;
    if (left < 2 && pinch.current) { if (pinch.current.last) setView(pinch.current.last); pinch.current = null; }
    if (left === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
    else if (left === 0) onUp();
  };

  function toMap(cx, cy) {
    const g = layer.current;
    if (!g) return null;
    const svg = g.ownerSVGElement, p = svg.createSVGPoint();
    p.x = cx; p.y = cy;
    const m = g.getScreenCTM();
    return m ? p.matrixTransform(m.inverse()) : null;
  }
  function surfaceTap(e) {
    if ((!calib && !editing) || moved.current) return;
    const now = Date.now();
    if (now - lastTap.current < 500) return;
    const tc = e.changedTouches && e.changedTouches[0];
    const cx = tc ? tc.clientX : e.clientX, cy = tc ? tc.clientY : e.clientY;
    if (cx == null) return;
    const pt = toMap(cx, cy);
    if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) return;
    lastTap.current = now;
    if (calib) onAnchor(calib, pt);
    else if (editing) onPlacePin(pt);
  }

  const pinK = (H / 1000) / v.k;
  const shown = showBoth && fitted ? items : items.filter((a) => a.park === park);
  const step = calib ? anchors[calib].length : 0;
  const recenter = () => {
    const p = fitted ? applyT(transforms[pos.park], pos.x, pos.y) : pos;
    setView({ cx: safe(p.x, 500), cy: safe(p.y, H / 2), k: Math.max(v.k, 2.2) });
  };

  return (
    <div ref={wrap}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#DCE6EA", touchAction: "none" }}
      onTouchStart={touchStart} onTouchMove={touchMove} onTouchCancel={touchEnd}
      onTouchEnd={(e) => { touchEnd(e); surfaceTap(e); }}
      onMouseDown={(e) => onDown(e.clientX, e.clientY)} onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onMouseUp={onUp} onMouseLeave={onUp} onClick={surfaceTap}>
      <svg viewBox={`0 0 ${CANVAS_W} ${H}`} preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}>
        <g ref={layer} transform={`translate(500 ${H / 2}) scale(${safe(v.k, 1)}) translate(${-safe(v.cx, 500)} ${-safe(v.cy, H / 2)})`}>
          {basemap
            ? <image href={basemap.src} xlinkHref={basemap.src} x="0" y="0" width={CANVAS_W} height={H} style={{ pointerEvents: "none" }} />
            : <ResortArt />}

          {calib && anchors[calib].map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${pinK})`} style={{ pointerEvents: "none" }}>
              <circle r="14" fill="none" stroke={C.blue} strokeWidth="3" />
              <circle r="4" fill={C.blue} />
              <text x="18" y="6" style={{ fontFamily: F, fontSize: 16, fontWeight: 800, fill: C.blue }}>{i + 1}</text>
            </g>
          ))}

          {/* Always drawn, whichever park is on screen - both parks share one map,
              and losing track of yourself mid park-hop is disorienting. */}
          {!calib && !editing && (() => {
            const p = fitted ? applyT(transforms[pos.park], pos.x, pos.y) : pos;
            if (!isFinite(p.x) || !isFinite(p.y)) return null;
            const k = pinK * 1.6;
            return (
              <g transform={`translate(${p.x} ${p.y}) scale(${k})`}
                style={{ pointerEvents: "none", transition: moving ? "transform .95s linear" : "none" }}>
                <ellipse cy="3" rx="13" ry="4" fill="rgba(18,40,63,.3)" />
                {moving && <circle r="26" fill={C.blue} opacity=".15" />}
                <circle cy="-15" r="21" fill={C.white} opacity=".55" />
                <path d="M0 3 C -15 -11 -15 -30 0 -30 C 15 -30 15 -11 0 3 Z"
                  fill={C.blue} stroke={C.white} strokeWidth="3.5" strokeLinejoin="round" />
                <circle cx="0" cy="-22" r="4.6" fill={C.white} />
                <path d="M-6 -8.5 C -6 -15.5, 6 -15.5, 6 -8.5 Z" fill={C.white} />
              </g>
            );
          })()}

          {!calib && shown.map((a) => {
            const p = fitted ? applyT(transforms[a.park], a.x, a.y) : a;
            if (!isFinite(p.x) || !isFinite(p.y)) return null;
            const isTarget = editing && editTarget && editTarget.id === a.id;
            return <MapPin key={a.id} a={a} px={p.x} py={p.y} w={waits[a.id]} pinK={safe(pinK, 1)}
              selected={isTarget || (!editing && sel === a.id)} done={!!visited[a.id]}
              dim={editing && !isTarget} nameLabel={editing ? a.name : null}
              /* Pins are inert while editing. They used to call onPlacePin directly,
                 which skipped the duplicate-tap guard, so one tap near a pin placed
                 TWO attractions — the second landing on whatever came next. */
              inert={editing}
              onTap={() => { if (!moved.current && !editing) onSelect(a.id); }} />;
          })}
        </g>
      </svg>

      {!calib && (
        <div onClick={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}
          style={{ position: "absolute", right: 12, top: 12, display: "flex", flexDirection: "column", gap: 7 }}>
          <MapBtn onClick={() => zoom(1.45)} label="Zoom in">+</MapBtn>
          <MapBtn onClick={() => zoom(0.69)} label="Zoom out">–</MapBtn>
        </div>
      )}

      {!calib && (
        <button onClick={(e) => { e.stopPropagation(); recenter(); }}
          onTouchEnd={(e) => e.stopPropagation()} aria-label="Centre on me" style={{
          position: "absolute", left: 14, bottom: 16, width: 52, height: 52, borderRadius: 26,
          background: C.white, border: "none", boxShadow: C.shadow, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon d="locate" c={C.blue} s={24} /></button>
      )}

      {editing && editTarget && (
        <div onClick={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}
          style={{
          position: "absolute", left: 10, right: 10, bottom: 10, background: C.white,
          borderRadius: 14, boxShadow: C.shadow, padding: "12px 14px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>
  {editCount === 1 ? "Fixing one" : `${editIdx + 1} of ${editCount}`} · {nudged} moved
            </div>
            <TextLink onClick={(e) => { e.stopPropagation(); onEditDone(); }}>Done</TextLink>
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginTop: 2 }}>{editTarget.name}</div>
          {placeOk && (
            <div style={{ fontSize: 14, fontWeight: 800, color: C.green, marginTop: 2 }}>
              ✓ Placed {placeOk.name}
            </div>
          )}
          <div style={{ fontSize: 14.5, color: C.grey, marginTop: 1 }}>
            {editTarget.landName} · {PARKS[editTarget.park].short} — tap where it really is
          </div>
          {editTarget.park !== park && (
            <div style={{
              marginTop: 8, background: "#FFF4E5", border: "1px solid #F3D5A6", borderRadius: 8,
              padding: "7px 10px", fontSize: 14, color: "#8A5B12", fontWeight: 700,
            }}>
              This one is in {PARKS[editTarget.park].short} — switch parks below before tapping.
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {Object.values(PARKS).map((p) => (
              <Pill key={p.id} solid={park === p.id}
                onClick={(e) => { e.stopPropagation(); onSwitchPark(p.id); }}>{p.short}</Pill>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Pill onClick={(e) => { e.stopPropagation(); onEditUndo(); }}>Undo</Pill>
            <Pill onClick={(e) => { e.stopPropagation(); onEditStep(-1); }}>Back</Pill>
            <Pill onClick={(e) => { e.stopPropagation(); onEditStep(1); }}>Skip</Pill>
          </div>
        </div>
      )}

      {calib && (
        <div onClick={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}
          style={{
          position: "absolute", left: 10, right: 10, bottom: 10, background: C.white,
          borderRadius: 14, boxShadow: C.shadow, padding: "12px 14px",
        }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>
            {PARKS[calib].short} — point {Math.min(step + 1, 2)} of 2
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginTop: 2 }}>
            Tap {ANCHORS[calib][Math.min(step, 1)].label}
          </div>
          <div style={{ fontSize: 14.5, color: C.grey, marginTop: 2, lineHeight: 1.4 }}>
            {ANCHORS[calib][Math.min(step, 1)].hint}. Pinch to zoom in first for accuracy.
          </div>
          {calibWarn && <Note tone="bad">{calibWarn}</Note>}
          <TextLink onClick={(e) => { e.stopPropagation(); onCancelCalib(); }} style={{ marginTop: 10, display: "inline-block" }}>
            Cancel
          </TextLink>
        </div>
      )}
    </div>
  );
}

/* the Disney-app style wait bubble */
function MapBtn({ children, onClick, label }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label={label} style={{
      width: 40, height: 40, borderRadius: 20, background: C.white, border: "none",
      boxShadow: C.shadow, cursor: "pointer", fontFamily: F, fontSize: 21, fontWeight: 800,
      color: C.navy, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
}

function MapPin({ a, px, py, w, pinK, selected, done, dim, nameLabel, inert, onTap }) {
  const isRide = a.kind === "ride" || a.kind === "night";
  const closed = w < 0;
  const showNum = isRide && w > 0;
  const label = showNum ? String(w) : null;
  const bw = showNum ? 74 : 46;
  const bh = showNum ? 56 : 46;
  const bg = selected ? C.blue : closed ? "#F0F2F4" : C.white;
  const fg = selected ? C.white : closed ? C.greyLt : C.navy;
  return (
    <g transform={`translate(${px} ${py}) scale(${pinK})`} onClick={(e) => { e.stopPropagation(); onTap(); }}
      opacity={dim ? 0.42 : 1}
      style={{ cursor: inert ? "crosshair" : "pointer", pointerEvents: inert ? "none" : "auto" }}>
      {nameLabel && selected && (
        <>
          <text x="0" y="24" textAnchor="middle" stroke={C.white} strokeWidth="4.5" strokeLinejoin="round"
            style={{ fontFamily: F, fontSize: 15, fontWeight: 800 }}>{nameLabel}</text>
          <text x="0" y="24" textAnchor="middle" style={{ fontFamily: F, fontSize: 15, fontWeight: 800, fill: C.blue }}>{nameLabel}</text>
        </>
      )}
      <path d={`M${-bw / 2} ${-bh - 12} h${bw} a8 8 0 018 8 v${bh - 16} a8 8 0 01-8 8 h${-bw / 2 + 7} l-7 12 l-7 -12 h${-bw / 2 + 7} a8 8 0 01-8 -8 v${-bh + 16} a8 8 0 018 -8 z`}
        transform={`translate(0 ${-2})`} fill={bg} stroke={done ? C.border : "rgba(18,40,63,.14)"} strokeWidth="1.5" />
      {closed ? (
        // no wait to show, so fall back to the attraction icon rather than a cross
        <g transform={`translate(-11 ${-bh + 3}) scale(0.92)`} opacity="0.55">
          {I.star(C.greyLt, false)}
        </g>
      ) : showNum ? (
        <>
          <text x="0" y={-bh + 20} textAnchor="middle" style={{ fontFamily: F, fontSize: 27, fontWeight: 800, fill: done ? C.greyLt : fg }}>{label}</text>
          <text x="0" y={-bh + 38} textAnchor="middle" style={{ fontFamily: F, fontSize: 13, fontWeight: 600, fill: selected ? C.white : C.grey }}>Min Wait</text>
        </>
      ) : (
        <g transform={`translate(-11 ${-bh - 1}) scale(0.92)`}>
          {a.kind === "train" ? I.train(selected ? C.white : C.navy)
            : a.kind === "dine" ? I.fork(selected ? C.white : C.navy)
            : isRide ? I.star(selected ? C.white : C.navy, true)
            : I.hat(selected ? C.white : C.navy)}
        </g>
      )}
    </g>
  );
}

/* ================= chrome ================= */
function Shell({ children }) {
  return (
    // position:fixed beats 100vh on iOS, where 100vh includes browser chrome
    // and pushes the tab bar below the fold
    <div style={{
      position: "fixed", inset: 0, background: "#0E1B26",
      display: "flex", justifyContent: "center", overflow: "hidden",
    }}>
      <div style={{
        width: "100%", maxWidth: 440, background: C.white, height: "100%",
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
        fontFamily: F, color: C.text, WebkitFontSmoothing: "antialiased",
      }}>{children}</div>
    </div>
  );
}

function NavBar({ title, onBack }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "14px 12px", borderBottom: `1px solid ${C.rule}`,
      flexShrink: 0, background: C.white,
    }}>
      <div style={{ width: 30 }}>{onBack && <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}><Icon d="chevron" c={C.blue} s={22} /></button>}</div>
      <div style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: 800, color: C.navy }}>{title}</div>
      <div style={{ width: 30 }} />
    </div>
  );
}

function StatusBar({ t, joy, energy, fuel, comfort, wallet, ll, seed, unlimited }) {
  return (
    <div style={{ padding: "7px 14px 8px", borderBottom: `1px solid ${C.rule}`, flexShrink: 0, background: C.white }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
          <span style={{ fontSize: 18.5, fontWeight: 800, color: C.navy }}>{clock(t)}</span>
          <span style={{ fontSize: 13.5, color: C.greyLt, fontWeight: 600 }}>
            {weatherLabel(seed.weather, t, seed.warm)} · {seed.crowd > 1.25 ? "Packed" : seed.crowd > 1.0 ? "Busy" : seed.crowd > 0.78 ? "Moderate" : "Light"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {ll > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: C.blue, fontWeight: 800, fontSize: 13.5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24">{I.ll(C.blue)}</svg>{ll}
            </span>
          )}
          <span style={{ fontSize: 17.5, fontWeight: 800, color: C.green }}>{unlimited ? "\u221E" : `$${Math.max(0, Math.round(wallet))}`}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 27, fontWeight: 800, color: C.pink, lineHeight: 1 }}>{Math.round(joy)}</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: C.greyLt, textTransform: "uppercase" }}>
            Happiness
          </span>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          <Meter label="Energy" v={energy} c={C.amber} />
          {/* Full and green when you're fed; drains and reddens as hunger sets in,
              so it reads the same way as Energy and Comfort. */}
          <Meter label="Hunger" v={fuel}
            c={fuel < 25 ? C.red : fuel < 50 ? C.amber : C.green} />
          <Meter label="Comfort" v={comfort} c={comfort < 30 ? C.red : C.blue} />
        </div>
      </div>
    </div>
  );
}

function Meter({ label, v, c }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: C.greyLt }}>
        <span>{label}</span><span style={{ color: C.text }}>{Math.round(v)}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: C.rule, marginTop: 2, overflow: "hidden" }}>
        <div style={{ width: `${clamp(v)}%`, height: "100%", background: c, borderRadius: 3, transition: "width .35s ease" }} />
      </div>
    </div>
  );
}

function CatTabs({ cat, setCat }) {
  return (
    <div style={{ display: "flex", padding: "6px 4px 5px", borderBottom: `1px solid ${C.rule}`, flexShrink: 0, background: C.white }}>
      {CATS.map((c) => {
        const on = cat === c.id;
        return (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", padding: "2px 0",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <span style={{
              width: 33, height: 33, borderRadius: 17, background: on ? C.blueTint : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icon d={c.icon} c={on ? C.blue : C.navy} f={c.icon === "star" && on} s={20} /></span>
            <span style={{ fontSize: 11.5, fontWeight: on ? 800 : 600, color: on ? C.blue : C.navy }}>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FilterRow({ mapPark, setMapPark, eOnly, setEOnly, hideDone, setHideDone, onReset }) {
  return (
    <div style={{
      display: "flex", gap: 7, padding: "7px 12px", overflowX: "auto", flexShrink: 0,
      background: C.white, borderBottom: `1px solid ${C.rule}`, alignItems: "center",
    }}>
      <Chip on={mapPark === "dl"} onClick={() => setMapPark("dl")}>Disneyland</Chip>
      <Chip on={mapPark === "dca"} onClick={() => setMapPark("dca")}>California Adventure</Chip>
      <Chip on={eOnly} onClick={() => setEOnly(!eOnly)}>E-Tickets</Chip>
      <Chip on={hideDone} onClick={() => setHideDone(!hideDone)}>Not Done Yet</Chip>
      <TextLink onClick={onReset} style={{ whiteSpace: "nowrap", paddingLeft: 2 }}>Reset All Filters</TextLink>
    </div>
  );
}

const Chip = ({ on, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: "5px 13px", borderRadius: 18, whiteSpace: "nowrap", cursor: "pointer",
    border: `1.5px solid ${on ? C.blue : C.border}`, background: on ? C.blue : C.white,
    color: on ? C.white : C.navy, fontFamily: F, fontSize: 13.5, fontWeight: 700,
  }}>{children}</button>
);

const TextLink = ({ onClick, children, style }) => (
  <button onClick={(e) => onClick && onClick(e)} style={{
    background: "none", border: "none", padding: 0, cursor: "pointer",
    color: C.blue, fontFamily: F, fontSize: 15, fontWeight: 700, ...style,
  }}>{children}</button>
);

const Pill = ({ onClick, solid, children }) => (
  <button onClick={(e) => onClick && onClick(e)} style={{
    padding: "9px 18px", borderRadius: 22, cursor: "pointer", fontFamily: F, fontSize: 15, fontWeight: 700,
    border: `1.5px solid ${C.blue}`, background: solid ? C.blue : C.white, color: solid ? C.white : C.blue,
  }}>{children}</button>
);

const Row = ({ children }) => <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>;

const Card = ({ children }) => (
  <div style={{ background: C.white, padding: 16, marginBottom: 10 }}>{children}</div>
);

const Empty = ({ children }) => (
  <div style={{ padding: "40px 24px", textAlign: "center", color: C.grey, fontSize: 15.5 }}>{children}</div>
);

const Note = ({ tone, children }) => (
  <div style={{
    marginTop: 9, fontSize: 14.5, lineHeight: 1.45, fontWeight: 600,
    color: tone === "good" ? C.green : tone === "bad" ? C.red : C.grey,
  }}>{children}</div>
);

const BigButton = ({ disabled, onClick, children }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", padding: "15px 18px", borderRadius: 26, border: "none", cursor: disabled ? "default" : "pointer",
    background: disabled ? "#C9D6E0" : C.blue, color: C.white, fontFamily: F, fontSize: 17, fontWeight: 800,
    boxShadow: disabled ? "none" : "0 2px 6px rgba(5,120,190,.34)",
  }}>{children}</button>
);

const Toggle = ({ on, onClick, label }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none",
    border: "none", padding: 0, cursor: "pointer", fontFamily: F,
  }}>
    <span style={{ flex: 1, textAlign: "left", fontSize: 15.5, fontWeight: 700, color: C.navy }}>{label}</span>
    <span style={{ width: 50, height: 30, borderRadius: 15, background: on ? C.blue : "#C9D6E0", position: "relative", transition: "background .2s" }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: 12,
        background: C.white, boxShadow: "0 1px 3px rgba(0,0,0,.3)", transition: "left .2s",
      }} />
    </span>
  </button>
);

function Step({ n, title, done, children }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14, flexShrink: 0, background: done ? C.green : C.blueTint,
        color: done ? C.white : C.blue, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 800,
      }}>{done ? "✓" : n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 7 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function ShowListButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "absolute", right: 14, bottom: 16, display: "flex", alignItems: "center", gap: 9,
      padding: "13px 22px", borderRadius: 28, background: C.white, border: "none",
      boxShadow: C.shadow, cursor: "pointer", fontFamily: F, fontSize: 17, fontWeight: 700, color: C.navy,
    }}>
      <Icon d="list" c={C.navy} s={21} />Show List
    </button>
  );
}

/* ---------------- attraction card (list) ---------------- */
function AttractionCard({ a, wait, walk, reps, llOk, llFree, freeLeft, mustSwitch, hopBlocked, parkShut, t, wallet, onOpen, onGo }) {
  const isRide = a.kind === "ride" || a.kind === "night";
  // no wait threshold: Disney lets you book any eligible ride, and spending a
  // skip on a walk-on is a real mistake the player is allowed to make
  const canLL = llOk;
  const singleOk = singleRiderOpen(a.id, t) && wait >= 10;
  const singleWait = Math.max(5, Math.round((wait * SINGLE_WAIT) / 5) * 5);
  const broke = a.cost > wallet;
  const sub = [a.landName, a.ticket !== "—" ? `${a.ticket}-Ticket` : null, reps ? `Done ${reps}×` : null]
    .filter(Boolean).join(" · ");

  return (
    <div style={{ background: C.white, padding: "16px 16px 18px", marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{a.name}</div>
          <div style={{ fontSize: 14.5, color: C.grey, marginTop: 3 }}>{sub}</div>
        </div>
        <div style={{
          width: 54, height: 54, borderRadius: 10, flexShrink: 0, background: C.blueTint,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon d={a.kind === "train" ? "train" : a.kind === "dine" ? "fork" : isRide ? "star" : "hat"} c={C.blue} f={isRide} s={26} />
        </div>
      </div>

      <InfoBox>
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>
            {a.kind === "train" ? "Next Train" : a.kind === "dine" ? "Seated" : isRide ? "Standby Line" : "Next Show"}
          </div>
          <div style={{ marginTop: 3 }}>
            {wait < 0 ? (
              <span style={{ fontSize: 17, fontWeight: 800, color: C.red }}>Temporarily Closed</span>
            ) : (
              <>
                <span style={{ fontSize: 23, fontWeight: 800, color: wait > 45 ? C.red : C.navy }}>
                  {a.kind === "dine" ? seatedMinutes(a) : wait || "—"}
                </span>
                <span style={{ fontSize: 15.5, color: C.text, marginLeft: 5 }}>Minutes</span>
              </>
            )}
            <span style={{ fontSize: 15, color: C.grey, marginLeft: 10 }}>· {walk} min walk</span>
          </div>
        </div>
        <TextLink onClick={onOpen}>View Details</TextLink>
      </InfoBox>

      {isQuickService(a) && walk >= MOBILE_MIN_WALK && (
        <InfoBox>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>Mobile Order</div>
            <div style={{ marginTop: 3 }}>
              <span style={{ fontSize: 21, fontWeight: 800, color: C.navy }}>
                {Math.max(1, Math.round(seatedMinutes(a) * MOBILE_TIME))}
              </span>
              <span style={{ fontSize: 15, color: C.text, marginLeft: 5 }}>Minutes</span>
              <span style={{ fontSize: 14.5, color: C.grey, marginLeft: 10 }}>· order on the way</span>
            </div>
          </div>
          <TextLink onClick={() => onGo(a, "mobile")}>Select</TextLink>
        </InfoBox>
      )}

      {isQuickService(a) && (
        <InfoBox>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>Eat on the Go</div>
            <div style={{ marginTop: 3 }}>
              <span style={{ fontSize: 21, fontWeight: 800, color: C.navy }}>
                {Math.max(1, Math.round(seatedMinutes(a) * TOGO_TIME))}
              </span>
              <span style={{ fontSize: 15, color: C.text, marginLeft: 5 }}>Minutes</span>
              <span style={{ fontSize: 14.5, color: C.grey, marginLeft: 10 }}>· no sit-down</span>
            </div>
          </div>
          <TextLink onClick={() => onGo(a, "togo")}>Select</TextLink>
        </InfoBox>
      )}

      {singleOk && (
        <InfoBox>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Icon d="star" c={C.navy} s={16} />
              <span style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>Single Rider</span>
            </div>
            <div style={{ marginTop: 3 }}>
              <span style={{ fontSize: 21, fontWeight: 800, color: C.navy }}>{singleWait}</span>
              <span style={{ fontSize: 15, color: C.text, marginLeft: 5 }}>Minutes</span>
              <span style={{ fontSize: 14.5, color: C.grey, marginLeft: 10 }}>· counts for less</span>
            </div>
          </div>
          <TextLink onClick={() => onGo(a, "single")}>Select</TextLink>
        </InfoBox>
      )}

      {canLL && (
        <InfoBox>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <svg width="17" height="17" viewBox="0 0 24 24">{I.ll(C.navy)}</svg>
              <span style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>
                {llFree ? "Free Lightning Lane" : "Multi Pass Experience"}
              </span>
            </div>
            <div style={{ fontSize: 15, color: C.text, marginTop: 3 }}>
              Earliest Time Available <b style={{ color: C.navy }}>{clock(t + walk + 5)}</b>
            </div>
            {llFree && (
              <div style={{ fontSize: 14, color: C.grey, marginTop: 2 }}>
                {freeLeft === 1 ? "Your one free skip" : `${freeLeft} free skips`} — spending it here
                uses it up.
              </div>
            )}
          </div>
          <TextLink onClick={() => onGo(a, true)}>Select</TextLink>
        </InfoBox>
      )}

      <div style={{ marginTop: 12 }}>
        {/* trains need a destination first; everything else starts straight away */}
        <BigButton disabled={broke || wait < 0 || !!hopBlocked}
          onClick={() => (a.kind === "train" ? onOpen() : onGo(a, mustSwitch ? "switch" : false))}>
          {hopBlocked === "hopper" ? "Needs a Park Hopper"
            : parkShut ? `${PARKS[a.park].short} has closed`
            : wait < 0 ? "Temporarily Closed" : mustSwitch ? `Rider Switch · ${HEIGHT[a.id]}" minimum`
            : a.kind === "train" ? "Choose a Destination"
            : broke ? "Not enough money" : a.kind === "dine" ? `Eat Here${a.cost ? ` · $${a.cost}` : ""}`
            : isRide ? "Join Standby Line" : "Go Watch"}
        </BigButton>
      </div>
    </div>
  );
}

const InfoBox = ({ children }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "12px 14px", marginTop: 13,
  }}>{children}</div>
);

/* ---------------- detail sheet ---------------- */
function Sheet({ a, wait, walk, hop, reps, wallet, llOk, llFree, freeLeft, spPrice, mustSwitch, hopBlocked, onBuyHopper, t, onClose, onGo, onTrain, onBuySingle }) {
  const canLL = llOk;
  const singleOk = singleRiderOpen(a.id, t) && wait >= 10;
  const singleWait = Math.max(5, Math.round((wait * SINGLE_WAIT) / 5) * 5);
  const broke = a.cost > wallet;
  const total = walk + wait + a.dur;
  const isRide = a.kind === "ride" || a.kind === "night";
  return (
    <>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(18,40,63,.42)", zIndex: 20 }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 21, background: C.white,
        borderRadius: "18px 18px 0 0", padding: "10px 16px 20px", animation: "up .2s ease-out",
        maxHeight: "86%", overflowY: "auto",
      }}>
        <style>{`@keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}
          @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`}</style>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: "#D5DFE7", margin: "0 auto 14px" }} />
        <div style={{ fontSize: 21, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{a.name}</div>
        <div style={{ fontSize: 14.5, color: C.grey, marginTop: 3 }}>
          {a.landName} · {PARKS[a.park].short}{a.ticket !== "—" ? ` · ${a.ticket}-Ticket` : ""}
        </div>

        {hopBlocked === "hopper" && (
          <div style={{
            marginTop: 12, background: "#FFF4E5", border: "1px solid #F3D5A6", borderRadius: 10,
            padding: "10px 12px", fontSize: 14.5, color: "#8A5B12", fontWeight: 600,
          }}>
            This is in the other park. Your ticket covers one park — you'd need to upgrade to a
            Park Hopper to cross over.
          </div>
        )}
        {mustSwitch && (
          <div style={{
            marginTop: 12, background: "#FFF4E5", border: "1px solid #F3D5A6", borderRadius: 10,
            padding: "10px 12px", fontSize: 14.5, color: "#8A5B12", fontWeight: 600,
          }}>
            {HEIGHT[a.id]}" minimum — too tall for your party. With Rider Switch one adult waits
            with the child and swaps in, so you still ride, but you get less out of it.
          </div>
        )}
        {hop && (
          <div style={{
            marginTop: 12, background: "#FFF4E5", border: `1px solid #F3D5A6`, borderRadius: 10,
            padding: "10px 12px", fontSize: 14.5, color: "#8A5B12", fontWeight: 600,
          }}>
            Park hop — includes {HOP_MINUTES} extra minutes for bag check and turnstiles at the other gate.
          </div>
        )}

        <div style={{ display: "flex", marginTop: 14, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {(a.kind === "dine"
            ? [["Walk", walk], ["Seated", seatedMinutes(a)], ["Total", walk + seatedMinutes(a)]]
            : [["Walk", walk], ["Line", wait], ["On It", a.dur], ["Total", total]]
          ).map(([k, val], i, arr) => (
            <div key={k} style={{
              flex: 1, padding: "10px 4px", textAlign: "center",
              borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              background: i === arr.length - 1 ? C.blueTint : C.white,
            }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: i === arr.length - 1 ? C.blue : C.navy }}>{val}</div>
              <div style={{ fontSize: 12, color: C.grey, fontWeight: 600 }}>{k} min</div>
            </div>
          ))}
        </div>

        {isRide && a.wait > 0 && (
          <div style={{
            marginTop: 12, background: C.blueTint, borderRadius: 10, padding: "10px 12px",
            fontSize: 14.5, color: C.blueDeep, fontWeight: 600, lineHeight: 1.4,
          }}>
            Typically shortest around <b>{bestHour(a.id, a.ticket)}</b> · peaks near <b>{a.wait} min</b> mid-afternoon
            {SINGLE_RIDER.has(a.id) ? (singleOk ? " · single rider open now" : " · has a single rider line, closed right now") : ""}
            {" · posted times run long, you'll usually wait less"}
            {a.last !== undefined ? ` · last call ${clock(a.last)}` : ""}
          </div>
        )}
        <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.5, marginTop: 12 }}>
          {a.cost ? `$${a.cost} per person. ` : "No extra cost. "}
          {reps > 0 && `You've done this ${reps}×, so it won't hit the same. `}
          {a.en <= -7 && "This one will beat you up a little."}
          {a.en >= 8 && "A good chance to get off your feet."}
        </div>

        {a.kind === "train" ? (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
              Ride to
            </div>
            {[...RAIL_LOOP.filter((id) => id !== a.id), a.id].map((id) => {
              const circle = id === a.id;
              const dest = byId[id];
              const mins = railMinutes(a.id, id);
              return (
                <button key={id} onClick={() => onTrain(a, id)} style={{
                  display: "flex", alignItems: "center", width: "100%", gap: 12, cursor: "pointer",
                  border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px",
                  marginBottom: 8, background: C.white, fontFamily: F, textAlign: "left",
                }}>
                  <Icon d="train" c={C.blue} s={20} />
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: C.navy }}>
                      {circle ? "Grand Circle Tour" : dest.name.replace(" Station", "").replace(" Depot", "")}
                    </span>
                    <span style={{ display: "block", fontSize: 14, color: C.grey }}>
                      {circle ? "All the way round, back to here" : dest.landName}
                    </span>
                  </span>
                  <span style={{ textAlign: "right" }}>
                    <span style={{ display: "block", fontSize: 19, fontWeight: 800, color: C.navy }}>{mins}</span>
                    <span style={{ display: "block", fontSize: 11, color: C.grey, fontWeight: 700 }}>MIN</span>
                  </span>
                </button>
              );
            })}
            <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45 }}>
              The train runs one way round the park. It is slower than walking, but you get your
              energy back instead of spending it.
            </div>
          </div>
        ) : (
        <div style={{ marginTop: 16 }}>
          <BigButton disabled={broke || !!hopBlocked} onClick={() => onGo(a, mustSwitch ? "switch" : false)}>
            {hopBlocked === "hopper" ? "Needs a Park Hopper"
              : broke ? "Not enough money"
              : mustSwitch ? `Rider Switch · ${HEIGHT[a.id]}" minimum`
              : a.kind === "dine" ? "Eat Here" : isRide ? "Join Standby Line" : "Go Watch"}
          </BigButton>
        </div>
        )}
        {hopBlocked === "hopper" && (
          <button onClick={onBuyHopper} disabled={wallet < HOPPER_PRICE} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26,
            cursor: wallet < HOPPER_PRICE ? "default" : "pointer",
            background: C.white, border: `1.5px solid ${wallet < HOPPER_PRICE ? C.border : C.blue}`,
            color: wallet < HOPPER_PRICE ? C.greyLt : C.blue,
            fontFamily: F, fontSize: 16.5, fontWeight: 800,
          }}>
            Upgrade to Park Hopper · ${HOPPER_PRICE}
          </button>
        )}
        {isQuickService(a) && walk >= MOBILE_MIN_WALK && (
          <button onClick={() => onGo(a, "mobile")} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26, cursor: "pointer",
            background: C.white, border: `1.5px solid ${C.blue}`, color: C.blue,
            fontFamily: F, fontSize: 16.5, fontWeight: 800,
          }}>
            Mobile Order · {Math.max(1, Math.round(seatedMinutes(a) * MOBILE_TIME))} min
          </button>
        )}
        {isQuickService(a) && (
          <button onClick={() => onGo(a, "togo")} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26, cursor: "pointer",
            background: C.white, border: `1.5px solid ${C.blue}`, color: C.blue,
            fontFamily: F, fontSize: 16.5, fontWeight: 800,
          }}>
            Eat on the Go · {Math.max(1, Math.round(seatedMinutes(a) * TOGO_TIME))} min
          </button>
        )}
        {spPrice > 0 && !canLL && (
          <button onClick={() => onBuySingle(a)} disabled={wallet < spPrice} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26,
            cursor: wallet < spPrice ? "default" : "pointer",
            background: C.white, border: `1.5px solid ${wallet < spPrice ? C.border : C.blue}`,
            color: wallet < spPrice ? C.greyLt : C.blue, fontFamily: F, fontSize: 16.5, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24">{I.ll(wallet < spPrice ? C.greyLt : C.blue)}</svg>
            Buy Single Pass · ${spPrice}
          </button>
        )}
        {singleOk && (
          <button onClick={() => onGo(a, "single")} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26, cursor: "pointer",
            background: C.white, border: `1.5px solid ${C.blue}`, color: C.blue,
            fontFamily: F, fontSize: 16.5, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon d="star" c={C.blue} s={17} />
            Single Rider · {singleWait} min
          </button>
        )}
        {canLL && a.kind !== "train" && (
          <button onClick={() => onGo(a, true)} style={{
            width: "100%", marginTop: 10, padding: "14px 18px", borderRadius: 26, cursor: "pointer",
            background: C.white, border: `1.5px solid ${C.blue}`, color: C.blue,
            fontFamily: F, fontSize: 16.5, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24">{I.ll(C.blue)}</svg>
            Use Lightning Lane
          </button>
        )}
      </div>
    </>
  );
}



function EventCard({ ev, onClose, onChoose }) {
  const good = ev.choice ? true : ev.kind === "good";
  const chips = (o) => {
    const b = [];
    if (o.minutesLost) b.push(`${o.minutesLost >= 60 ? o.minutesLost / 60 + " hr" : o.minutesLost + " min"}`);
    if (o.money) b.push(`${o.money > 0 ? "+" : "-"}$${Math.abs(o.money)}`);
    if (o.ll) b.push(`+${o.ll} Lightning Lane`);
    if (o.waitMult) b.push(`waits ${o.waitMult < 1 ? "down" : "up"} ${Math.round(Math.abs(1 - o.waitMult) * 100)}%`);
    return b;
  };
  /* Meter changes are deliberately hidden — same as the break cards. What you
     see is what it costs you in time, money and logistics; what it does to you
     is something you notice in the bars. */
  const bits = [];
  if (ev.money) bits.push(`${ev.money > 0 ? "+" : "-"}$${Math.abs(ev.money)}`);
  if (ev.ll) bits.push(`+${ev.ll} Lightning Lane`);
  if (ev.timeShift) bits.push(`${ev.timeShift > 0 ? "lost" : "gained"} ${Math.abs(ev.timeShift)} min`);
  if (ev.minutesLost) bits.push(`lost ${ev.minutesLost} min`);
  if (ev.waitMult) bits.push(`waits ${ev.waitMult < 1 ? "down" : "up"} ${Math.round(Math.abs(1 - ev.waitMult) * 100)}% for ${ev.minutes} min`);
  if (ev.closeRide) bits.push(`closed for about ${ev.minutes} min`);
  return (
    <>
      <div onClick={ev.choice ? undefined : onClose} style={{ position: "absolute", inset: 0, background: "rgba(18,40,63,.42)", zIndex: 28 }} />
      <div style={{
        position: "absolute", left: 16, right: 16, top: "22%", zIndex: 29, background: C.white,
        borderRadius: 18, boxShadow: "0 8px 30px rgba(18,40,63,.3)", overflow: "hidden",
        animation: "pop .22s ease-out",
      }}>
        <style>{`@keyframes pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
          @media (prefers-reduced-motion:reduce){*{animation:none!important}}`}</style>
        <div style={{ height: 6, background: ev.choice ? C.blue : good ? C.green : C.red }} />
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
            <span style={{
              width: 30, height: 30, borderRadius: 15, flexShrink: 0,
              background: ev.choice ? C.blueTint : good ? "#E6F5EA" : "#FCEAEA",
              color: ev.choice ? C.blue : good ? C.green : C.red,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800,
            }}>{ev.choice ? "?" : good ? "✦" : "!"}</span>
            <span style={{ fontSize: 11.5, letterSpacing: ".1em", fontWeight: 800, textTransform: "uppercase", color: C.greyLt }}>
              {ev.choice ? "Your call" : good ? "That's the magic" : "Well, that happened"}
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{ev.title}</div>
          <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.5, marginTop: 6 }}>{ev.text}</div>
          {!ev.choice && bits.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {bits.map((b) => (
                <span key={b} style={{
                  padding: "5px 11px", borderRadius: 14, fontSize: 13.5, fontWeight: 700,
                  background: good ? "#E6F5EA" : "#FCEAEA", color: good ? "#1E7038" : "#9E2A26",
                }}>{b}</span>
              ))}
            </div>
          )}

          {ev.choice ? (
            <div style={{ marginTop: 14 }}>
              {ev.options.map((o) => (
                <button key={o.label} onClick={() => onChoose(ev, o)} style={{
                  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                  border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px",
                  marginBottom: 8, background: C.white, fontFamily: F,
                }}>
                  <span style={{ display: "block", fontSize: 16.5, fontWeight: 800, color: C.navy }}>{o.label}</span>
                  {o.sub && <span style={{ display: "block", fontSize: 14, color: C.grey, marginTop: 1 }}>{o.sub}</span>}
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {chips(o).map((b, i) => (
                      <span key={b + i} style={{
                        padding: "3px 9px", borderRadius: 11, fontSize: 12.5, fontWeight: 700,
                        background: b.startsWith("-") || b.includes("-") && b.includes("happiness") ? "#FCEAEA" : C.gap,
                        color: C.text,
                      }}>{b}</span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 16 }}><BigButton onClick={onClose}>Carry on</BigButton></div>
          )}
        </div>
      </div>
    </>
  );
}

function ActivityRunner({ run, speed, setSpeed, onSkip }) {
  const { a, walk, wait, dur, i, net } = run;
  const total = walk + wait + dur;
  const phase = i < walk ? "walk" : i < walk + wait ? "wait" : "do";
  const isRide = a.kind === "ride" || a.kind === "night";
  const label = phase === "walk" ? "Walking there"
    : phase === "wait" ? (a.kind === "dine" ? "Waiting for a table" : "In line")
    : a.kind === "break" ? "Taking a break"
    : a.kind === "train" ? "On the train"
    : a.kind === "dine" ? (run.togo ? "Eating on the move" : "Seated") : isRide ? "On the ride" : "Watching";
  const left = phase === "walk" ? walk - i : phase === "wait" ? walk + wait - i : total - i;
  const seg = a.kind === "dine"
    ? [["Walk", walk], [run.togo ? "Eating" : "Seated", dur]]
    : (walk || wait)
    ? [["Walk", walk], ["Line", wait], [a.kind === "train" ? "Ride" : "Time", dur]]
    : [[a.kind === "break" ? "Break" : "Time", dur]];

  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 24, background: C.white,
      borderRadius: "18px 18px 0 0", boxShadow: "0 -4px 20px rgba(18,40,63,.18)", padding: "14px 16px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 23, flexShrink: 0,
          background: phase === "do" ? C.blue : C.blueTint,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon d={phase === "walk" ? "locate" : phase === "wait" ? "clock"
            : a.kind === "break" ? "clock" : a.kind === "train" ? "train"
            : a.kind === "dine" ? "fork" : isRide ? "star" : "hat"}
            c={phase === "do" ? C.white : C.blue} f={phase === "do" && isRide} s={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1.2, marginTop: 1 }}>{a.name}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{left}</div>
          <div style={{ fontSize: 11.5, color: C.grey, fontWeight: 700 }}>MIN LEFT</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, marginTop: 13 }}>
        {seg.map(([nm, len], si) => {
          const before = seg.slice(0, si).reduce((x, y) => x + y[1], 0);
          const fill = clamp(((i - before) / Math.max(1, len)) * 100);
          const active = i >= before && i < before + len;
          return (
            <div key={nm} style={{ flex: Math.max(1, len) }}>
              <div style={{ height: 7, borderRadius: 4, background: C.rule, overflow: "hidden" }}>
                <div style={{ width: `${fill}%`, height: "100%", background: active ? C.blue : C.green, transition: "width .3s linear" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: active ? C.blue : C.greyLt, marginTop: 3, textAlign: "center" }}>
                {nm} {len}m
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 13 }}>
        <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: net >= 0 ? C.green : C.red }}>
          {net >= 0 ? "+" : ""}{net.toFixed(1)} happiness so far
        </div>
        <button onClick={() => setSpeed(speed === 8 ? 2 : 8)}
          aria-label={speed === 8 ? "Normal speed" : "Fast forward"} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 16,
            cursor: "pointer", border: `1.5px solid ${speed === 8 ? C.blue : C.border}`,
            background: speed === 8 ? C.blue : C.white, fontFamily: F, fontSize: 13.5, fontWeight: 800,
            color: speed === 8 ? C.white : C.navy,
          }}>
          <Icon d="ff" c={speed === 8 ? C.white : C.navy} s={17} />
          {speed === 8 ? "8×" : ""}
        </button>
        <Pill onClick={onSkip}>Skip</Pill>
      </div>
    </div>
  );
}

function Flash({ name, net }) {
  const bad = net < 0, good = net >= 4;
  return (
    <div style={{
      position: "absolute", left: 12, right: 12, top: 12, zIndex: 15, background: C.white,
      borderRadius: 14, boxShadow: C.shadow, padding: "11px 14px",
      borderLeft: `5px solid ${bad ? C.red : good ? C.green : C.blue}`,
    }}>
      <div style={{ fontSize: 11.5, letterSpacing: ".09em", fontWeight: 800, textTransform: "uppercase", color: C.greyLt }}>
        {bad ? "That cost you" : good ? "Worth it" : "Done"}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginTop: 1 }}>
        {name} <span style={{ color: bad ? C.red : C.green }}>{net >= 0 ? "+" : ""}{net.toFixed(1)} happiness</span>
      </div>
    </div>
  );
}

function DayLog({ log }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.gap }}>
      {log.length === 0 && <Empty>Nothing yet. Tap a pin on the map to get going.</Empty>}
      {log.length > 0 && (
        <div style={{ background: C.white, padding: "4px 16px" }}>
          {log.map((e) => (
            <div key={e.key} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.rule}` }}>
              <div style={{ width: 64, flexShrink: 0, fontSize: 13.5, fontWeight: 800, color: C.blue }}>{e.at}</div>
              <div style={{ fontSize: 15, lineHeight: 1.4, color: e.tone === "bad" ? C.red : C.text }}>{e.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouTab({ onBreak, onBuyLL, onBuyHopper, hopper, wallet, ll, boughtLl, freeLeft, freeLL, energy, fuel, comfort, joy, visited, t, closeAt, seedWeather }) {
  const [openSnack, setOpenSnack] = useState(null);
  const pace = 50 + (t / closeAt) * 130;   // roughly where an average day sits
  const advice =
    energy < 25 ? "You're running on fumes. Sit down before you ride anything else — tired guests get almost nothing out of an E-Ticket."
    : fuel < 25 ? "You're hungry, and it's dulling everything. Eat something."
    : comfort < 25 ? (seedWeather === "hot"
        ? "The heat has got to you. Find air conditioning — an indoor ride or a long sit-down."
        : "You're damp and miserable. Get indoors for a bit.")
    : joy < pace * 0.65 ? "You're behind where a good day should be by now. Go do something big."
    : "You're in good shape. Keep moving.";
  const done = Object.values(visited).reduce((s, n) => s + n, 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.gap }}>
      <Card>
        <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>How you're doing</div>
        <div style={{ fontSize: 16.5, lineHeight: 1.45, color: C.text, marginTop: 5 }}>{advice}</div>
        <div style={{ fontSize: 14.5, color: C.grey, marginTop: 9 }}>{done} experiences so far today.</div>
      </Card>
      <Card>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Take a break</div>
        <div style={{ fontSize: 14.5, color: C.grey, marginBottom: 12, lineHeight: 1.45 }}>
          None of this rides anything. It buys back energy, or a little happiness, at the cost of time.
        </div>
        {BREAKS.map((b) => {
          const shut = b.window && (M(t) < b.window[0] || M(t) > b.window[1]);
          const broke = !b.options && b.cost > wallet;
          const off = shut || broke;
          const bits = [b.mins >= 60 ? `${b.mins / 60} hr` : `${b.mins} min`];
          if (b.cost) bits.push(`$${b.cost}`);
          return (
            <div key={b.id}>
            <button disabled={off} onClick={() => (b.options ? setOpenSnack(openSnack === b.id ? null : b.id) : onBreak(b))} style={{
              display: "block", width: "100%", textAlign: "left", cursor: off ? "default" : "pointer",
              border: `1.5px solid ${off ? C.rule : C.border}`, borderRadius: 12,
              padding: "12px 14px", marginBottom: 8, background: off ? C.gap : C.white,
              fontFamily: F, opacity: off ? 0.6 : 1,
            }}>
              <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: C.navy }}>{b.name}</span>
              <span style={{ display: "block", fontSize: 14.5, color: C.grey, lineHeight: 1.4, margin: "2px 0 7px" }}>{b.desc}</span>
              <span style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {bits.map((x, i) => (
                  <span key={x + i} style={{
                    padding: "3px 9px", borderRadius: 11, fontSize: 12.5, fontWeight: 700,
                    background: i === 0 ? C.blueTint : C.gap, color: i === 0 ? C.blueDeep : C.text,
                  }}>{x}</span>
                ))}
              </span>
              {shut && <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: C.red, marginTop: 6 }}>
                Only between 10 AM and 6 PM
              </span>}
              {!shut && broke && <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: C.red, marginTop: 6 }}>
                Not enough money
              </span>}
            </button>
            {b.options && openSnack === b.id && (
              <div style={{ margin: "-2px 0 8px 14px", paddingLeft: 12, borderLeft: `2px solid ${C.border}` }}>
                {b.options.map((o) => (
                  <button key={o.id} disabled={o.cost > wallet}
                    onClick={() => { setOpenSnack(null); onBreak(o); }} style={{
                      display: "block", width: "100%", textAlign: "left",
                      cursor: o.cost > wallet ? "default" : "pointer", opacity: o.cost > wallet ? 0.55 : 1,
                      border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 13px",
                      marginBottom: 7, background: C.white, fontFamily: F,
                    }}>
                    <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ flex: 1, fontSize: 15.5, fontWeight: 800, color: C.navy }}>{o.name}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.blueDeep }}>{o.mins} min</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.green }}>${o.cost}</span>
                    </span>
                    <span style={{ display: "block", fontSize: 14, color: C.grey, lineHeight: 1.4, marginTop: 2 }}>{o.desc}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
          );
        })}
      </Card>

      <Card>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Park Hopper</div>
        {hopper ? (
          <div style={{ fontSize: 15.5, color: C.text }}>
            You can cross between the parks whenever you like.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.5, marginBottom: 12 }}>
              Your ticket covers one park. Upgrading lets you cross to the other any time — a big
              slice of the budget, so it only pays off if you actually use both.
            </div>
            <BigButton disabled={wallet < HOPPER_PRICE} onClick={onBuyHopper}>
              Upgrade for ${HOPPER_PRICE}
            </BigButton>
          </>
        )}
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24">{I.ll(C.navy)}</svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: C.navy }}>Lightning Lane Multi Pass</span>
        </div>
        {/* a comped skip is separate from the pass, and holding one must not
            stop you buying the pass as well */}
        {freeLL > 0 && (
          <div style={{
            fontSize: 15, color: C.blueDeep, fontWeight: 700, background: C.blueTint,
            borderRadius: 10, padding: "9px 12px", marginBottom: boughtLl ? 0 : 12,
          }}>
            {freeLL} free Lightning Lane{freeLL === 1 ? "" : "s"} in hand — each good for any one
            eligible attraction.
          </div>
        )}
        {boughtLl ? (
          <div style={{ fontSize: 15.5, color: C.text, marginTop: freeLL > 0 ? 10 : 0 }}>
            {ll > 0
              ? `${ll} eligible attractions still unused. One skip each — they appear on rides with a real line.`
              : "You've used your skip on every eligible attraction."}
          </div>
        ) : (
          <>
            {freeLeft > 0 && (
              <Note tone="good">
                You have {freeLeft} free Lightning Lane{freeLeft === 1 ? "" : "s"} — good for any
                one eligible ride each, and separate from the pass below.
              </Note>
            )}
            <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.5, marginBottom: 12 }}>
              $32 for the day. One line skip on each of the {LL_OK.size} eligible attractions — not a pool of skips,
              so it rewards spreading them across the headliners rather than repeating one ride.
              Rise of the Resistance and Radiator Springs Racers aren't included — those sell a
              Single Pass separately, from their own detail page.
            </div>
            <BigButton disabled={wallet < 32} onClick={onBuyLL}>Buy for $32</BigButton>
          </>
        )}
      </Card>
    </div>
  );
}

function TabBar({ tab, setTab, disabled }) {
  const items = [["map", "pin", "Map"], ["list", "list", "List"], ["day", "clock", "Day"], ["you", "person", "You"], ["home", "home", "Home"]];
  return (
    <div style={{
      display: "flex", borderTop: `1px solid ${C.rule}`, background: C.white, flexShrink: 0,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {items.map(([id, ic, label]) => {
        const on = tab === id;
        return (
          <button key={id} onClick={() => !disabled && setTab(id)} style={{
            flex: 1, background: "none", border: "none", cursor: disabled ? "default" : "pointer",
            opacity: disabled && !on ? .4 : 1, padding: "6px 0 5px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <Icon d={ic} c={on ? C.blue : C.greyLt} f={on && (ic === "pin" || ic === "home")} s={20} />
            <span style={{ fontSize: 10, fontWeight: on ? 800 : 600, color: on ? C.blue : C.greyLt }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- built-in map ---------------- */
function ResortArt() {
  const LANDS = [
    ["Mickey's Toontown", 624, 138], ["Galaxy's Edge", 339, 223], ["Fantasyland", 591, 347],
    ["Bayou Country", 268, 471], ["Frontierland", 471, 482], ["Tomorrowland", 760, 522],
    ["New Orleans Sq.", 353, 583], ["Adventureland", 494, 609], ["Main Street, U.S.A.", 584, 642],
    ["Buena Vista St.", 586, 1005], ["Grizzly Peak", 440, 1026], ["Hollywood Land", 738, 1022],
    ["Avengers Campus", 676, 1101], ["Paradise Gardens", 316, 1201], ["San Fransokyo", 481, 1244],
    ["Pixar Pier", 300, 1380], ["Cars Land", 615, 1322],
  ];
  const G = "#B9D3A8", G2 = "#9BC088", W = "#9CC6D8", P = "#EFE7D8";
  return (
    <g>
      <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} fill={G} />
      {/* the schematic was drawn against the previous map's framing; this puts
          it in the current coordinate space with the same fit used for the pins */}
      <g transform="translate(35.15 -36.84) scale(0.95633)">
      <ellipse cx="530" cy="430" rx="352" ry="338" fill={G2} />
      <ellipse cx="530" cy="430" rx="332" ry="318" fill={P} />
      <rect x="200" y="958" width="600" height="448" rx="48" fill={P} />
      <rect x="545" y="770" width="85" height="196" fill={P} />
      <path d="M300 400c-20-70 30-110 90-85 50 21 40 85 10 125-32 42-84 22-100-40z" fill={W} />
      <ellipse cx="762" cy="466" rx="46" ry="28" fill={W} />
      <ellipse cx="380" cy="1258" rx="88" ry="60" fill={W} />
      <circle cx="584" cy="508" r="36" fill="#F7F2E7" />
      <rect x="572" y="500" width="24" height="258" fill="#F7F2E7" />
      <g transform="translate(585 411)">
        <rect x="-26" y="-4" width="52" height="24" fill="#DCC9A8" />
        <rect x="-9" y="-26" width="18" height="26" fill="#F7F2E7" />
        <path d="M-12 -26L0 -46 12 -26z" fill="#5B8FC9" />
      </g>
      <path d="M668 396l22-46 22 46z" fill="#F2F4F6" />
      <path d="M438 384l23-46 23 46z" fill="#C98A63" />
      <path d="M428 1078l29-54 29 54z" fill="#A9A19A" />
      <path d="M608 1332l32-58 32 58z" fill="#C97A4B" />
      <path d="M710 660q23-58 46 0z" fill="#EDEFF1" />
      <circle cx="229" cy="1296" r="22" fill="#F7F2E7" stroke="#C9B99B" strokeWidth="2" />
      {LANDS.map(([txt, x, y]) => (
        <g key={txt}>
          <text x={x} y={y} textAnchor="middle" stroke="#FFFFFF" strokeWidth="3.5" strokeLinejoin="round"
            style={{ fontFamily: F, fontSize: 15, fontWeight: 700 }}>{txt}</text>
          <text x={x} y={y} textAnchor="middle" style={{ fontFamily: F, fontSize: 15, fontWeight: 700, fill: "#4A5F72" }}>{txt}</text>
        </g>
      ))}
      </g>
    </g>
  );
}

/* ---------------- title & end ---------------- */
function Knob({ label, choices, value, onPick, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 11 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 5 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {choices.map(([lbl, v]) => (
          <button key={String(v)} onClick={() => onPick(v)} style={{
            padding: "5px 10px", borderRadius: 10, cursor: "pointer", fontFamily: F,
            fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
            border: `1.5px solid ${value === v ? C.blue : C.border}`,
            background: value === v ? C.blue : C.white, color: value === v ? C.white : C.navy,
          }}>{lbl}</button>
        ))}
      </div>
    </div>
  );
}

function Title({ onStart, onSetup, ready, mode, setMode, runMode, setRunMode, party, setParty, season, setSeason, startPark, setStartPark, custom, setCustom }) {
  const isCustom = mode === "custom";
  const budgetVal = isCustom ? custom.budget : DIFFICULTY[mode].budget;
  const budgetLabel = (isCustom ? custom.unlimited : DIFFICULTY[mode].unlimited)
    ? "as much money as you like" : `$${budgetVal}`;
  const openAt = isCustom ? custom.startMin : 480;
  const h = Math.floor(openAt / 60), mm = String(openAt % 60).padStart(2, "0");
  const openLabel = `Rope drop is at ${h % 12 === 0 ? 12 : h % 12}:${mm} ${h >= 12 ? "PM" : "AM"}`;
  return (
    <Shell>
      <div style={{ flex: 1, overflowY: "auto", padding: "52px 24px 30px", textAlign: "center" }}>
        <div style={{
          width: 74, height: 74, borderRadius: 37, background: C.blueTint, margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon d="mickey" c={C.blue} f s={40} /></div>
        <div style={{ fontSize: 12.5, letterSpacing: ".2em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>
          One day · Two parks
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: C.navy, margin: "8px 0 14px", lineHeight: 1.1 }}>
          Ropedrop<br />Run
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.55, color: C.text, maxWidth: 330, margin: "0 auto 22px" }}>
          {openLabel} and you have {budgetLabel} in your pocket. Tap a pin to walk there and get in line.
          Rides, food and shows raise your happiness. Long lines, dead time, sore feet and sticker shock pull it back down. There is no cap — a great day just keeps climbing.
        </p>
        <div style={{ background: C.gap, borderRadius: 14, padding: 16, textAlign: "left", maxWidth: 340, margin: "0 auto 26px" }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 7 }}>
            Reading the map
          </div>
          <div style={{ fontSize: 15.5, lineHeight: 1.55, color: C.text }}>
            Each bubble shows the current standby wait. Every walk across the map costs minutes you
            don't get back, so the shortest line isn't always the best move. Repeat rides pay less
            each time, and a tired or hungry guest gets far less out of an E-Ticket.
          </div>
        </div>
        <div style={{ maxWidth: 340, margin: "0 auto 20px", textAlign: "left" }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
            How long
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
            {Object.entries(RUN_MODES).map(([k, r]) => (
              <button key={k} onClick={() => setRunMode(k)} style={{
                flex: 1, padding: "9px 4px", borderRadius: 12, cursor: "pointer", fontFamily: F,
                fontSize: 14, fontWeight: 800,
                border: `1.5px solid ${runMode === k ? C.pink : C.border}`,
                background: runMode === k ? C.pink : C.white, color: runMode === k ? C.white : C.navy,
              }}>{r.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45, marginBottom: 16 }}>
            {RUN_MODES[runMode].blurb}
            {runMode !== "single" && " You wake up in whatever state you went to bed in, unspent money rolls over, and each day is harder than the last."}
          </div>

          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
            Pick your day
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
            {Object.entries(DIFFICULTY).map(([k, d]) => (
              <button key={k} onClick={() => setMode(k)} style={{
                flex: 1, padding: "9px 2px", borderRadius: 12, cursor: "pointer", fontFamily: F,
                fontSize: 14, fontWeight: 800,
                border: `1.5px solid ${mode === k ? C.blue : C.border}`,
                background: mode === k ? C.blue : C.white, color: mode === k ? C.white : C.navy,
              }}>{d.label}</button>
            ))}
          </div>
          {mode === "custom" && (
            <div style={{ background: C.gap, borderRadius: 14, padding: 13, marginBottom: 9 }}>
              <Knob label="Gates open" choices={TIME_CHOICES} value={custom.startMin}
                onPick={(v) => setCustom((c) => ({ ...c, startMin: Math.min(v, c.endMin - 240) }))} />
              <Knob label="Park closes" choices={END_CHOICES} value={custom.endMin}
                onPick={(v) => setCustom((c) => ({ ...c, endMin: Math.max(v, c.startMin + 240) }))} />
              <Knob label="Park capacity" choices={CROWD_CHOICES} value={custom.crowd}
                onPick={(v) => setCustom((c) => ({ ...c, crowd: v }))} />
              <Knob label="Weather" choices={[["Clear", "clear"], ["Hot", "hot"], ["Drizzle", "drizzle"], ["Cold", "cold"]]}
                value={custom.weather} onPick={(v) => setCustom((c) => ({ ...c, weather: v }))} />
              <Knob label="Budget" choices={BUDGET_CHOICES} value={custom.budget}
                onPick={(v) => setCustom((c) => ({ ...c, budget: v, unlimited: v >= 99999 }))} />
              <Knob label="Energy, hunger &amp; comfort drain" choices={DRAIN_CHOICES} value={custom.drain}
                onPick={(v) => setCustom((c) => ({ ...c, drain: v }))} />
              <Knob label="Random events" choices={[["On", true], ["Off", false]]} value={custom.events}
                onPick={(v) => setCustom((c) => ({ ...c, events: v }))} last />
            </div>
          )}
          <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45 }}>{DIFFICULTY[mode].blurb}</div>
        </div>
        <div style={{ maxWidth: 340, margin: "0 auto 18px", textAlign: "left" }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
            Who's with you
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {Object.entries(PARTY).map(([k, p]) => (
              <button key={k} onClick={() => setParty(k)} style={{
                flex: "1 1 46%", padding: "8px 6px", borderRadius: 12, cursor: "pointer", fontFamily: F,
                fontSize: 14, fontWeight: 800,
                border: `1.5px solid ${party === k ? C.blue : C.border}`,
                background: party === k ? C.blue : C.white, color: party === k ? C.white : C.navy,
              }}>{p.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45 }}>{PARTY[party].blurb}</div>
        </div>

        <div style={{ maxWidth: 340, margin: "0 auto 20px", textAlign: "left" }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
            Time of year
          </div>
          <button onClick={() => setSeason("regular")} style={{
            width: "100%", padding: "13px 12px", borderRadius: 14, cursor: "pointer", fontFamily: F,
            fontSize: 16.5, fontWeight: 800, marginBottom: 7,
            border: `1.5px solid ${season === "regular" ? C.blue : C.border}`,
            background: season === "regular" ? C.blue : C.white,
            color: season === "regular" ? C.white : C.navy,
          }}>A regular day</button>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {Object.entries(SEASONS).filter(([k]) => k !== "regular").map(([k, sv]) => (
              <button key={k} onClick={() => setSeason(k)} style={{
                flex: "1 1 46%", padding: "7px 5px", borderRadius: 11, cursor: "pointer", fontFamily: F,
                fontSize: 13, fontWeight: 700,
                border: `1.5px solid ${season === k ? C.blue : C.border}`,
                background: season === k ? C.blue : C.white, color: season === k ? C.white : C.navy,
              }}>{sv.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45 }}>{SEASONS[season].blurb}</div>
        </div>

        <div style={{ maxWidth: 340, margin: "0 auto 20px", textAlign: "left" }}>
          <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
            Start the day in
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.values(PARKS).map((p) => (
              <button key={p.id} onClick={() => setStartPark(p.id)} style={{
                flex: 1, padding: "9px 6px", borderRadius: 12, cursor: "pointer", fontFamily: F,
                fontSize: 14, fontWeight: 800,
                border: `1.5px solid ${startPark === p.id ? C.blue : C.border}`,
                background: startPark === p.id ? C.blue : C.white,
                color: startPark === p.id ? C.white : C.navy,
              }}>{p.short}</button>
            ))}
          </div>
          <div style={{ fontSize: 14.5, color: C.grey, lineHeight: 1.45, marginTop: 8 }}>
            Your ticket covers one park. A Park Hopper upgrade costs extra and lets you cross
            over at any time. California Adventure closes earlier than Disneyland — around 10 PM
            against midnight — so starting there without a Hopper is a shorter day, and it ends
            when that park shuts.
          </div>
        </div>

        <BigButton onClick={onStart}>{ready ? "Start the Day" : "Set Up & Play"}</BigButton>
        {ready && (
          <div style={{ fontSize: 14, color: C.greyLt, marginTop: 10 }}>
            Your map is loaded and calibrated.
          </div>
        )}
        <TextLink onClick={onSetup} style={{ display: "block", margin: "16px auto 0" }}>
          Map setup &amp; pin adjustment
        </TextLink>
      </div>
    </Shell>
  );
}

function End({ joy, t, wallet, energy, comfort, visited, track, log, seed, mode, unlimited, closeAt,
  isRun, runDay, runTotal, runLog, burnedOut, won, onAgain, onTitle }) {
  const [showLog, setShowLog] = useState(false);
  const rides = Object.entries(visited).reduce((s, [id, n]) => {
    const a = byId[id];
    return s + (a && (a.kind === "ride" || a.kind === "night") ? n : 0);
  }, 0);
  const unique = Object.keys(visited).filter((id) => byId[id]).length;
  /* visited also holds break ids like "break:churro", which are not attractions.
     This lookup was unguarded and threw, taking the whole results screen down
     for anyone who had taken a break during the day. */
  const both = new Set(Object.keys(visited)
    .map((id) => byId[id] && byId[id].park).filter(Boolean)).size === 2;
  const ctx = {
    did: (id) => !!visited[id],
    eTickets: (park) => ATTRACTIONS.filter((a) => a.park === park && a.ticket === "E" && a.kind === "ride"),
    spent: track.spent,
    lastAt: M(track.lastAt),
    before: () => track.before10,
    kinds: (k) => Object.keys(visited).filter((id) => byId[id] && byId[id].kind === k).length,
    lands: new Set(Object.keys(visited).map((id) => byId[id] && byId[id].landName).filter(Boolean)).size,
    nights: Object.keys(visited).filter((id) => byId[id] && byId[id].kind === "night").length,
    parks: new Set(Object.keys(visited).map((id) => byId[id] && byId[id].park).filter(Boolean)).size,
    minEnergy: track.minEnergy,
    minComfort: track.minComfort,
  };
  const earned = earnedMilestones(ctx);
  const bonus = earned.reduce((x, m) => x + m.bonus, 0);
  const dayScore = joy + Math.min(8, unique * 0.4) + (wallet > 0 ? 2 : 0) + (both ? 3 : 0) + bonus;
  // a run is scored on everything you banked, not just the last day
  const final = Math.round(isRun ? runTotal + dayScore - joy + joy : dayScore);
  const rank =
    final >= 420 ? ["The Happiest Place on Earth", C.pink] :
    final >= 330 ? ["A truly magical day", C.blue] :
    final >= 255 ? ["A great day", C.blue] :
    final >= 190 ? ["A good day", C.navy] :
    final >= 125 ? ["A perfectly fine day", C.navy] :
    ["You should've stayed at the hotel", C.grey];
  return (
    <Shell>
      <div style={{ flex: 1, overflowY: "auto", padding: "44px 24px 30px", textAlign: "center" }}>
        {isRun && (
          <div style={{
            background: burnedOut ? "#FCEAEA" : won ? "#E6F5EA" : C.gap,
            borderRadius: 14, padding: "14px 16px", maxWidth: 340, margin: "0 auto 20px", textAlign: "left",
          }}>
            <div style={{ fontSize: 18.5, fontWeight: 800, color: burnedOut ? C.red : won ? C.green : C.navy }}>
              {burnedOut ? `Burned out on day ${runDay}`
                : won ? "You made it all five days"
                : `Called it after ${runDay} ${runDay === 1 ? "day" : "days"}`}
            </div>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.45, marginTop: 4 }}>
              {burnedOut === "energy" ? "You ran yourself into the ground."
                : burnedOut === "hunger" ? "You never did stop to eat properly."
                : burnedOut === "comfort" ? "The weather won."
                : won ? "Five days, and still standing at the end of the last one."
                : "You stopped while you were ahead."}
            </div>
            <div style={{ marginTop: 11 }}>
              {runLog.map((d) => (
                <div key={d.day} style={{ display: "flex", gap: 8, fontSize: 14.5, padding: "3px 0" }}>
                  <span style={{ color: C.greyLt, minWidth: 46 }}>Day {d.day}</span>
                  <span style={{ flex: 1, color: C.text }}>{d.rides} attractions · ${d.spent} spent</span>
                  <span style={{ fontWeight: 800, color: C.pink }}>{d.joy}</span>
                </div>
              ))}
              <div style={{
                display: "flex", gap: 8, fontSize: 14.5, padding: "6px 0 0",
                borderTop: runLog.length ? `1px solid ${C.border}` : "none", marginTop: runLog.length ? 4 : 0,
              }}>
                <span style={{ color: C.greyLt, minWidth: 46 }}>Day {runDay}</span>
                <span style={{ flex: 1, color: C.text }}>today</span>
                <span style={{ fontWeight: 800, color: C.pink }}>{Math.round(joy)}</span>
              </div>
            </div>
          </div>
        )}
        <div style={{ fontSize: 12.5, letterSpacing: ".14em", fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>
          {burnedOut === "hunger" ? "You ran on empty"
            : burnedOut === "comfort" ? "You couldn't take any more"
            : energy <= 0 ? "You're wiped out"
            : t < closeAt ? "Headed home early" : "Park closed"} · {clock(Math.min(t, closeAt))}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: rank[1], lineHeight: 1.05, margin: "10px 0 0" }}>{final}</div>
        <div style={{ fontSize: 11.5, letterSpacing: ".14em", fontWeight: 800, color: C.greyLt, textTransform: "uppercase", marginBottom: 8 }}>Happiness</div>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.navy, marginBottom: 24 }}>{rank[0]}</div>
        <div style={{ background: C.gap, borderRadius: 14, padding: "6px 16px", textAlign: "left", maxWidth: 340, margin: "0 auto 26px" }}>
          {[["Difficulty", DIFFICULTY[mode].label], ["Attractions ridden", rides],
            ["Different things tried", unique], ["Both parks", both ? "Yes (+3)" : "No"],
            ["Money left", unlimited ? "Unlimited" : `$${Math.max(0, Math.round(wallet))}`], ["Energy remaining", `${Math.round(energy)}%`], ["Comfort at close", `${Math.round(comfort)}%`],
            ["Conditions", `${weatherLabel(seed.weather, Math.min(t, closeAt), seed.warm)}, ${seed.crowd > 1.25 ? "packed" : seed.crowd > 1.0 ? "busy" : seed.crowd > 0.78 ? "moderate" : "light"}`]]
            .map(([k, val]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.rule}`, fontSize: 15.5 }}>
                <span style={{ color: C.grey }}>{k}</span>
                <span style={{ fontWeight: 800, color: C.navy }}>{val}</span>
              </div>
            ))}
        </div>
        <div style={{ maxWidth: 340, margin: "0 auto 18px" }}>
          <TextLink onClick={() => setShowLog((v) => !v)}>
            {showLog ? "Hide the day" : `See the whole day · ${log.length} entries`}
          </TextLink>
          {showLog && (
            <div style={{
              marginTop: 10, textAlign: "left", maxHeight: 320, overflowY: "auto",
              background: C.gap, borderRadius: 12, padding: "6px 4px",
            }}>
              {log.length === 0
                ? <div style={{ padding: 12, fontSize: 14.5, color: C.grey }}>Nothing happened.</div>
                : [...log].reverse().map((e) => (
                  <div key={e.key} style={{
                    display: "flex", gap: 9, padding: "7px 10px", alignItems: "baseline",
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: C.greyLt, minWidth: 58, fontVariantNumeric: "tabular-nums",
                    }}>{e.at}</span>
                    <span style={{
                      flex: 1, fontSize: 14.5, lineHeight: 1.4,
                      color: e.tone === "bad" ? C.red : e.tone === "good" ? C.green : C.text,
                    }}>{e.text}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {earned.length > 0 && (
          <div style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 22px" }}>
            <div style={{ fontSize: 12, letterSpacing: ".08em", fontWeight: 800, color: C.blue, textTransform: "uppercase", marginBottom: 8 }}>
              Milestones · +{bonus}
            </div>
            {earned.map((m) => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 10, background: C.gap,
                borderRadius: 12, padding: "10px 13px", marginBottom: 7,
              }}>
                <span style={{ fontSize: 17 }}>★</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 15.5, fontWeight: 800, color: C.navy }}>{m.name}</span>
                  <span style={{ display: "block", fontSize: 14, color: C.grey }}>{m.blurb}</span>
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>+{m.bonus}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize: 14, color: C.greyLt, marginBottom: 14 }}>
          {earned.length} of {MILESTONES.length} milestones found
        </div>
        <BigButton onClick={onAgain}>Do It Again</BigButton>
        <TextLink onClick={onTitle} style={{ display: "block", margin: "16px auto 0" }}>
          Back to the start screen
        </TextLink>
        <div style={{ fontSize: 13.5, color: C.greyLt, marginTop: 6 }}>
          Change difficulty, or open Map Setup
        </div>
      </div>
    </Shell>
  );
}
