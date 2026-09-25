const timelineCards =
    document.getElementById("timelineCards");

const timelineMessage =
    document.getElementById("timelineMessage");

if (window.innerWidth <= 700) {
    timelineMessage.textContent = "";
}    

const checkTimelineButton =
    document.getElementById("checkTimeline");

const giveUpButton =
    document.getElementById("giveUp");

const mobileTimelineActions =
    document.getElementById("mobileTimelineActions");

const actions =
    document.querySelector(".actions");    

const resultPanel =
    document.getElementById("resultPanel");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const continueButton =
    document.getElementById("continueButton");

function positionTimelineActions() {

    if (window.innerWidth <= 700) {

        mobileTimelineActions.appendChild(actions);

    } else {

        timelineMessage.insertAdjacentElement(
            "afterend",
            actions
        );
    }
}

positionTimelineActions();

window.addEventListener(
    "resize",
    positionTimelineActions
);    


/*
    The five memories from the newer game.

    Their position in this array is their
    correct chronological position.
*/

const timelineEvents = [
    {
        image: "assets/timeline-1.jpg",
        title: "Elise",
        date: "2003"
    },
    {
        image: "assets/timeline-2.jpg",
        title: "Kai",
        date: "2009"
    },
    {
        image: "assets/timeline-3.jpg",
        title: "Shadow",
        date: "2019"
    },
    {
        image: "assets/timeline-4.jpg",
        title: "Family Holiday",
        date: "2020"
    },
    {
        image: "assets/timeline-5.jpg",
        title: "Wedding Guests",
        date: "2021"
    }
].map((event, index) => ({
    ...event,
    correctIndex: index
}));


let currentEvents = [];
let selectedPosition = null;
let timelineComplete = false;

let mobileChoices = {};

/*
    Once the player gets an incorrect check,
    the coconut is locked in even if they
    subsequently solve the timeline.
*/

let failedAttempt = false;


/*
    Shuffle the five cards.

    We also make sure they don't accidentally
    start in the completely correct order.
*/

function shuffleTimeline() {

    currentEvents =
        timelineEvents.map(event => ({ ...event }));

    for (
        let i = currentEvents.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            currentEvents[i],
            currentEvents[j]
        ] = [
            currentEvents[j],
            currentEvents[i]
        ];
    }


    while (
    currentEvents.some(
        (event, position) =>
            event.correctIndex === position
    )
) {

    for (
        let i = currentEvents.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            currentEvents[i],
            currentEvents[j]
        ] = [
            currentEvents[j],
            currentEvents[i]
        ];
    }
}
}


/*
    Draw the five memory cards.
*/

function displayTimelineCards(revealDates = false) {

    timelineCards.innerHTML = "";


    currentEvents.forEach((event, position) => {

        const card =
            document.createElement("button");

        card.type = "button";
        card.className = "timeline-card";


        if (selectedPosition === position) {
            card.classList.add("selected");
        }


        if (
            timelineComplete &&
            event.correctIndex === position
        ) {
            card.classList.add("correct");
        }


        const image =
            document.createElement("img");

        image.src = event.image;
        image.alt = event.title;


        const title =
            document.createElement("span");

        title.className =
            "timeline-card-title";

        title.textContent =
            event.title;


        const date =
            document.createElement("span");

        date.className =
            "timeline-card-date";


        if (revealDates) {

            date.classList.add("revealed");

            date.textContent =
                event.date;
        }


        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);

        const numberChoices =
    document.createElement("div");

numberChoices.className =
    "timeline-number-choices";

for (let number = 1; number <= 5; number++) {

    const numberButton =
        document.createElement("button");

    numberButton.type = "button";
    numberButton.className =
        "timeline-number-button";

    numberButton.textContent = number;

    if (
    mobileChoices[event.correctIndex] === number
    ) {
        numberButton.classList.add("selected");
}

    numberButton.addEventListener(
    "click",
    (clickEvent) => {
        clickEvent.stopPropagation();

        Object.keys(mobileChoices).forEach(
            key => {
                if (mobileChoices[key] === number) {
                    delete mobileChoices[key];
                }
    }
);

        mobileChoices[event.correctIndex] =
            number;

        displayTimelineCards();
    }
);

    numberChoices.appendChild(
        numberButton
    );
    
}

card.appendChild(numberChoices);

        card.addEventListener(
            "click",
            () => selectTimelineCard(position)
        );


        timelineCards.appendChild(card);
    });
    if (
    window.innerWidth <= 700 &&
    mobileTimelineActions
) {
    timelineCards.appendChild(
        mobileTimelineActions
    );

    mobileTimelineActions.appendChild(
        actions
    );
}
}


/*
    Select two cards.

    The second selection swaps the two memories.
*/

function selectTimelineCard(position) {

    if (timelineComplete) {
        return;
    }


    if (selectedPosition === null) {

        selectedPosition = position;

        timelineMessage.textContent =
            "Now select another memory to swap with it.";

        displayTimelineCards();

        return;
    }


    if (selectedPosition === position) {

        selectedPosition = null;

        timelineMessage.textContent =
            "Selection cancelled. Choose two memories to swap.";

        displayTimelineCards();

        return;
    }


    [
        currentEvents[selectedPosition],
        currentEvents[position]
    ] = [
        currentEvents[position],
        currentEvents[selectedPosition]
    ];


    selectedPosition = null;


    timelineMessage.textContent =
        "Cards swapped. Check the timeline when you are ready.";


    displayTimelineCards();
}


/*
    Check the current order.
*/

function checkTimelineOrder() {

    if (timelineComplete) {
        return;
    }

    if (window.innerWidth <= 700) {

    const chosenNumbers =
        Object.keys(mobileChoices);

    if (chosenNumbers.length < 5) {
        timelineMessage.textContent =
            "Choose a number from 1 to 5 for every memory first.";
        return;
    }

    const allCorrect =
        currentEvents.every(event =>
            mobileChoices[event.correctIndex] ===
            event.correctIndex + 1
        );

    if (allCorrect) {
        finishTimeline();
        return;
    }

    failedAttempt = true;

    sessionStorage.setItem(
        "pearlTimelineFailedAttempt",
        "true"
    );

    timelineMessage.textContent =
        "Not quite — some memories have the wrong number. Try again!";

    return;
}

    const correctPositions = [];


    currentEvents.forEach(
        (event, position) => {

            if (
                event.correctIndex === position
            ) {
                correctPositions.push(position);
            }
        }
    );


    if (
        correctPositions.length ===
        currentEvents.length
    ) {

        finishTimeline();

        return;
    }


    failedAttempt = true;


    sessionStorage.setItem(
        "pearlTimelineFailedAttempt",
        "true"
    );


    timelineMessage.textContent =
        `${correctPositions.length} of ${currentEvents.length} memories are in the correct position. Try again!`;


    const cards =
        timelineCards.querySelectorAll(
            ".timeline-card"
        );


    cards.forEach((card, position) => {

        if (
            correctPositions.includes(position)
        ) {

            card.classList.add("correct");

        } else {

            card.classList.add("wrong");
        }
    });


    setTimeout(() => {

        if (!timelineComplete) {
            displayTimelineCards();
        }

    }, 500);
}


/*
    Successful completion.

    First-check success = Cocktail.
    Any previous failed check = Coconut.
*/

function finishTimeline() {

    timelineComplete = true;
    selectedPosition = null;


    currentEvents.sort(
        (a, b) =>
            a.correctIndex - b.correctIndex
    );


    const hadFailedAttempt =
        failedAttempt ||
        sessionStorage.getItem(
            "pearlTimelineFailedAttempt"
        ) === "true";


    if (hadFailedAttempt) {

        sessionStorage.setItem(
            "pearlTimelineResult",
            "coconut"
        );

        resultTitle.textContent =
            "🥥 Coconut collected!";

        resultText.textContent =
            "You got the timeline into the correct order, but not on the first check. Here are the years behind the memories.";

    } else {

        sessionStorage.setItem(
            "pearlTimelineResult",
            "cocktail"
        );

        resultTitle.textContent =
            "🍹 Cocktail earned!";

        resultText.textContent =
            "Perfect first time! Here are the years behind the memories.";
    }


    timelineMessage.textContent =
        "Perfect! Here are the years behind the memories.";

    document.querySelector(".hint").textContent =
    "Five special memories placed perfectly through the years!";

    checkTimelineButton.disabled = true;
    checkTimelineButton.classList.add("hidden");
    giveUpButton.classList.add("hidden");


    displayTimelineCards(true);


    resultPanel.classList.remove("hidden");
}


/*
    Give Up.

    Reveal the correct timeline and award
    a coconut for this challenge.
*/

function giveUpTimeline() {

    if (timelineComplete) {
        return;
    }


    timelineComplete = true;
    selectedPosition = null;


    sessionStorage.setItem(
        "pearlTimelineFailedAttempt",
        "true"
    );

    sessionStorage.setItem(
        "pearlTimelineResult",
        "coconut"
    );


    currentEvents.sort(
        (a, b) =>
            a.correctIndex - b.correctIndex
    );


    timelineMessage.textContent =
        "Here is the correct order through the years.";

    document.querySelector(".hint").textContent =
    "The dates have now been revealed in the correct chronological order.";

    resultTitle.textContent =
        "🥥 Coconut collected!";

    resultText.textContent =
        "Here is Louise and Steve's timeline in the correct order.";


    checkTimelineButton.disabled = true;
    checkTimelineButton.classList.add("hidden");
    giveUpButton.classList.add("hidden");


    displayTimelineCards(true);


    resultPanel.classList.remove("hidden");
}


/*
    Return to the main Pearl Anniversary quiz.

    The main quiz reads pearlTimelineResult
    and adds the Cocktail or Coconut there.
*/

function continueQuiz() {

    window.location.href =
        "../../quiz.html";
}


/*
    Start Challenge 18.
*/

function startTimeline() {

    /*
        Clear result information from a
        previous visit to this challenge.

        The main quiz's Counted flag prevents
        a completed challenge being scored twice.
    */

    sessionStorage.removeItem(
        "pearlTimelineResult"
    );

    sessionStorage.removeItem(
        "pearlTimelineFailedAttempt"
    );


    failedAttempt = false;
    timelineComplete = false;
    selectedPosition = null;


    shuffleTimeline();
    displayTimelineCards();


   if (window.innerWidth > 700) {
    timelineMessage.textContent =
        "Select two cards to swap them, then check the timeline.";
}
}


/*
    Buttons
*/

checkTimelineButton.addEventListener(
    "click",
    checkTimelineOrder
);

giveUpButton.addEventListener(
    "click",
    giveUpTimeline
);

continueButton.addEventListener(
    "click",
    continueQuiz
);


/*
    Begin.
*/

startTimeline();