const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.getElementById("score"),
  timer: document.getElementById("timer"),
  remaining: document.getElementById("remaining"),
  collectiblesLabel: document.getElementById("collectiblesLabel"),
  collectionMessage: document.getElementById("collectionMessage"),
  round: document.getElementById("roundLabel"),
  subtitle: document.getElementById("roundSubtitle"),
  progress: document.getElementById("progress"),
  location: document.querySelector(".island-label"),
  overlay: document.getElementById("overlay"),
  eyebrow: document.getElementById("overlayEyebrow"),
  title: document.getElementById("overlayTitle"),
  text: document.getElementById("overlayText"),
  overlayButton: document.getElementById("overlayStart"),
  overlayCouple: document.getElementById("overlayCouple"),
  weddingMemory: document.getElementById("weddingMemory"),
  canvasWrap: document.querySelector(".canvas-wrap"),
  packingGame: document.getElementById("packingGame"),
  packingItems: document.getElementById("packingItems"),
  packedItems: document.getElementById("packedItems"),
  suitcase: document.getElementById("suitcase"),
  wordSearchGame: document.getElementById("wordSearchGame"),
  wordSearchGrid: document.getElementById("wordSearchGrid"),
  wordSearchWords: document.getElementById("wordSearchWords"),
  pairsGame: document.getElementById("pairsGame"),
  pairsGrid: document.getElementById("pairsGrid"),
  celebrationPopGame: document.getElementById("celebrationPopGame"),
  celebrationPopArea: document.getElementById("celebrationPopArea"),
  celebrationScore: document.getElementById("celebrationScore"),
  celebrationTarget: document.getElementById("celebrationTarget"),
  photoPuzzleGame: document.getElementById("photoPuzzleGame"),
  photoPuzzleGrid: document.getElementById("photoPuzzleGrid"),
  photoPuzzlePreview: document.getElementById("photoPuzzlePreview"),
  hint: document.getElementById("controlHint"),
  start: document.getElementById("startButton"),
  restart: document.getElementById("restartButton")
};

const TILE = 40;
const COLS = 18;
const ROWS = 18;

/*
  1 = wall
  0 = corridor
*/

const MAZES = [
  [
    "111111111111111111",
    "100000100001000001",
    "101110101101011101",
    "101000001001000101",
    "101011111001110101",
    "100010000000010001",
    "111010111110010111",
    "100000100010000001",
    "101110101011111101",
    "100010001000000001",
    "101011111011101101",
    "101000000000101001",
    "101110111110101101",
    "100000100000001001",
    "101110101111101101",
    "100000000000000001",
    "100111111011111001",
    "111111111111111111"
  ],

  [
    "111111111111111111",
    "100000001000000001",
    "101111101011111101",
    "100001001000100001",
    "111101111110101111",
    "100100000000100001",
    "101101111011101101",
    "100001000010000001",
    "101111011110111101",
    "100000010000100001",
    "101110110111101101",
    "101000000100001001",
    "101011110101111101",
    "100010000100000001",
    "111010111111101111",
    "100000000000000001",
    "101111101111101101",
    "111111111111111111"
  ]
].map(maze =>
  maze.map(row =>
    row.split("").map(Number)
  )
);

const playableRounds =
  window.GAME_ROUNDS.filter(round => round.playable);

const state = {
  roundIndex: 0,

  running: false,
  over: false,

  score: 0,
  totalScore: 0,

  timeLeft: 0,
  lastTick: 0,
  moveAccumulator: 0,

  requestedDirection: "right",
  direction: "right",

  player: {
    x: 1,
    y: 1
  },

  /*
    The key is a maze position such as "3,5".
    The value describes the item at that position.
  */

  collectibles: new Map()
};

state.packingRemaining = 0;
state.packingComplete = new Set();
state.wordSearchRemaining = 0;
state.wordSearchFound = new Set();
state.wordSearchSelecting = false;
state.wordSearchStart = null;
state.wordSearchSelection = [];
state.pairsCards = [];
state.pairsSelected = [];
state.pairsMatched = new Set();
state.pairsRemaining = 0;
state.pairsLocked = false;
state.celebrationPoints = 0;
state.celebrationSpawnTimer = null;
state.photoPuzzlePieces = [];
state.photoPuzzleSelected = null;
state.photoPuzzleRemaining = 0;


const DIRECTIONS = {
  up: {
    x: 0,
    y: -1
  },

  down: {
    x: 0,
    y: 1
  },

  left: {
    x: -1,
    y: 0
  },

  right: {
    x: 1,
    y: 0
  }
};

/*
  Load Louise and Steve's caricature.
*/

const coupleImage = new Image();

coupleImage.src =
  "assets/steve-louise-caricature.png";

coupleImage.addEventListener(
  "load",
  draw
);

const itemTingSound =
  new Audio(
    "assets/item-ting.mp3"
  );

itemTingSound.preload = "auto";
itemTingSound.volume = 0.55;

const wrongBuzzerSound =
  new Audio("assets/wrong-buzzer.mp3");

wrongBuzzerSound.preload = "auto";
wrongBuzzerSound.volume = 0.55;

const jamaicaCelebrationMusic =
  new Audio(
    "assets/jamaica-celebration.mp3"
  );

jamaicaCelebrationMusic.preload =
  "auto";

jamaicaCelebrationMusic.loop = false;
jamaicaCelebrationMusic.volume = 0.65;

function playJamaicaCelebrationMusic() {
  jamaicaCelebrationMusic.pause();
  jamaicaCelebrationMusic.currentTime = 0;

  const playRequest =
    jamaicaCelebrationMusic.play();

  if (playRequest) {
    playRequest.catch(
      error => {
        console.log(
          "The Jamaica celebration music could not play.",
          error
        );
      }
    );
  }
}

function stopJamaicaCelebrationMusic() {
  jamaicaCelebrationMusic.pause();
  jamaicaCelebrationMusic.currentTime = 0;
}

/*
  Music played during Celebration Pop.
*/

const celebrationPopMusic =
  new Audio("assets/macarena.mp3");

celebrationPopMusic.preload = "auto";
celebrationPopMusic.loop = false;
celebrationPopMusic.volume = 0.4;

function playCelebrationPopMusic() {
  celebrationPopMusic.pause();
  celebrationPopMusic.currentTime = 0;

  const playRequest =
    celebrationPopMusic.play();

  if (playRequest) {
    playRequest.catch(
      error => {
        console.log(
          "The Celebration Pop music could not play.",
          error
        );
      }
    );
  }
}

function stopCelebrationPopMusic() {
  celebrationPopMusic.pause();
  celebrationPopMusic.currentTime = 0;
}

function playWrongBuzzer() {
  wrongBuzzerSound.pause();
  wrongBuzzerSound.currentTime = 0;

  const playRequest =
    wrongBuzzerSound.play();

  if (playRequest) {
    playRequest.catch(
      error => {
        console.log(
          "The buzzer sound could not play.",
          error
        );
      }
    );
  }
}

let touchStart = null;
let messageTimer = null;
let calypsoAudioContext = null;
let calypsoSources = [];

/*
  Recorded calypso music used on the
  wedding-photograph screen.
*/

const recordedCalypso =
  new Audio(
    "assets/antigua-calypso.mp3"
  );

recordedCalypso.loop = false;
recordedCalypso.volume = 0.6;

function playRecordedCalypso() {
  /*
    Restart from the beginning when the
    photograph appears or Replay is selected.
  */

  recordedCalypso.pause();
  recordedCalypso.currentTime = 0;

  const playRequest =
    recordedCalypso.play();

  /*
    Prevent a browser autoplay restriction from
    causing a JavaScript error.
  */

  if (playRequest) {
    playRequest.catch(
      error => {
        console.log(
          "The browser prevented automatic audio playback.",
          error
        );
      }
    );
  }
}

function stopRecordedCalypso() {
  recordedCalypso.pause();
  recordedCalypso.currentTime = 0;
}

/* Paste the new function here */

function prepareRecordedCalypso() {
  if (
    recordedCalypso.dataset.prepared ===
    "true"
  ) {
    return;
  }

  recordedCalypso.muted = true;

  const preparation =
    recordedCalypso.play();

  if (preparation) {
    preparation
      .then(
        () => {
          recordedCalypso.pause();
          recordedCalypso.currentTime = 0;
          recordedCalypso.muted = false;

          recordedCalypso.dataset.prepared =
            "true";
        }
      )
      .catch(
        () => {
          recordedCalypso.muted = false;
        }
      );
  }
}
/*
  Stop any calypso music that is already playing.
*/

function stopCalypsoMusic() {
  calypsoSources.forEach(
    source => {
      try {
        source.stop();
      } catch (error) {
        /*
          The source may already have finished.
        */
      }
    }
  );

  calypsoSources = [];
}

/*
  Create a short original steel-drum-style
  calypso melody using the browser's audio system.
*/

function playCalypsoMusic() {
  stopRecordedCalypso();

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!calypsoAudioContext) {
    calypsoAudioContext =
      new AudioContextClass();
  }

  if (
    calypsoAudioContext.state === "suspended"
  ) {
    calypsoAudioContext.resume();
  }

  const audioContext =
    calypsoAudioContext;

  const startTime =
    audioContext.currentTime + 0.05;

  /*
    A cheerful original melody using note
    frequencies rather than a recorded song.
  */

  const melody = [
    523.25,
    659.25,
    783.99,
    659.25,

    698.46,
    783.99,
    880.00,
    783.99,

    659.25,
    587.33,
    523.25,
    587.33,

    659.25,
    783.99,
    659.25,
    523.25
  ];

  const bass = [
    130.81,
    130.81,
    174.61,
    174.61,

    146.83,
    146.83,
    196.00,
    196.00
  ];

  const beatLength = 0.32;

  /*
    Play two passes of the melody.
  */

  for (
    let repeat = 0;
    repeat < 2;
    repeat += 1
  ) {
    melody.forEach(
      (frequency, noteIndex) => {
        const noteTime =
          startTime +
          (
            repeat * melody.length +
            noteIndex
          ) *
          beatLength;

        playSteelDrumNote(
          audioContext,
          frequency,
          noteTime,
          0.28
        );
      }
    );
  }

  /*
    Add a gentle calypso bass rhythm.
  */

  for (
    let repeat = 0;
    repeat < 4;
    repeat += 1
  ) {
    bass.forEach(
      (frequency, noteIndex) => {
        const noteTime =
          startTime +
          (
            repeat * bass.length +
            noteIndex
          ) *
          beatLength;

        playBassNote(
          audioContext,
          frequency,
          noteTime,
          0.22
        );
      }
    );
  }
}

function playSteelDrumNote(
  audioContext,
  frequency,
  startTime,
  volume
) {
  const oscillator =
    audioContext.createOscillator();

  const harmonic =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  const harmonicGain =
    audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(
    frequency * 2.01,
    startTime
  );

  gain.gain.setValueAtTime(
    volume,
    startTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + 0.3
  );

  harmonicGain.gain.setValueAtTime(
    volume * 0.24,
    startTime
 
  );

  harmonicGain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + 0.18
  );

  oscillator.connect(gain);
  harmonic.connect(harmonicGain);

  gain.connect(
    audioContext.destination
  );

  harmonicGain.connect(
    audioContext.destination
  );

  oscillator.start(startTime);
  harmonic.start(startTime);

  oscillator.stop(startTime + 0.32);
  harmonic.stop(startTime + 0.2);

  calypsoSources.push(
    oscillator,
    harmonic
  );
}

function playBassNote(
  audioContext,
  frequency,
  startTime,
  volume
) {
  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "triangle";

  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  gain.gain.setValueAtTime(
    volume,
    startTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + 0.25
  );

  oscillator.connect(gain);

  gain.connect(
    audioContext.destination
  );

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.27);

  calypsoSources.push(oscillator);
}

let collectionMessageQueue = [];
let collectionMessageShowing = false;

function currentRound() {
  return playableRounds[state.roundIndex];
}

function currentMaze() {
  return MAZES[state.roundIndex % MAZES.length];
}

function positionKey(x, y) {
  return `${x},${y}`;
}

function isWalkable(x, y) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < COLS &&
    y < ROWS &&
    currentMaze()[y][x] === 0
  );
}
function playCollectionTing() {
  /*
    Clone the sound so two closely collected
    objects can each produce their own ting.
  */

  const sound =
    itemTingSound.cloneNode();

  sound.volume =
    itemTingSound.volume;

  const playRequest =
    sound.play();

  if (playRequest) {
    playRequest.catch(
      error => {
        console.log(
          "The collection sound could not play.",
          error
        );
      }
    );
  }
}

function isPackingRound() {
  return currentRound().gameType === "packing";
}
function isCelebrationPopRound() {
  return currentRound().gameType ===
    "celebration-pop";
}

function stopCelebrationSpawning() {
  if (state.celebrationSpawnTimer) {
    clearInterval(
      state.celebrationSpawnTimer
    );

    state.celebrationSpawnTimer = null;
  }
}

function renderCelebrationPopGame() {
  stopCelebrationSpawning();

  ui.celebrationPopArea
    .querySelectorAll(
      ".celebration-object"
    )
    .forEach(
      object => object.remove()
    );

  state.celebrationPoints = 0;

  ui.celebrationScore.textContent =
    "0";

  ui.celebrationTarget.textContent =
    currentRound().targetScore;
}

function chooseCelebrationObject() {
  const objects =
    currentRound().popObjects;

  const randomNumber =
    Math.random();

  /*
    Rain clouds and golden 30s appear less
    frequently than the normal objects.
  */

  if (randomNumber < 0.10) {
    return objects.find(
      object => !object.correct
    );
  }

  if (randomNumber < 0.20) {
    return objects.find(
      object => object.bonus
    );
  }

  const normalObjects =
    objects.filter(
      object =>
        object.correct &&
        !object.bonus
    );

  return normalObjects[
    Math.floor(
      Math.random() *
      normalObjects.length
    )
  ];
}

function spawnCelebrationObject() {
  if (
    !state.running ||
    !isCelebrationPopRound()
  ) {
    return;
  }

  const object =
    chooseCelebrationObject();

  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "celebration-object";

  if (object.bonus) {
    button.classList.add("bonus");
  }

  button.textContent = object.symbol;

  button.setAttribute(
    "aria-label",
    object.name
  );

  button.style.setProperty(
    "--pop-left",
    `${3 + Math.random() * 87}%`
  );

  button.style.setProperty(
    "--pop-speed",
    `${4 + Math.random() * 3}s`
  );

  button.addEventListener(
    "pointerdown",
    event => {
      event.preventDefault();

      popCelebrationObject(
        button,
        object
      );
    }
  );

  button.addEventListener(
    "animationend",
    () => button.remove()
  );

  ui.celebrationPopArea.appendChild(
    button
  );
}

function popCelebrationObject(
  button,
  object
) {
  if (
    !state.running ||
    button.classList.contains("popped") ||
    button.classList.contains("wrong")
  ) {
    return;
  }

  if (object.correct) {
    button.classList.add("popped");

    state.celebrationPoints +=
      object.points;

    state.score += object.points;

    ui.celebrationScore.textContent =
      state.celebrationPoints;

    playCollectionTing();

    queueCollectionMessage(
      `${object.symbol} ${object.points} points!`,
      "collected",
      700
    );

    updateHud();

    if (
      state.celebrationPoints >=
      currentRound().targetScore
    ) {
      stopCelebrationSpawning();

      state.score += 100;

      setTimeout(
        () => finishRound(true),
        350
      );
    }
  } else {
    button.classList.add("wrong");

    playWrongBuzzer();

    queueCollectionMessage(
      "Avoid the rain clouds!",
      "ready",
      800
    );
  }
}

function startCelebrationSpawning() {
  stopCelebrationSpawning();

  spawnCelebrationObject();

  state.celebrationSpawnTimer =
    setInterval(
      spawnCelebrationObject,
      650
    );
}
function isPairsRound() {
  return currentRound().gameType ===
    "pairs";
}

function displayPairsCards() {
  ui.pairsGrid.innerHTML = "";

  state.pairsCards.forEach(
    (card, position) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "pairs-card";

      button.dataset.position =
        position;

      button.setAttribute(
        "aria-label",
        `Memory card ${position + 1}`
      );

      button.style.setProperty(
        "--pair-image",
        `url("${card.image}")`
      );

      if (
        state.pairsSelected.includes(
          position
        ) ||
        state.pairsMatched.has(position)
      ) {
        button.classList.add(
          "flipped"
        );
      }

      if (
        state.pairsMatched.has(position)
      ) {
        button.classList.add(
          "matched"
        );
      }

      button.addEventListener(
        "pointerdown",
        event => {
          event.preventDefault();

          selectPairsCard(position);
        }
      );

      ui.pairsGrid.appendChild(
        button
      );
    }
  );
}

function renderPairsGame() {
  const round = currentRound();

  state.pairsCards = [];

  round.pairImages.forEach(
    (image, pairNumber) => {
      state.pairsCards.push(
        {
          image,
          pairNumber
        },
        {
          image,
          pairNumber
        }
      );
    }
  );

  for (
    let index =
      state.pairsCards.length - 1;

    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    [
      state.pairsCards[index],
      state.pairsCards[randomIndex]
    ] = [
      state.pairsCards[randomIndex],
      state.pairsCards[index]
    ];
  }

  state.pairsSelected = [];
  state.pairsMatched.clear();

  state.pairsRemaining =
    round.pairImages.length;

  state.pairsLocked = false;

  displayPairsCards();
}

function selectPairsCard(position) {
  if (
    !state.running ||
    !isPairsRound() ||
    state.pairsLocked ||
    state.pairsMatched.has(position) ||
    state.pairsSelected.includes(position)
  ) {
    return;
  }

  state.pairsSelected.push(position);

  displayPairsCards();

  if (state.pairsSelected.length < 2) {
    return;
  }

  state.pairsLocked = true;

  const firstPosition =
    state.pairsSelected[0];

  const secondPosition =
    state.pairsSelected[1];

  const firstCard =
    state.pairsCards[firstPosition];

  const secondCard =
    state.pairsCards[secondPosition];

  const isMatch =
    firstCard.pairNumber ===
    secondCard.pairNumber;

  setTimeout(
    () => {
      if (isMatch) {
        state.pairsMatched.add(
          firstPosition
        );

        state.pairsMatched.add(
          secondPosition
        );

        state.pairsRemaining -= 1;
        state.score += 40;

        playCollectionTing();

        queueCollectionMessage(
          `You found a matching pair!`,
          "collected",
          1300
        );
      } else {
        playWrongBuzzer();

        queueCollectionMessage(
          "Those photographs do not match.",
          "ready",
          1200
        );
      }

      state.pairsSelected = [];
      state.pairsLocked = false;

      displayPairsCards();
      updateHud();

      if (state.pairsRemaining === 0) {
        state.score += 100;

        setTimeout(
          () => finishRound(true),
          700
        );
      }
    },
    750
  );
}

function isWordSearchRound() {
  return currentRound().gameType === "wordsearch";
}

function isPhotoPuzzleRound() {
  return (
    currentRound().id === 30 ||
    currentRound().gameType ===
      "photo-puzzle"
  );
}

function countCorrectPhotoPieces() {
  return state.photoPuzzlePieces.filter(
    (pieceNumber, position) =>
      pieceNumber === position
  ).length;
}

function displayPhotoPuzzlePieces() {
  const round = currentRound();
  const size = round.puzzleSize || 3;

  ui.photoPuzzleGrid.innerHTML = "";

  state.photoPuzzlePieces.forEach(
    (pieceNumber, position) => {
      const piece =
        document.createElement("button");

      piece.type = "button";
      piece.className =
        "photo-puzzle-piece";

      piece.dataset.position = position;

      const originalRow =
        Math.floor(pieceNumber / size);

      const originalColumn =
        pieceNumber % size;

      const percentage =
        100 / (size - 1);

      piece.style.backgroundImage =
        `url("${round.photo}")`;

      piece.style.backgroundPosition =
        `${originalColumn * percentage}% ` +
        `${originalRow * percentage}%`;

      if (pieceNumber === position) {
        piece.classList.add("correct");
      }

      if (
        state.photoPuzzleSelected ===
        position
      ) {
        piece.classList.add("selected");
      }

      piece.addEventListener(
        "click",
        () => selectPhotoPuzzlePiece(
          position
        )
      );

      ui.photoPuzzleGrid.appendChild(
        piece
      );
    }
  );
}

function renderPhotoPuzzle() {
  const round = currentRound();
  const size = round.puzzleSize || 3;
  const numberOfPieces = size * size;

  state.photoPuzzlePieces =
    Array.from(
      {
        length: numberOfPieces
      },
      (_, index) => index
    );

  /*
    Shuffle the photograph pieces.
  */

  for (
    let index =
      state.photoPuzzlePieces.length - 1;

    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    [
      state.photoPuzzlePieces[index],
      state.photoPuzzlePieces[randomIndex]
    ] = [
      state.photoPuzzlePieces[randomIndex],
      state.photoPuzzlePieces[index]
    ];
  }

  /*
    Make sure it never starts already solved.
  */

  if (
    countCorrectPhotoPieces() ===
    numberOfPieces
  ) {
    [
      state.photoPuzzlePieces[0],
      state.photoPuzzlePieces[1]
    ] = [
      state.photoPuzzlePieces[1],
      state.photoPuzzlePieces[0]
    ];
  }

  state.photoPuzzleSelected = null;

  state.photoPuzzleRemaining =
    numberOfPieces -
    countCorrectPhotoPieces();

  ui.photoPuzzlePreview.src =
    round.photo;

  displayPhotoPuzzlePieces();
}

function selectPhotoPuzzlePiece(position) {
  if (
    !state.running ||
    !isPhotoPuzzleRound()
  ) {
    return;
  }

  if (
    state.photoPuzzleSelected === null
  ) {
    state.photoPuzzleSelected =
      position;

    displayPhotoPuzzlePieces();
    return;
  }

  if (
    state.photoPuzzleSelected ===
    position
  ) {
    state.photoPuzzleSelected = null;
    displayPhotoPuzzlePieces();
    return;
  }

  const firstPosition =
    state.photoPuzzleSelected;

  const correctBefore =
    countCorrectPhotoPieces();

  [
    state.photoPuzzlePieces[
      firstPosition
    ],
    state.photoPuzzlePieces[position]
  ] = [
    state.photoPuzzlePieces[position],
    state.photoPuzzlePieces[
      firstPosition
    ]
  ];

  state.photoPuzzleSelected = null;

  const correctAfter =
    countCorrectPhotoPieces();

  state.photoPuzzleRemaining =
    state.photoPuzzlePieces.length -
    correctAfter;

  displayPhotoPuzzlePieces();

  if (correctAfter > correctBefore) {
    state.score +=
      20 *
      (correctAfter - correctBefore);

    playCollectionTing();

    queueCollectionMessage(
      "That helped rebuild the picture!",
      "collected",
      1300
    );
  } else {
    playWrongBuzzer();

    queueCollectionMessage(
      "Those pieces do not fit there.",
      "ready",
      1300
    );
  }

  updateHud();

  if (state.photoPuzzleRemaining === 0) {
    state.score += 100;

    setTimeout(
      () => finishRound(true),
      700
    );
  }
}

/*
  The ten names are hidden horizontally,
  vertically and diagonally in this grid.
*/

const FAMILY_WORD_GRID = [
  "LOUISEXQPK",
  "EBRNTYKMCS",
  "FLWPGDJANT",
  "QZIRUBXCIE",
  "MNHSPLODOV",
  "TCGYEWRHQE",
  "ELLABNMUPR",
  "VTJKEOLHCX",
  "PHNFDSTAMG",
  "SHADOWYILB"
];

function renderWordSearch() {
  const round = currentRound();

  ui.wordSearchGrid.innerHTML = "";
  ui.wordSearchWords.innerHTML = "";

  state.wordSearchFound.clear();
  state.wordSearchSelecting = false;
  state.wordSearchStart = null;
  state.wordSearchCurrent = [];

  state.wordSearchRemaining =
    round.words.length;

  FAMILY_WORD_GRID.forEach(
    (row, rowNumber) => {
      row.split("").forEach(
        (letter, columnNumber) => {
          const square =
            document.createElement("button");

          square.type = "button";
          square.className =
            "word-search-letter";

          square.textContent = letter;

          square.dataset.row =
            rowNumber;

          square.dataset.column =
            columnNumber;

          square.setAttribute(
            "aria-label",
            letter
          );

          ui.wordSearchGrid.appendChild(
            square
          );
        }
      );
    }
  );

  round.words.forEach(
    word => {
      const wordDisplay =
        document.createElement("span");

      wordDisplay.className =
        "word-search-name";

      wordDisplay.dataset.word = word;
      wordDisplay.textContent = word;

      ui.wordSearchWords.appendChild(
        wordDisplay
      );
    }
  );
}

function wordSearchSquare(row, column) {
  return ui.wordSearchGrid.querySelector(
    `[data-row="${row}"][data-column="${column}"]`
  );
}

function updateWordSearchSelection(
  endRow,
  endColumn
) {
  const start =
    state.wordSearchStart;

  if (!start) {
    return;
  }

  const rowDifference =
    endRow - start.row;

  const columnDifference =
    endColumn - start.column;

  const isStraightLine =
    rowDifference === 0 ||
    columnDifference === 0 ||
    Math.abs(rowDifference) ===
      Math.abs(columnDifference);

  ui.wordSearchGrid
    .querySelectorAll(".selecting")
    .forEach(
      square => {
        square.classList.remove(
          "selecting"
        );
      }
    );

  state.wordSearchCurrent = [];

  if (!isStraightLine) {
    return;
  }

  const numberOfSteps =
    Math.max(
      Math.abs(rowDifference),
      Math.abs(columnDifference)
    );

  const rowStep =
    Math.sign(rowDifference);

  const columnStep =
    Math.sign(columnDifference);

  for (
    let step = 0;
    step <= numberOfSteps;
    step += 1
  ) {
    const row =
      start.row + rowStep * step;

    const column =
      start.column +
      columnStep * step;

    const square =
      wordSearchSquare(
        row,
        column
      );

    if (square) {
      square.classList.add(
        "selecting"
      );

      state.wordSearchCurrent.push(
        square
      );
    }
  }
}

function finishWordSearchSelection() {
  if (
    !state.wordSearchSelecting ||
    state.wordSearchCurrent.length === 0
  ) {
    state.wordSearchSelecting = false;
    return;
  }

  state.wordSearchSelecting = false;

  const selectedLetters =
    state.wordSearchCurrent
      .map(square => square.textContent)
      .join("");

  const reversedLetters =
    selectedLetters
      .split("")
      .reverse()
      .join("");

  const matchingWord =
    currentRound().words.find(
      word =>
        !state.wordSearchFound.has(word) &&
        (
          word === selectedLetters ||
          word === reversedLetters
        )
    );

  if (matchingWord) {
    state.wordSearchFound.add(
      matchingWord
    );

    state.wordSearchRemaining -= 1;
    state.score += 30;

    state.wordSearchCurrent.forEach(
      square => {
        square.classList.remove(
          "selecting"
        );

        square.classList.add(
          "found"
        );
      }
    );

    const wordDisplay =
      ui.wordSearchWords.querySelector(
        `[data-word="${matchingWord}"]`
      );

    if (wordDisplay) {
      wordDisplay.classList.add(
        "found"
      );
    }

    playCollectionTing();

    queueCollectionMessage(
      `Found ${matchingWord}!`,
      "collected",
      1400
    );

    updateHud();

    if (
      state.wordSearchRemaining === 0
    ) {
      state.score += 100;

      setTimeout(
        () => finishRound(true),
        700
      );
    }
  } else {
    playWrongBuzzer();

    state.wordSearchCurrent.forEach(
      square => {
        square.classList.remove(
          "selecting"
        );

        square.classList.add(
          "wrong"
        );

        setTimeout(
          () => {
            square.classList.remove(
              "wrong"
            );
          },
          450
        );
      }
    );

    queueCollectionMessage(
      "That is not one of the hidden names.",
      "ready",
      1300
    );
  }

  state.wordSearchCurrent = [];
}


function renderPackingGame() {
  const round = currentRound();

  ui.packingItems.innerHTML = "";
  ui.packedItems.innerHTML = "";
  state.packingComplete.clear();
  state.packingRemaining = round.packingItems.filter(item => item.correct).length;

  round.packingItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "packing-item";
        button.draggable = false;
    button.dataset.index = index;

    button.innerHTML =
      `<span>${item.symbol}</span>` +
      `<small>${item.name}</small>`;

    button.setAttribute(
      "aria-label",
      item.name
    );

    button.addEventListener(
      "pointerdown",
      event => {
        event.preventDefault();

        packItem(
          index,
          button
        );
      }
    );

    ui.packingItems.appendChild(button);
  });
}

function packItem(index, element) {
  if (!state.running || state.packingComplete.has(index)) return;

  const item = currentRound().packingItems[index];

  if (!item.correct) {
  playWrongBuzzer();

  element.classList.remove("wrong");
    void element.offsetWidth;
    element.classList.add("wrong");
    queueCollectionMessage(`${item.symbol} Leave the ${item.name} at the hotel!`, "ready", 1500);
    return;
  }

  state.packingComplete.add(index);
  state.packingRemaining -= 1;
  state.score += item.points;
  element.classList.add("packed");

  const packed = document.createElement("span");
  packed.textContent = item.symbol;
  packed.title = item.name;
  ui.packedItems.appendChild(packed);

  playCollectionTing();
  queueCollectionMessage(`${item.symbol} Packed ${item.name}!`, "collected", 1300);
  updateHud();

  if (state.packingRemaining === 0) {
    state.score += 100;
    setTimeout(() => finishRound(true), 700);
  }
}


/*
  Find suitable corridor squares and distribute
  the round's items around the maze.
*/

function seedCollectibles() {
  state.collectibles.clear();

  const round = currentRound();
  const goal = round.goal;

  const availableSquares = [];

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const isStartingSquare =
        x === 1 && y === 1;

      const isGoalSquare =
        goal &&
        x === goal.x &&
        y === goal.y;

      if (
        currentMaze()[y][x] === 0 &&
        !isStartingSquare &&
        !isGoalSquare
      ) {
        availableSquares.push({
          x,
          y
        });
      }
    }
  }

  /*
    Round 1 uses the wedding items configured
    in rounds.js.
  */

  if (
    Array.isArray(round.collectibles) &&
    round.collectibles.length > 0
  ) {
    round.collectibles.forEach(
      (item, itemIndex) => {
        /*
          Spread the items through the entire maze
          rather than grouping them together.
        */

        const squareIndex =
          Math.floor(
            ((itemIndex + 1) *
              availableSquares.length) /
            (round.collectibles.length + 1)
          );

        const square =
          availableSquares[squareIndex];

        state.collectibles.set(
          positionKey(
            square.x,
            square.y
          ),
          item
        );
      }
    );

    return;
  }

  /*
    Other unfinished rounds continue to use pearls.
  */

  availableSquares.forEach(
    (square, squareIndex) => {
      if (
        squareIndex % 3 === 0 ||
        squareIndex % 7 === 0
      ) {
        state.collectibles.set(
          positionKey(
            square.x,
            square.y
          ),
          {
            name: "pearl",
            symbol: "●",
            points: 10,
            pearl: true
          }
        );
      }
    }
  );
}

function applyTheme() {
  const round = currentRound();

  const colours = {
    sea: round.palette.wall,
    "sea-dark": round.palette.wallEdge,
    sand: round.palette.floor,
    coral: round.palette.accent
  };

  Object.entries(colours).forEach(
    ([name, value]) => {
      document.documentElement.style.setProperty(
        `--${name}`,
        value
      );
    }
  );

  ui.subtitle.textContent =
    round.subtitle;

  if (ui.location) {
    ui.location.textContent =
      round.locationLabel;
  }

  ui.round.textContent =
    `${round.id} OF 30`;

    ui.collectiblesLabel.textContent =
    isPhotoPuzzleRound()
      ? "Pieces out of place"
      : isCelebrationPopRound()
        ? "Points needed"
        : isPairsRound()
          ? "Pairs left"
          : isWordSearchRound()
            ? "Names left"
            : isPackingRound()
              ? "Items left to pack"
              : round.id === 1
                ? "Wedding items left"
                : "Pearls left";

    ui.hint.textContent =
    isPhotoPuzzleRound()
      ? "Select one photograph piece, then another, to swap them"
      : isCelebrationPopRound()
        ? "Tap the celebration objects—but avoid the rain clouds"
        : isPairsRound()
          ? "Select two cards at a time to find a matching pair"
          : isWordSearchRound()
            ? "Drag from the first letter to the last letter of each name"
            : isPackingRound()
              ? "Click or tap items to pack"
              : "Arrow keys or WASD on a computer • swipe across the maze on a phone";
}

function renderProgress() {
  ui.progress.innerHTML = "";

  for (
    let roundNumber = 1;
    roundNumber <= 30;
    roundNumber += 1
  ) {
    const dot =
      document.createElement("span");

    dot.textContent = roundNumber;
    dot.title = `Round ${roundNumber}`;

    if (
      roundNumber < currentRound().id
    ) {
      dot.className = "done";
    } else if (
      roundNumber === currentRound().id
    ) {
      dot.className = "current";
    }

    ui.progress.appendChild(dot);
  }
}

function showIntroduction() {
  const round = currentRound();

  ui.weddingMemory.classList.add(
    "hidden"
  );

  ui.overlayCouple.classList.remove(
    "hidden"
  );

  ui.eyebrow.textContent =
  `Challenge ${round.id} of 30`;

  ui.title.textContent =
    round.title;

  ui.text.textContent =
    round.intro;

    ui.overlayButton.textContent =
    round.id === 1
      ? "Get them to the wedding!"
      : isPackingRound()
        ? "Start packing!"
        : isWordSearchRound()
          ? "Start searching!"
          : isPairsRound()
            ? "Start matching!"
            : isCelebrationPopRound()
              ? "Start popping!"
              : isPhotoPuzzleRound()
                ? "Rebuild the photograph!"
                : "Start next chapter";

  ui.overlayButton.dataset.action =
    "start";

  ui.overlay.classList.add(
    "visible"
  );
}

/*
  Display an immediate message and clear any
  queued collection messages.
*/

function setCollectionMessage(
  message,
  messageType = ""
) {
  clearTimeout(messageTimer);

  collectionMessageQueue = [];
  collectionMessageShowing = false;

  ui.collectionMessage.textContent =
    message;

  ui.collectionMessage.classList.remove(
    "collected",
    "ready"
  );

  if (messageType) {
    ui.collectionMessage.classList.add(
      messageType
    );
  }
}

/*
  Add a collected item to the message queue.
*/

function queueCollectionMessage(
  message,
  messageType = "collected",
  duration = 1500
) {
  collectionMessageQueue.push({
    message,
    messageType,
    duration
  });

  if (!collectionMessageShowing) {
    showNextCollectionMessage();
  }
}

/*
  Show queued messages one at a time.
*/

function showNextCollectionMessage() {
  if (collectionMessageQueue.length === 0) {
    collectionMessageShowing = false;

    if (
      state.collectibles.size > 0 &&
      currentRound().id === 1
    ) {
      ui.collectionMessage.textContent =
        `${state.collectibles.size} wedding items still to collect`;

      ui.collectionMessage.classList.remove(
        "collected",
        "ready"
      );
    }

    return;
  }

  collectionMessageShowing = true;

  const nextMessage =
    collectionMessageQueue.shift();

  ui.collectionMessage.textContent =
    nextMessage.message;

  ui.collectionMessage.classList.remove(
    "collected",
    "ready"
  );

  if (nextMessage.messageType) {
    ui.collectionMessage.classList.add(
      nextMessage.messageType
    );
  }

  clearTimeout(messageTimer);

  messageTimer = setTimeout(
    showNextCollectionMessage,
    nextMessage.duration
  );
}

function resetRound() {
  const round = currentRound();

  stopCelebrationSpawning();
  stopCelebrationPopMusic();

  state.running = false;
  state.over = false;

  state.score = 0;
  state.timeLeft = round.duration;

  state.lastTick = 0;
  state.moveAccumulator = 0;

  state.requestedDirection = "right";
  state.direction = "right";

  state.player = {
    x: 1,
    y: 1
  };

    ui.canvasWrap.classList.toggle(
    "hidden",
    isPackingRound() ||
      isWordSearchRound() ||
      isPairsRound() ||
      isCelebrationPopRound() ||
      isPhotoPuzzleRound()
  );

  ui.packingGame.classList.toggle(
    "hidden",
    !isPackingRound()
  );

  ui.wordSearchGame.classList.toggle(
    "hidden",
    !isWordSearchRound()
  );

  ui.pairsGame.classList.toggle(
    "hidden",
    !isPairsRound()
  );

  ui.celebrationPopGame.classList.toggle(
    "hidden",
    !isCelebrationPopRound()
  );

  ui.photoPuzzleGame.classList.toggle(
    "hidden",
    !isPhotoPuzzleRound()
  );

  if (isPackingRound()) {
    state.collectibles.clear();
    renderPackingGame();
  } else if (isWordSearchRound()) {
    state.collectibles.clear();
    renderWordSearch();
  } else if (isPairsRound()) {
    state.collectibles.clear();
    renderPairsGame();
  } else if (isCelebrationPopRound()) {
    state.collectibles.clear();
    renderCelebrationPopGame();
  } else if (isPhotoPuzzleRound()) {
    state.collectibles.clear();
    renderPhotoPuzzle();
  } else {
    seedCollectibles();
  }
  applyTheme();
  renderProgress();
  updateHud();

        if (isPhotoPuzzleRound()) {
    setCollectionMessage(
      "Reassemble Louise and Steve’s Jamaica photograph!"
    );
  } else if (isCelebrationPopRound()) {
    setCollectionMessage(
      "Score 300 points to complete the celebration!"
    );
  } else if (isPairsRound()) {
    setCollectionMessage(
      "Find all eight matching photograph pairs!"
    );
  } else if (isWordSearchRound()) {
    setCollectionMessage(
      "Find all ten special names!"
    );
  } else if (isPackingRound()) {
    setCollectionMessage(
      "Pack the essentials — but leave the hotel extras behind!"
    );
  } else if (round.id === 1) {
    setCollectionMessage(
      "Collect everything Louise and Steve need for their wedding!"
    );
  } else {
    setCollectionMessage(
      "Collect everything in the maze!"
    );
  }

  draw();
}

function updateHud() {
  ui.score.textContent =
    state.totalScore + state.score;

  ui.timer.textContent =
    Math.max(
      0,
      Math.ceil(state.timeLeft)
    );

    ui.remaining.textContent =
    isPhotoPuzzleRound()
      ? state.photoPuzzleRemaining
      : isCelebrationPopRound()
        ? Math.max(
            0,
            currentRound().targetScore -
              state.celebrationPoints
          )
        : isPairsRound()
          ? state.pairsRemaining
          : isWordSearchRound()
            ? state.wordSearchRemaining
            : isPackingRound()
              ? state.packingRemaining
              : state.collectibles.size;
}
function draw() {
  const round = currentRound();

          if (
    isPackingRound() ||
    isWordSearchRound() ||
    isPairsRound() ||
    isCelebrationPopRound() ||
    isPhotoPuzzleRound()
  ) {
    return;
  }

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle =
    round.palette.floor;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawBackgroundDecoration();
  drawMaze();
  drawWeddingArch();
  drawCollectibles();
  drawCouple();
}

function drawBackgroundDecoration() {
  const round = currentRound();

  ctx.save();

  if (round.id === 1) {
    /*
      Antigua flag-inspired black upper band.
    */

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000000";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      115
    );

    /*
      White wave lines over the blue background.
    */

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    for (
      let line = 0;
      line < 6;
      line += 1
    ) {
      const baseY =
        160 + line * 105;

      ctx.beginPath();

      for (
        let x = 0;
        x <= canvas.width;
        x += 20
      ) {
        const y =
          baseY +
          Math.sin(
            (x + line * 17) / 35
          ) * 7;

        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    /*
      Yellow rising sun.
    */

    ctx.globalAlpha = 0.32;
    ctx.fillStyle = "#fcd116";

    ctx.beginPath();

    ctx.arc(
      canvas.width / 2,
      58,
      42,
      Math.PI,
      Math.PI * 2
    );

    ctx.fill();
  } else {
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    for (
      let line = 0;
      line < 7;
      line += 1
    ) {
      const baseY =
        55 + line * 105;

      ctx.beginPath();

      for (
        let x = 0;
        x <= canvas.width;
        x += 20
      ) {
        const y =
          baseY +
          Math.sin(
            (x + line * 17) / 35
          ) * 7;

        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawMaze() {
  const round = currentRound();
  const maze = currentMaze();

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (maze[y][x] !== 1) {
        continue;
      }

      const pixelX = x * TILE;
      const pixelY = y * TILE;

      ctx.fillStyle =
        round.palette.wall;

      ctx.fillRect(
        pixelX,
        pixelY,
        TILE,
        TILE
      );

      ctx.strokeStyle =
        round.palette.wallEdge;

      ctx.lineWidth = 2;

      ctx.strokeRect(
        pixelX + 3,
        pixelY + 3,
        TILE - 6,
        TILE - 6
      );

      ctx.fillStyle =
        "rgba(255, 255, 255, 0.20)";

      ctx.beginPath();

      ctx.arc(
        pixelX + 11,
        pixelY + 11,
        3,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }
}

function drawWeddingArch() {
  const goal = currentRound().goal;

  if (!goal) {
    return;
  }

  const centreX =
    goal.x * TILE + TILE / 2;

  const baseY =
    goal.y * TILE + 34;

  const ready =
    state.collectibles.size === 0;

  ctx.save();

  ctx.translate(
    centreX,
    baseY
  );

  if (ready) {
    const glow =
      ctx.createRadialGradient(
        0,
        -12,
        2,
        0,
        -12,
        34
      );

    glow.addColorStop(
      0,
      "rgba(252, 209, 22, 0.85)"
    );

    glow.addColorStop(
      1,
      "rgba(252, 209, 22, 0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
      0,
      -12,
      34,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.lineCap = "round";

  ctx.strokeStyle =
    ready
      ? "#ffffff"
      : "#d8d8d8";

  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(-15, 4);
  ctx.lineTo(-15, -12);

  ctx.arc(
    0,
    -12,
    15,
    Math.PI,
    0
  );

  ctx.lineTo(15, 4);
  ctx.stroke();

  const flowers = [
    [-15, -12],
    [-11, -23],
    [0, -28],
    [11, -23],
    [15, -12]
  ];

  flowers.forEach(
    ([flowerX, flowerY], index) => {
      ctx.fillStyle =
        index % 2
          ? "#fcd116"
          : "#ffffff";

      ctx.beginPath();

      ctx.arc(
        flowerX,
        flowerY,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = "#ce2030";

      ctx.beginPath();

      ctx.arc(
        flowerX,
        flowerY,
        2,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  ctx.fillStyle =
    ready
      ? "#fcd116"
      : "rgba(255, 255, 255, 0.8)";

  ctx.font = "bold 8px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText(
    ready
      ? "WEDDING!"
      : "LOCKED",
    0,
    14
  );

  ctx.restore();
}

/*
  Draw either wedding-item symbols or pearls.
*/

function drawCollectibles() {
  for (
    const [location, item]
    of state.collectibles
  ) {
    const [x, y] =
      location.split(",").map(Number);

    const centreX =
      x * TILE + TILE / 2;

    const centreY =
      y * TILE + TILE / 2;

    if (item.pearl) {
      const gradient =
        ctx.createRadialGradient(
          centreX - 3,
          centreY - 4,
          2,
          centreX,
          centreY,
          10
        );

      gradient.addColorStop(
        0,
        "#ffffff"
      );

      gradient.addColorStop(
        1,
        currentRound().palette.pearl
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(
        centreX,
        centreY,
        7,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.strokeStyle =
        "rgba(30, 50, 60, 0.35)";

      ctx.stroke();

      continue;
    }

    /*
      Pale circle helps the emoji remain visible
      over the maze background.
    */

    ctx.fillStyle =
      "rgba(255, 255, 255, 0.88)";

    ctx.beginPath();

    ctx.arc(
      centreX,
      centreY,
      15,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
      "rgba(0, 0, 0, 0.35)";

    ctx.lineWidth = 1.5;
    ctx.stroke();

    /*
  Draw special wedding objects ourselves so their
  appearance does not depend on Windows emoji.
*/

if (item.kind === "white-wedding-dress") {
  drawWhiteWeddingDress(
    centreX,
    centreY
  );

  continue;
}

if (item.kind === "plain-gold-band") {
  drawPlainGoldBand(
    centreX,
    centreY
  );

  continue;
}

function drawWhiteWeddingDress(
  centreX,
  centreY
) {
  ctx.save();

  ctx.translate(
    centreX,
    centreY
  );

  ctx.strokeStyle = "#8d99a6";
  ctx.lineWidth = 1.2;
  ctx.lineJoin = "round";

  /*
    Bridal veil behind the dress.
  */

  ctx.fillStyle =
    "rgba(255, 255, 255, 0.72)";

  ctx.beginPath();

  ctx.moveTo(0, -13);
  ctx.quadraticCurveTo(-15, -7, -12, 9);
  ctx.quadraticCurveTo(-7, 5, -5, 1);
  ctx.lineTo(5, 1);
  ctx.quadraticCurveTo(9, 7, 14, 10);
  ctx.quadraticCurveTo(15, -6, 0, -13);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /*
    Small bridal headpiece.
  */

  ctx.fillStyle = "#ffffff";

  ctx.beginPath();

  ctx.arc(
    0,
    -12,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();
  ctx.stroke();

  /*
    Puff sleeves.
  */

  ctx.beginPath();

  ctx.arc(
    -7,
    -5,
    4,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    -5,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();
  ctx.stroke();

  /*
    Fitted bodice with sweetheart neckline.
  */

  ctx.beginPath();

  ctx.moveTo(-6, -7);

  ctx.quadraticCurveTo(
    -3,
    -10,
    0,
    -6
  );

  ctx.quadraticCurveTo(
    3,
    -10,
    6,
    -7
  );

  ctx.lineTo(5, 2);
  ctx.lineTo(-5, 2);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /*
    Full wedding skirt and small train.
  */

  ctx.beginPath();

  ctx.moveTo(-5, 1);
  ctx.lineTo(-12, 12);

  ctx.quadraticCurveTo(
    -15,
    16,
    -6,
    15
  );

  ctx.quadraticCurveTo(
    0,
    18,
    8,
    15
  );

  ctx.quadraticCurveTo(
    15,
    17,
    13,
    12
  );

  ctx.lineTo(5, 1);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  /*
    Pearl belt.
  */

  ctx.strokeStyle = "#d4b23c";
  ctx.lineWidth = 1.5;

  ctx.beginPath();

  ctx.moveTo(-5, 2);
  ctx.lineTo(5, 2);

  ctx.stroke();

  /*
    Subtle folds help the white skirt read
    clearly against the white item circle.
  */

  ctx.strokeStyle =
    "rgba(120, 135, 150, 0.55)";

  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(-2, 4);
  ctx.lineTo(-5, 13);

  ctx.moveTo(2, 4);
  ctx.lineTo(6, 14);

  ctx.stroke();

  ctx.restore();
}

function drawPlainGoldBand(
  centreX,
  centreY
) {
  ctx.save();

  ctx.translate(
    centreX,
    centreY
  );

  /*
    Plain circular gold wedding band,
    without a gemstone.
  */

  ctx.strokeStyle = "#d49b00";
  ctx.lineWidth = 6;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    8,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  /*
    Lighter edge gives the band a gold shine.
  */

  ctx.strokeStyle = "#ffe17a";
  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.arc(
    -1,
    -1,
    8,
    Math.PI,
    Math.PI * 1.75
  );

  ctx.stroke();

  ctx.restore();
}

/*
  Other items can continue to use emoji.
*/

ctx.font =
  '22px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';

ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillStyle = "#111111";

ctx.fillText(
  item.symbol,
  centreX,
  centreY + 1
);
  }
}

function drawCouple() {
  const centreX =
    state.player.x * TILE + TILE / 2;

  const centreY =
    state.player.y * TILE + TILE / 2;

  const movementBob =
    state.running
      ? Math.sin(
          performance.now() / 85
        ) * 1.5
      : 0;

  if (
    coupleImage.complete &&
    coupleImage.naturalWidth
  ) {
    ctx.save();

    if (state.direction === "left") {
      ctx.translate(centreX, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(
        coupleImage,
        -27,
        centreY - 25 + movementBob,
        54,
        54
      );
    } else {
      ctx.drawImage(
        coupleImage,
        centreX - 27,
        centreY - 25 + movementBob,
        54,
        54
      );
    }

    ctx.restore();
    return;
  }

  drawPlaceholderCouple(
    centreX,
    centreY + movementBob
  );
}

function drawPlaceholderCouple(
  centreX,
  centreY
) {
  ctx.save();

  ctx.translate(
    centreX,
    centreY
  );

  drawPerson(
    -7,
    0,
    "#5b3528",
    "#f6d2b3"
  );

  drawPerson(
    7,
    0,
    "#c98555",
    "#f4c9a4"
  );

  ctx.restore();
}

function drawPerson(
  x,
  y,
  hair,
  skin
) {
  ctx.fillStyle = hair;

  ctx.beginPath();

  ctx.arc(
    x,
    y - 4,
    10,
    Math.PI,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = skin;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    8,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "#17313b";

  ctx.beginPath();

  ctx.arc(
    x - 2.5,
    y - 1,
    1,
    0,
    Math.PI * 2
  );

  ctx.arc(
    x + 2.5,
    y - 1,
    1,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

function collectItemAtPlayerPosition() {
  const playerPosition =
    positionKey(
      state.player.x,
      state.player.y
    );

  const item =
    state.collectibles.get(
      playerPosition
    );

  if (!item) {
    return;
  }

  state.collectibles.delete(
    playerPosition
  );

  state.score +=
    item.points || 10;

  playCollectionTing();
    
if (currentRound().id === 1) {
  /*
    Queue every collected item so none of the
    messages can overwrite another.
  */

  queueCollectionMessage(
    `Collected: ${item.name}!`,
    "collected",
    1500
  );

  /*
    Queue the wedding instruction behind the final
    collected-item message.
  */

  if (
    state.collectibles.size === 0 &&
    currentRound().goal
  ) {
    queueCollectionMessage(
      "Everything is ready! Now get Louise and Steve to the wedding arch!",
      "ready",
      2500
    );
  }
}
}

function tryMove() {
  const requested =
    DIRECTIONS[
      state.requestedDirection
    ];

  const requestedX =
    state.player.x + requested.x;

  const requestedY =
    state.player.y + requested.y;

  if (
    isWalkable(
      requestedX,
      requestedY
    )
  ) {
    state.direction =
      state.requestedDirection;
  }

  const direction =
    DIRECTIONS[state.direction];

  const nextX =
    state.player.x + direction.x;

  const nextY =
    state.player.y + direction.y;

  if (isWalkable(nextX, nextY)) {
    state.player = {
      x: nextX,
      y: nextY
    };
  }

  collectItemAtPlayerPosition();

  const goal =
    currentRound().goal;

  const reachedGoal =
    goal &&
    state.player.x === goal.x &&
    state.player.y === goal.y;

  if (
    goal &&
    state.collectibles.size === 0 &&
    reachedGoal
  ) {
    state.score += 100;
    finishRound(true);
    }
     else if (
    !goal &&
    !isPackingRound() &&
    !isWordSearchRound() &&
    !isPairsRound() &&
    !isCelebrationPopRound() &&
    !isPhotoPuzzleRound() &&
    state.collectibles.size === 0
  ) {
    finishRound(true);
  }

  updateHud();
  draw();
}

function gameLoop(timestamp) {
  if (state.running) {
    if (!state.lastTick) {
      state.lastTick = timestamp;
    }

    const elapsed =
      Math.min(
        timestamp - state.lastTick,
        100
      );

    state.lastTick = timestamp;
    state.timeLeft -= elapsed / 1000;
    state.moveAccumulator += elapsed;

                    if (
      !isPackingRound() &&
      !isWordSearchRound() &&
      !isPairsRound() &&
      !isCelebrationPopRound() &&
      !isPhotoPuzzleRound() &&
      state.moveAccumulator >= 145
    ) {
      tryMove();
      state.moveAccumulator = 0;
    }

    if (
    state.running &&
    state.timeLeft <= 0
) {

    state.timeLeft = 0;

    sessionStorage.setItem(
        "pearlWeddingMazeTimedOut",
        "true"
    );

    finishRound(false);
}
    updateHud();
  }

  requestAnimationFrame(gameLoop);
}

function showWeddingMemory() {
  const memoryImage =
    ui.weddingMemory.querySelector("img");

  const memoryCaption =
    ui.weddingMemory.querySelector(
      "figcaption"
    );

  memoryImage.src =
    "assets/wedding-photo.jpg";

  memoryImage.alt =
    "Louise and Steve on their wedding day in Antigua";

  memoryCaption.textContent =
    "Antigua — 9th October 1996";

  ui.eyebrow.textContent =
    "They made it!";

  ui.title.textContent =
    "Antigua — The Wedding complete!";

  ui.text.textContent =
    "Louise and Steve collected everything and made it to their Antigua wedding — right on time!";

  ui.overlayCouple.classList.add(
    "hidden"
  );

  ui.weddingMemory.classList.remove(
    "hidden"
  );

  ui.overlayButton.textContent =
  "Continue the Anniversary Challenge";

ui.overlayButton.dataset.action =
  "afterWeddingMemory";

  ui.overlay.classList.add(
    "visible"
  );

  playRecordedCalypso();
}

function startRound() {
    if (state.over) {
    resetRound();
  }

  ui.overlay.classList.remove(
    "visible"
  );

  ui.start.style.display = "none";

  state.running = true;
  state.lastTick = 0;

    if (isCelebrationPopRound()) {
    playCelebrationPopMusic();
    startCelebrationSpawning();
  }
}

function finishRound(won) {
  if (!state.running) {
    return;
  }
    stopCelebrationSpawning();
    stopCelebrationPopMusic();

  ui.overlayCouple.classList.add(
  "hidden"
);

  state.running = false;
  state.over = true;

  const displayedScore =
  state.totalScore + state.score;

/*
  Completing Antigua goes directly to the
  wedding photograph and music.
*/

if (
  won &&
  currentRound().id === 1
) {
  showWeddingMemory();
  return;
}

if (
  won &&
  isPhotoPuzzleRound()
) {
  const round =
    currentRound();

  const memoryImage =
    ui.weddingMemory.querySelector(
      "img"
    );

  const memoryCaption =
    ui.weddingMemory.querySelector(
      "figcaption"
    );

  memoryImage.src =
    round.photo;

  memoryImage.alt =
    "Louise and Steve celebrating their pearl anniversary in Jamaica";

  memoryCaption.textContent =
    round.photoCaption;

  ui.eyebrow.textContent =
    "30 years together!";

  ui.title.textContent =
    "Congratulations Louise and Steve!";

  ui.text.textContent =
    "Thirty years, thirty adventures, and many more still to come.";

  ui.overlayCouple.classList.add(
    "hidden"
  );

  ui.weddingMemory.classList.remove(
    "hidden"
  );

  ui.overlayButton.textContent =
    "Play from the beginning";

  ui.overlayButton.dataset.action =
    "again";

  ui.overlay.classList.add(
    "visible"
  );

  playJamaicaCelebrationMusic();

  return;
}

if (!won) {
    ui.eyebrow.textContent =
      `Round ${currentRound().id} of 30`;

    ui.title.textContent =
      "Time’s up!";

            if (isCelebrationPopRound()) {
      ui.text.textContent =
        `Louise and Steve scored ${state.celebrationPoints} of the ` +
        `${currentRound().targetScore} points needed. ` +
        "Try again and keep the celebration going!";
    } else if (isPairsRound()) {
      ui.text.textContent =
        `Louise and Steve scored ${displayedScore} points. ` +
        "Try again and match all eight photograph pairs.";
    } else if (isWordSearchRound()) {
      ui.text.textContent =
        `Louise and Steve scored ${displayedScore} points. ` +
        "Try again and find all ten names.";
    } else if (isPackingRound()) {
      ui.text.textContent =
        `Louise and Steve scored ${displayedScore} points. ` +
        "Try again and pack before the airport transfer arrives.";
    } else if (isPhotoPuzzleRound()) {
      ui.text.textContent =
        "Try again and complete the Jamaica photograph.";
    } else {
      ui.text.textContent =
        `Louise and Steve scored ${displayedScore} points. ` +
        "Try again and get them to the wedding on time.";
    }
if (currentRound().id === 1) {

  ui.overlayButton.textContent =
    "Try Again";

  let giveUpButton =
    document.getElementById(
      "weddingMazeGiveUp"
    );

  if (!giveUpButton) {

    giveUpButton =
      document.createElement("button");

    giveUpButton.id =
      "weddingMazeGiveUp";

    giveUpButton.textContent =
      "Give Up 🥥";

    giveUpButton.className =
      "secondary";

    giveUpButton.addEventListener(
      "click",
      () => {

        sessionStorage.setItem(
          "pearlWeddingMazeResult",
          "coconut"
        );

        window.location.href =
          "../../quiz.html";
      }
    );

    ui.overlayButton.insertAdjacentElement(
      "afterend",
      giveUpButton
    );
  }

  giveUpButton.style.display =
    "inline-block";
}
    ui.overlayButton.dataset.action =
      "retry";
  } else if (
    state.roundIndex <
    playableRounds.length - 1
  ) {
    ui.eyebrow.textContent =
      "They made it!";

    ui.title.textContent =
      `${currentRound().title} complete!`;

    ui.text.textContent =
      currentRound().complete;

        ui.overlayButton.textContent =
      `Continue to Round ${
        playableRounds[
          state.roundIndex + 1
        ].id
      }`;

    ui.overlayButton.dataset.action =
      "next";
  } else {
    ui.eyebrow.textContent =
      "Prototype complete";

    ui.title.textContent =
      "The journey has begun";

    ui.text.textContent =
      `Score: ${displayedScore}. ` +
      "The remaining memories can now be added one by one.";

    ui.overlayButton.textContent =
      "Play from the beginning";

    ui.overlayButton.dataset.action =
      "again";
  }

  ui.overlay.classList.add("visible");
}

function setDirection(direction) {
  if (DIRECTIONS[direction]) {
    state.requestedDirection =
      direction;
  }
}

/* Keyboard controls */

document.addEventListener(
  "keydown",
  event => {
    const keyboardDirections = {
      ArrowUp: "up",
      w: "up",
      W: "up",

      ArrowDown: "down",
      s: "down",
      S: "down",

      ArrowLeft: "left",
      a: "left",
      A: "left",

      ArrowRight: "right",
      d: "right",
      D: "right"
    };

    const direction =
      keyboardDirections[event.key];

    if (direction) {
      event.preventDefault();
      setDirection(direction);
    }
  }
);

/* On-screen controls */

document
  .querySelectorAll("[data-dir]")
  .forEach(button => {
    button.addEventListener(
      "pointerdown",
      () => {
        setDirection(
          button.dataset.dir
        );
      }
    );
  });

/* Swipe controls */

canvas.addEventListener(
  "pointerdown",
  event => {
    event.preventDefault();

    touchStart = {
      x: event.clientX,
      y: event.clientY
    };
  }
);

canvas.addEventListener(
  "pointerup",
  event => {
    event.preventDefault();

    if (!touchStart) {
      return;
    }

    const differenceX =
      event.clientX - touchStart.x;

    const differenceY =
      event.clientY - touchStart.y;

    const largestDistance =
      Math.max(
        Math.abs(differenceX),
        Math.abs(differenceY)
      );

    if (largestDistance > 18) {
      if (
        Math.abs(differenceX) >
        Math.abs(differenceY)
      ) {
        setDirection(
          differenceX > 0
            ? "right"
            : "left"
        );
      } else {
        setDirection(
          differenceY > 0
            ? "down"
            : "up"
        );
      }
    }

    touchStart = null;
  }
);

ui.suitcase.addEventListener("dragover", event => {
  event.preventDefault();
  ui.suitcase.classList.add("drag-over");
});

ui.suitcase.addEventListener("dragleave", () => {
  ui.suitcase.classList.remove("drag-over");
});

ui.suitcase.addEventListener("drop", event => {
  event.preventDefault();
  ui.suitcase.classList.remove("drag-over");

  const index = Number(event.dataTransfer.getData("text/plain"));
  const element = ui.packingItems.querySelector(`[data-index="${index}"]`);
  if (element) packItem(index, element);
});

/* Word-search mouse and touchscreen controls */

ui.wordSearchGrid.addEventListener(
  "pointerdown",
  event => {
    if (
      !state.running ||
      !isWordSearchRound()
    ) {
      return;
    }

    const square =
      event.target.closest(
        ".word-search-letter"
      );

    if (!square) {
      return;
    }

    event.preventDefault();

    state.wordSearchSelecting = true;

    state.wordSearchStart = {
      row: Number(square.dataset.row),
      column: Number(
        square.dataset.column
      )
    };

    updateWordSearchSelection(
      state.wordSearchStart.row,
      state.wordSearchStart.column
    );
  }
);

document.addEventListener(
  "pointermove",
  event => {
    if (
      !state.wordSearchSelecting ||
      !isWordSearchRound()
    ) {
      return;
    }

    const element =
      document.elementFromPoint(
        event.clientX,
        event.clientY
      );

    const square =
      element
        ? element.closest(
            ".word-search-letter"
          )
        : null;

    if (!square) {
      return;
    }

    updateWordSearchSelection(
      Number(square.dataset.row),
      Number(square.dataset.column)
    );
  }
);

document.addEventListener(
  "pointerup",
  () => {
    if (
      state.wordSearchSelecting &&
      isWordSearchRound()
    ) {
      finishWordSearchSelection();
    }
  }
);

/* Game buttons */

ui.start.addEventListener(
  "click",
  startRound
);



/*
  Allow the music to be replayed from the
  wedding photograph screen.
*/



ui.overlayButton.addEventListener(
  "click",
  () => {
    const action =
      ui.overlayButton.dataset.action;

    /*
      After completing Antigua, show the wedding
      memory before moving to Round 2.
    */

    if (
      action === "next" &&
      currentRound().id === 1
    ) {
      showWeddingMemory();
      return;
    }

    /*
      The button on the wedding photograph
      advances to Round 2.
    */

    if (
  action === "afterWeddingMemory"
) {
  stopRecordedCalypso();

  const weddingMazeTimedOut =
  sessionStorage.getItem(
    "pearlWeddingMazeTimedOut"
  ) === "true";

sessionStorage.setItem(
  "pearlWeddingMazeResult",
  weddingMazeTimedOut
    ? "coconut"
    : "cocktail"
);

  window.location.href =
    "../../quiz.html";

  return;
}
    if (action === "next") {
      state.totalScore += state.score;
      state.roundIndex += 1;

      resetRound();
      showIntroduction();
      return;
    }

    if (action === "again") {
      stopRecordedCalypso();

      state.roundIndex = 0;
      state.totalScore = 0;

      resetRound();
      showIntroduction();
      return;
    }
const weddingMazeGiveUp =
  document.getElementById("weddingMazeGiveUp");

if (weddingMazeGiveUp) {
  weddingMazeGiveUp.style.display = "none";
}
    resetRound();
    startRound();
  }
);

/* Start the game */

resetRound();
showIntroduction();
requestAnimationFrame(gameLoop);
