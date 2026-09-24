const puzzleGrid =
    document.getElementById("puzzleGrid");

const puzzleMessage =
    document.getElementById("puzzleMessage");

const giveUpButton =
    document.getElementById("giveUp");

const resultPanel =
    document.getElementById("resultPanel");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const continueButton =
    document.getElementById("continueButton");


const TOTAL_PIECES = 12;
const COLUMNS = 4;
const ROWS = 3;

let currentPieces = [];
let selectedPosition = null;
let puzzleComplete = false;
let failedAttempt = false;


/* ==========================================
   Create the 12 jigsaw pieces
   ========================================== */

function createPieces() {

    return Array.from(
        { length: TOTAL_PIECES },
        (_, index) => ({
            correctIndex: index
        })
    );
}


/* ==========================================
   Shuffle
   ========================================== */

function shufflePieces(pieces) {

    const shuffled = [...pieces];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


function isPuzzleCorrect() {

    return currentPieces.every(
        (piece, position) =>
            piece.correctIndex === position
    );
}


/* ==========================================
   Display puzzle
   ========================================== */

function displayPuzzle() {

    puzzleGrid.innerHTML = "";

    currentPieces.forEach(
        (piece, position) => {

            const pieceButton =
                document.createElement("button");

            pieceButton.type = "button";
            pieceButton.className =
                "puzzle-piece";

            const originalRow =
                Math.floor(
                    piece.correctIndex / COLUMNS
                );

            const originalColumn =
                piece.correctIndex % COLUMNS;

            const xPosition =
                COLUMNS === 1
                    ? 0
                    : (
                        originalColumn /
                        (COLUMNS - 1)
                    ) * 100;

            const yPosition =
                ROWS === 1
                    ? 0
                    : (
                        originalRow /
                        (ROWS - 1)
                    ) * 100;

            pieceButton.style.backgroundPosition =
                `${xPosition}% ${yPosition}%`;

            pieceButton.setAttribute(
                "aria-label",
                `Jigsaw piece ${position + 1}`
            );

            if (
                selectedPosition === position
            ) {
                pieceButton.classList.add(
                    "selected"
                );
            }

            if (puzzleComplete) {
                pieceButton.disabled = true;
            }

            pieceButton.addEventListener(
                "click",
                () => {
                    selectPiece(position);
                }
            );

            puzzleGrid.appendChild(
                pieceButton
            );
        }
    );
}


/* ==========================================
   Select and swap two pieces
   ========================================== */

function selectPiece(position) {

    if (puzzleComplete) {
        return;
    }

    if (selectedPosition === null) {

        selectedPosition = position;

        puzzleMessage.textContent =
            "Now select the piece you want to swap it with.";

        displayPuzzle();
        return;
    }

    if (selectedPosition === position) {

        selectedPosition = null;

        puzzleMessage.textContent =
            "Selection cancelled. Choose two pieces to swap.";

        displayPuzzle();
        return;
    }

    [
        currentPieces[selectedPosition],
        currentPieces[position]
    ] = [
        currentPieces[position],
        currentPieces[selectedPosition]
    ];

    selectedPosition = null;

    displayPuzzle();

if (isPuzzleCorrect()) {

    finishPuzzle();

} else {

    puzzleMessage.textContent =
        "Pieces swapped. Keep going!";
}
}


/* ==========================================
   Check puzzle
   ========================================== */



/* ==========================================
   Successful completion
   ========================================== */

function finishPuzzle() {

    puzzleComplete = true;
    selectedPosition = null;
    puzzleGrid.classList.add("completed");

    currentPieces =
        createPieces();

    const hadFailedAttempt =
        failedAttempt ||
        sessionStorage.getItem(
            "pearlJamaicaJigsawFailedAttempt"
        ) === "true";

    if (hadFailedAttempt) {

        sessionStorage.setItem(
            "pearlJamaicaJigsawResult",
            "coconut"
        );

        resultTitle.textContent =
            "🥥 Coconut collected!";

        resultText.textContent =
            "You completed the Jamaica jigsaw after another attempt.";

    } else {

        sessionStorage.setItem(
            "pearlJamaicaJigsawResult",
            "cocktail"
        );

        resultTitle.textContent =
            "🍹 Cocktail earned!";

        resultText.textContent =
            "Perfect! You completed the Jamaica jigsaw";

    }

    puzzleMessage.textContent =
        "Perfect! The anniversary photograph is complete.";

    
    giveUpButton.classList.add(
        "hidden"
    );

    displayPuzzle();

    resultPanel.classList.remove(
        "hidden"
    );
    resultPanel.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}


/* ==========================================
   Give up
   ========================================== */

function giveUpPuzzle() {

    if (puzzleComplete) {
        return;
    }

    puzzleComplete = true;
    selectedPosition = null;
    puzzleGrid.classList.add("completed");

    currentPieces =
        createPieces();

    sessionStorage.setItem(
        "pearlJamaicaJigsawResult",
        "coconut"
    );

    sessionStorage.setItem(
        "pearlJamaicaJigsawFailedAttempt",
        "true"
    );

    puzzleMessage.textContent =
        "Here is the completed anniversary photograph.";

    document.querySelector(".hint")
        .textContent =
        "The Jamaica anniversary photograph has now been revealed.";

    resultTitle.textContent =
        "🥥 Coconut collected!";

    resultText.textContent =
        "The completed Jamaica jigsaw has been revealed.";

    
    giveUpButton.classList.add(
        "hidden"
    );

    displayPuzzle();

    resultPanel.classList.remove(
        "hidden"
    );
    resultPanel.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}


/* ==========================================
   Continue back to main challenge
   ========================================== */

continueButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "../../quiz.html";
    }
);


giveUpButton.addEventListener(
    "click",
    giveUpPuzzle
);


/* ==========================================
   Start
   ========================================== */

function startPuzzle() {

    sessionStorage.removeItem(
        "pearlJamaicaJigsawResult"
    );

    sessionStorage.removeItem(
        "pearlJamaicaJigsawFailedAttempt"
    );

    currentPieces =
        shufflePieces(
            createPieces()
        );

    // Make sure the puzzle never starts
    // already completed by chance.
    while (isPuzzleCorrect()) {

        currentPieces =
            shufflePieces(
                createPieces()
            );
    }

    displayPuzzle();

    puzzleMessage.textContent =
        "Select two pieces to swap them.";
}


startPuzzle();