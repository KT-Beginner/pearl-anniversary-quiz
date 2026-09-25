/*
  Add Louise and Steve's memories here as they are decided.

  The game includes every round marked:

      playable: true
*/

window.GAME_ROUNDS = [
  {
    id: 1,
    playable: true,

    title: "The Wedding",
    subtitle: "",
    locationLabel: "ANTIGUA",

    duration: 90,

    /*
      The wedding arch is placed at this maze square.
    */

    goal: {
      x: 9,
      y: 9
    },

    /*
      Round 1 wedding items.

      Each object has:
      - a name used in messages
      - a symbol shown inside the maze
      - the number of points it is worth
    */

    collectibles: [
{
  name: "Louise's wedding dress",
  kind: "white-wedding-dress",
  points: 20
},
      {
        name: "Steve's wedding suit",
        symbol: "🤵",
        points: 20
      },
      {
  name: "Louise's wedding ring",
  kind: "plain-gold-band",
  points: 20
},
{
  name: "Steve's wedding ring",
  kind: "plain-gold-band",
  points: 20
},
      {
        name: "wedding flowers",
        symbol: "💐",
        points: 15
      },
      {
        name: "Louise's headdress",
        symbol: "👑",
        points: 15
      },
      {
        name: "Steve's buttonhole",
        symbol: "🌹",
        points: 15
      },
      {
        name: "witness - Andrea",
        symbol: "👩",
        points: 20
      },
      {
        name: "witness - Paul",
        symbol: "👨",
        points: 20
      },
      {
        name: "a piece of wedding cake",
        symbol: "🍰",
        points: 10
      },
      {
        name: "a piece of wedding cake",
        symbol: "🍰",
        points: 10
      },
      {
        name: "champagne",
        symbol: "🥂",
        points: 15
      },
      {
        name: "Antiguan sunshine",
        symbol: "☀️",
        points: 15
      },
      {
        name: "a calypso drum",
        symbol: "🪘",
        points: 15
      },
      {
        name: "a calypso drum",
        symbol: "🪘",
        points: 15
      }
    ],

    /*
      Colours based on the Antigua and Barbuda flag:
      red, black, blue, white and yellow.
    */

    palette: {
      wall: "#ce2030",
      wallEdge: "#000000",
      floor: "#3a75c4",
      accent: "#fcd116",
      pearl: "#ffffff"
    },

    intro:
      "Help Louise and Steve collect everything they need for their wedding, then reach the flower-covered wedding arch before time runs out.",

    complete:
      "Louise and Steve collected everything and made it to their Antigua wedding — right on time!"
  },

  {
    id: 2,
    playable: false,

    gameType: "packing",
    title: "Time to return home — Pack for the Airport",
    subtitle: "Pack their suitcase before the airport transfer arrives!",
    locationLabel: "ANTIGUA",

    duration: 60,

    packingItems: [
      { name: "passports", symbol: "🛂", correct: true, points: 20 },
      { name: "plane tickets", symbol: "🎫", correct: true, points: 20 },
      { name: "camera", symbol: "📷", correct: true, points: 15 },
      { name: "wedding photograph", symbol: "🖼️", correct: true, points: 20 },
      { name: "sun hats", symbol: "👒", correct: true, points: 15 },
      { name: "sandals", symbol: "🩴", correct: true, points: 15 },
      { name: "clothes", symbol: "👕", correct: true, points: 15 },
      { name: "toiletries", symbol: "🧴", correct: true, points: 15 },
      { name: "Antigua souvenir", symbol: "🎁", correct: true, points: 20 },
      { name: "hotel pillow", symbol: "🛏️", correct: false },
      { name: "palm tree", symbol: "🌴", correct: false },
      { name: "steel drum", symbol: "🪘", correct: false },
      { name: "wedding arch", symbol: "💒", correct: false }
    ],

    palette: {
      wall: "#ce2030",
      wallEdge: "#000000",
      floor: "#3a75c4",
      accent: "#fcd116",
      pearl: "#ffffff"
    },

    intro:
      "Help Louise and Steve pack everything they need for their journey back home. Leave the silly hotel extras behind!",

    complete:
      "The suitcase is packed and Louise and Steve are ready for the airport!"
  },

  {
    id: 3,
    playable: false,

    gameType: "wordsearch",

    title: "The Family Word Search",
    subtitle: "Find ten special names hidden among the letters",
    locationLabel: "FAMILY",

    duration: 90,

    words: [
      "LOUISE",
      "STEVE",
      "KAI",
      "ELISE",
      "CHLOE",
      "ELLA",
      "SHADOW"
    ],

    palette: {
      wall: "#ce2030",
      wallEdge: "#000000",
      floor: "#fff8df",
      accent: "#fcd116",
      pearl: "#ffffff"
    },

    intro:
      "Find Louise, Steve, Kai, Elise, Chloe, Ella and Shadow. Words may run horizontally, vertically or diagonally.",

    complete:
      "All ten special names have been found!"
  },
  {
    id: 4,
    playable: false,

    gameType: "pairs",

    title: "Memory Match",
    subtitle: "Match eight pairs of special memories",
    locationLabel: "MEMORIES",

    duration: 120,

    pairImages: [
      "assets/memory-1.jpg",
      "assets/memory-2.jpg",
      "assets/memory-3.jpg",
      "assets/memory-4.jpg",
      "assets/memory-5.jpg",
      "assets/memory-6.jpg",
      "assets/memory-7.jpg",
      "assets/memory-8.jpg"
    ],

    palette: {
      wall: "#7b4f87",
      wallEdge: "#3f2848",
      floor: "#fff4dc",
      accent: "#e8b84a",
      pearl: "#ffffff"
    },

    intro:
      "Turn over two cards at a time and find all eight matching photographs before time runs out.",

    complete:
      "All eight pairs of special memories have been matched!"
  },
  {
    id: 5,
    playable: false,

    gameType: "celebration-pop",

    title: "Celebration Pop!",
    subtitle: "Pop the celebration objects before time runs out",
    locationLabel: "CELEBRATE",

    duration: 45,
    targetScore: 300,

    popObjects: [
      {
        name: "balloon",
        symbol: "🎈",
        points: 10,
        correct: true
      },
      {
        name: "heart",
        symbol: "❤️",
        points: 15,
        correct: true
      },
      {
        name: "champagne bubble",
        symbol: "🫧",
        points: 20,
        correct: true
      },
      {
        name: "golden anniversary bonus",
        symbol: "30",
        points: 50,
        correct: true,
        bonus: true
      },
      {
        name: "rain cloud",
        symbol: "🌧️",
        points: 0,
        correct: false
      }
    ],

    palette: {
      wall: "#c92b3a",
      wallEdge: "#5c1530",
      floor: "#fff2c7",
      accent: "#f6c945",
      pearl: "#ffffff"
    },

    intro:
      "Pop balloons, hearts and champagne bubbles to score 300 points before time runs out. Look out for the golden 30 bonus—but avoid the rain clouds!",

    complete:
      "The celebration is in full swing!"
  },

  {
    id: 30,
    playable: false,

    gameType: "photo-puzzle",

    title: "Jamaica — 30 Years Together",
    subtitle: "Reassemble their pearl-anniversary photograph",
    locationLabel: "JAMAICA",

    duration: 180,

    photo:
      "assets/jamaica-pearl-anniversary.png",

    photoCaption:
      "Jamaica 2026 — 30 Years Together",

    puzzleSize: 3,

    palette: {
      wall: "#177245",
      wallEdge: "#111111",
      floor: "#f6d365",
      accent: "#fcd116",
      pearl: "#ffffff"
    },

    intro:
      "Swap the nine pieces to rebuild Louise and Steve’s pearl-anniversary photograph.",

    complete:
      "Jamaica 2026 — 30 Years Together"
  }
];
