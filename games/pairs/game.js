const pairsGrid =
    document.getElementById("pairsGrid");

const pairsMessage =
    document.getElementById("pairsMessage");

const pairsRemainingDisplay =
    document.getElementById("pairsRemaining");

const timerDisplay =
    document.getElementById("timer");

const giveUpButton =
    document.getElementById("giveUpButton");

const resultPanel =
    document.getElementById("resultPanel");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const continueButton =
    document.getElementById("continueButton");

const keepPlayingButton =
    document.getElementById("keepPlayingButton");

const pairImages = [
    "assets/memory-1.jpg",
    "assets/memory-2.jpg",
    "assets/memory-3.jpg",
    "assets/memory-4.jpg",
    "assets/memory-5.jpg",
    "assets/memory-6.jpg",
    "assets/memory-7.jpg",
    "assets/memory-8.jpg"
];

const itemTing =
    new Audio("assets/item-ting.mp3");

const wrongBuzzer =
    new Audio("assets/wrong-buzzer.mp3");


function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(
        () => {
            // Ignore browser autoplay errors.
        }
    );
}

let cards = [];
let selectedCards = [];
let matchedCards = new Set();

let pairsRemaining = 8;
let locked = false;

let timeLeft = 60;
let timer = null;

let failedAttempt = false;
let finished = false;


function shuffleCards() {

    cards = [];

    pairImages.forEach(
        (image, pairNumber) => {

            cards.push(
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
        let index = cards.length - 1;
        index > 0;
        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            cards[index],
            cards[randomIndex]
        ] = [
            cards[randomIndex],
            cards[index]
        ];
    }
}


function displayCards() {

    pairsGrid.innerHTML = "";

    cards.forEach(
        (card, position) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "pairs-card-button";

            button.setAttribute(
                "aria-label",
                `Memory card ${position + 1}`
            );

            button.style.setProperty(
                "--pair-image",
                `url("${card.image}")`
            );

            if (
                selectedCards.includes(position) ||
                matchedCards.has(position)
            ) {
                button.classList.add(
                    "flipped"
                );
            }

            if (
                matchedCards.has(position)
            ) {
                button.classList.add(
                    "matched"
                );
            }

            button.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    selectCard(position);
                }
            );

            pairsGrid.appendChild(button);
        }
    );
}


function selectCard(position) {

    if (
        finished ||
        locked ||
        matchedCards.has(position) ||
        selectedCards.includes(position)
    ) {
        return;
    }

    selectedCards.push(position);

    displayCards();

    if (selectedCards.length < 2) {
        return;
    }

    locked = true;

    const firstPosition =
        selectedCards[0];

    const secondPosition =
        selectedCards[1];

    const firstCard =
        cards[firstPosition];

    const secondCard =
        cards[secondPosition];

    const isMatch =
        firstCard.pairNumber ===
        secondCard.pairNumber;

    setTimeout(
        () => {

            if (isMatch) {

                matchedCards.add(
                    firstPosition
                );

                matchedCards.add(
                    secondPosition
                );

                pairsRemaining--;

                pairsRemainingDisplay.textContent =
                    pairsRemaining;

                pairsMessage.textContent =
                    "📸 Matching pair found!";
                    playSound(itemTing);

            } else {

                pairsMessage.textContent =
                    "Not a match — try another pair.";
                    

            }

            selectedCards = [];
            locked = false;

            displayCards();

            if (pairsRemaining === 0) {
                finishGame();
            }

        },
        750
    );
}


function startTimer() {

    timer = setInterval(
        () => {

            if (finished) {
                return;
            }

            timeLeft--;

            timerDisplay.textContent =
                timeLeft;

            if (timeLeft <= 0) {

    clearInterval(timer);

    timer = null;

    failedAttempt = true;

    timeLeft = 0;

    timerDisplay.textContent = "0";

    sessionStorage.setItem(
        "pearlPairsResult",
        "coconut"
    );

    resultTitle.textContent =
        "🥥 Coconut collected!";

    resultText.textContent =
        "Time's up — but you can keep playing and finish the pairs if you want.";

    giveUpButton.classList.remove(
    "hidden"
);

keepPlayingButton.classList.remove(
    "hidden"
);

continueButton.classList.add(
    "hidden"
);

resultPanel.classList.remove(
    "hidden"
);

    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

        },
        1000
    );
}


function finishGame() {

    if (finished) {
        return;
    }

    finished = true;

    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    giveUpButton.classList.add("hidden");

    keepPlayingButton.classList.add(
        "hidden"
    );

    continueButton.classList.remove(
        "hidden"
    );

    let result;

    if (
        pairsRemaining === 0 &&
        !failedAttempt
    ) {

        result = "cocktail";

        resultTitle.textContent =
            "🍹 Cocktail earned!";

        resultText.textContent =
            "You matched all eight pairs before the timer ran out. Cheers!";

    } else {

        result = "coconut";

        resultTitle.textContent =
            "🥥 Coconut collected!";

        if (pairsRemaining === 0) {

    resultText.textContent =
        "You found all eight pairs! A coconut was collected because the timer ran out.";

} else {

    resultText.textContent =
        timeLeft <= 0
            ? "Time ran out before all eight pairs were matched."
            : "You chose to give up before all eight pairs were matched.";
}    }

    sessionStorage.setItem(
        "pearlPairsResult",
        result
    );

    resultPanel.classList.remove(
        "hidden"
    );

    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


giveUpButton.addEventListener(
    "click",
    () => {

        if (finished) {
            return;
        }

        failedAttempt = true;

        finishGame();
    }
);

keepPlayingButton.addEventListener(
    "click",
    () => {

        resultPanel.classList.add(
            "hidden"
        );

        keepPlayingButton.classList.add(
            "hidden"
        );

        continueButton.classList.remove(
            "hidden"
        );

        giveUpButton.classList.remove(
            "hidden"
        );
    }
);

continueButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "../../quiz.html";
    }
);


function startGame() {

    sessionStorage.removeItem(
        "pearlPairsResult"
    );

    sessionStorage.removeItem(
        "pearlPairsFailedAttempt"
    );

    selectedCards = [];
    matchedCards.clear();

    pairsRemaining = 8;
    locked = false;

    timeLeft = 60;
    failedAttempt = false;
    finished = false;

    pairsRemainingDisplay.textContent =
        pairsRemaining;

    timerDisplay.textContent =
        timeLeft;

    pairsMessage.textContent =
        "Select two cards to find a matching pair.";

    resultPanel.classList.add(
        "hidden"
    );

    giveUpButton.classList.remove(
        "hidden"
    );

    shuffleCards();
    displayCards();
    startTimer();
}


startGame();