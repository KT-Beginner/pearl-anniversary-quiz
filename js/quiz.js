// Redirect anyone who hasn't unlocked the quiz
if (sessionStorage.getItem("diamondQuizUnlocked") !== "true") {
    window.location.href = "index.html";
}
// ==========================================
// Diane & Robert's Anniversary Challenge
// Quiz Version 1
// ==========================================

// Player name
const playerName = localStorage.getItem("playerName") || "Guest";

// Quiz state - restore progress after an accidental refresh

let currentQuestion = Number(sessionStorage.getItem("quizCurrentQuestion")) || 0;

let score = Number(sessionStorage.getItem("quizScore")) || 0;

let currentRound = "";

let playerAnswers = JSON.parse(sessionStorage.getItem("quizPlayerAnswers") || "[]");

// Keep track of the currently playing music clip
let currentQuestionAudio = null;

// Page elements
const player = document.getElementById("playerName");
const scoreText = document.getElementById("score");
const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const questionImage = document.getElementById("questionImage");
const questionVideo = document.getElementById("questionVideo");
const imageCaption = document.getElementById("imageCaption");
const photoFrame = document.getElementById("photoFrame");
const feedback = document.getElementById("feedback");
const progress = document.getElementById("progress");
const playClip = document.getElementById("playClip");
const nextQuestion = document.getElementById("nextQuestion");


const buttons = document.querySelectorAll(".answer");
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

const congratulationsSound =
    new Audio("sounds/congratulations.mp3");
    
const cheerSound =
    new Audio("sounds/cheer.mp3");
    // Unlock final sounds for iPhone, but keep them muted until the end
congratulationsSound.muted = true;
cheerSound.muted = true;

document.addEventListener("click", () => {

    [congratulationsSound, cheerSound].forEach(sound => {

        sound.play()
            .then(() => {
                sound.pause();
                sound.currentTime = 0;
            })
            .catch(() => {
                // Ignore if the browser blocks the unlock attempt
            });

    });

}, { once: true });


const card = document.querySelector(".card");


const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const roundOverlay = document.getElementById("roundOverlay");
const roundTitle = document.getElementById("roundTitle");
const roundPhoto = document.getElementById("roundPhoto");
const roundMessage = document.getElementById("roundMessage");
const continueRound = document.getElementById("continueRound");
const roundInfo = {

    "💍 Wedding Day": {
        title: "💍 Round 1 – Wedding Day",
        photo: "images/rounds/wedding.jpg",
        message: "Every great love story has a beginning. Let's travel back to where Diane and Robert's wonderful journey together first began."
    },

    "👨‍👩‍👧 Family": {
        title: "👨‍👩‍👧 Round 2 – Family",
        photo: "images/rounds/family.jpg",
        message: "Time to see how well you know Diane, Robert, their family and some trivia from over the years."
    },

    "🏖️ Holidays": {
        title: "🏖️ Round 3 – Holidays",
        photo: "images/rounds/holidays.jpg",
        message: "Suitcases packed! Let's revisit some of Diane and Robert's holidays and adventures over the years."
    },

    "📅 Guess the Year": {
        title: "📅 Round 4 – Guess the Year",
        photo: "images/rounds/year.jpg",
        message: "Can you remember when? Let's put your memory to the test!"
    },
"🎵 Music Round": {
    title: "🎵 Round 5 – Music Round",
    photo: "images/rounds/music.jpg",
    message: "Can you recognise these famous tunes? Listen carefully, then answer the question before the reveal!"
},
"✅ True or False": {
    title: "✅ Round 6 – True or False",
    photo: "images/rounds/true-false.jpg",
    message: "Decide whether each statement is true or false. Some are easy... others might catch you out!"
},
"🎬 What Happened Next?": { 
    title: "🎬 Round 7 – What Happened Next?",
    photo: "images/rounds/whatnext.jpg",
    message: "Can you guess what happens next?"
},
    "❤️ Diane and Robert in 2026": {
        title: "❤️ Final Round – 2026",
        photo: "images/rounds/dianerobert2026.jpg",
        message: "The Anniversary Quiz has nearly reached the end. Just a few more questions left to celebrate an incredible 50 years of love, laughter and memories. Good luck!"
    }

};

function showRound(round) {
    const info = roundInfo[round];

    if (!info) {
        displayQuestion();
        return;
    }

    roundTitle.textContent = info.title;

   if (round === "💍 Wedding Day") {

    roundPhoto.className = "round-photo portrait-round";

} else if (
    round === "👨‍👩‍👧 Family" ||
    round === "🏖️ Holidays" ||
    round === "❤️ Diane and Robert in 2026"
) {

    roundPhoto.className = "round-photo round-5-4";

} else {

    roundPhoto.className = "round-photo round-3-2";
}

    roundPhoto.src = info.photo;
    roundMessage.textContent = info.message;

    roundOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

continueRound.addEventListener("click", () => {
    roundOverlay.style.display = "none";
    document.body.style.overflow = "auto";
    displayQuestion();
});
const preloadedMedia = [];

function preloadNextQuestion() {

const nextIndex = currentQuestion + 1;

if (nextIndex >= questions.length) return;

const nextQ = questions[nextIndex];

const imageFiles = [

nextQ.image,

nextQ.startImage,

nextQ.revealImage

].filter(Boolean);

imageFiles.forEach(src => {

const img = new Image();

img.src = src;

preloadedMedia.push(img);

});

const audioFiles = [

nextQ.audioQuestion,

nextQ.audioAnswer,

nextQ.audio,

nextQ.audioFull

].filter(Boolean);

audioFiles.forEach(src => {

const audio = new Audio();

audio.preload = "auto";

audio.src = src;

preloadedMedia.push(audio);

});

const videoFiles = [

nextQ.video,

nextQ.revealVideo

].filter(Boolean);

videoFiles.forEach(src => {

const video = document.createElement("video");

video.preload = "auto";

video.src = src;

video.load();

preloadedMedia.push(video);

});

}
// ==========================================
// Load Question
// ==========================================
function loadQuestion() {
    const q = questions[currentQuestion];

    if (q.round !== currentRound) {
        currentRound = q.round;

        // Hide the previous question's photo before showing the next round
        photoFrame.style.display = "none";
        questionImage.style.display = "none";

        showRound(currentRound);
        return;
    }

    displayQuestion();
}
function displayQuestion() {
    const q = questions[currentQuestion];

   
    player.textContent = `👤 ${playerName}`;
    scoreText.textContent = `⭐ Score: ${score}`;

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    question.textContent = q.question;
question.style.display = "block";

feedback.textContent = "";
feedback.style.display = "block";
    nextQuestion.style.display = "none";
    playClip.style.display = "none";
    playClip.disabled = false;
    playClip.textContent = "▶️ Play Clip";
   
    questionVideo.pause();
    questionVideo.style.display = "none";
    questionVideo.removeAttribute("src");

    progress.style.width =
        (currentQuestion / questions.length) * 100 + "%";

 if (q.image || q.startImage) {
    questionImage.src = q.image || q.startImage;
    
    questionImage.className =
    q.smallImage
        ? "question-image small-image"
        : "question-image";

    imageCaption.textContent = q.caption || "";

   if (q.revealImageAfterAnswer && !q.revealImage) {
        photoFrame.style.display = "none";
        questionImage.style.display = "none";
        imageCaption.style.display =
    (q.caption && !q.showPhotoTitleAfterAnswer) ? "block" : "none";
    } else {
        photoFrame.style.display = "block";
        questionImage.style.display = "block";
        imageCaption.style.display =
            q.caption ? "block" : "none";
    }

} else {
    photoFrame.style.display = "none";

    questionImage.removeAttribute("src");
    questionImage.style.display = "none";

    imageCaption.textContent = "";
    imageCaption.style.display = "none";
}
// ==========================================
// Video question
// ==========================================
if (q.type === "video") {

    photoFrame.style.display = "block";

    questionImage.src = q.startImage;
    questionImage.style.display = "block";

    questionVideo.style.display = "none";

    playClip.style.display = "inline-block";
    playClip.textContent = "▶️ Play Clip";

    playClip.onclick = () => {

    questionVideo.src = q.video;
    questionVideo.currentTime = 0;

    playClip.disabled = true;

    questionVideo.onplaying = () => {
        questionImage.style.display = "none";
        questionVideo.style.display = "block";
    };

    questionVideo.play();

    questionVideo.onended = () => {

        questionVideo.style.display = "none";

        questionImage.src = q.endImage;
        questionImage.style.display = "block";

        playClip.disabled = false;
        playClip.textContent = "▶️ Play Again";
    };
};
}
if (q.audioQuestion) {
    playClip.style.display = "inline-block";

    // Disable answer buttons until the clip has played once
    buttons.forEach(btn => btn.disabled = true);

    playClip.onclick = () => {

        if (currentQuestionAudio) {
            currentQuestionAudio.pause();
            currentQuestionAudio.currentTime = 0;
        }

        currentQuestionAudio = new Audio(q.audioQuestion);
        currentQuestionAudio.play();

        playClip.disabled = true;

        currentQuestionAudio.onended = () => {

    // Allow the question clip to be played again
playClip.style.display = "inline-block";
playClip.disabled = false;
playClip.textContent = "▶️ Play Again";

// Now allow the user to answer
buttons.forEach(btn => btn.disabled = false);
};
    };
}
  buttons.forEach((button, index) => {

    if (q.type === "truefalse") {

        if (index > 1) {
            button.style.display = "none";
            return;
        }

        button.style.display = "block";
        button.style.width = "100%";

    } else {

        button.style.display = "block";
        button.style.width = "";

    }

    button.textContent = q.answers[index];
    button.disabled = false;
    button.style.background = "";
});
const savedAnswer = playerAnswers[currentQuestion];

if (savedAnswer !== undefined) {

buttons.forEach(btn => btn.disabled = false);

setTimeout(() => {

buttons[savedAnswer].click();

}, 100);

}
setTimeout(preloadNextQuestion, 1500);
}
function showCorrectSparkles() {

    const shimmer = document.createElement("div");
    shimmer.className = "diamond-shimmer";

    feedback.appendChild(shimmer);

    setTimeout(() => {
        shimmer.remove();
    }, 1200);

}

// ==========================================
// Check Answer
// ==========================================

buttons.forEach((button, index) => {

    button.addEventListener("click", () => {

        const wasAlreadyAnswered = playerAnswers[currentQuestion] !== undefined;

playerAnswers[currentQuestion] = index;

    // Stop the question music if it's still playing
    if (currentQuestionAudio) {
        currentQuestionAudio.pause();
        currentQuestionAudio.currentTime = 0;
    }

    // Hide the Play Again button while the answer audio plays
    playClip.style.display = "none";
    playClip.disabled = true;

    // Disable all buttons
buttons.forEach(btn => btn.disabled = true);

// Make absolutely sure the Next button can't be tapped yet
nextQuestion.style.display = "none";
nextQuestion.disabled = true;

const correct = questions[currentQuestion].correct;

      if (index === correct) {

    if (!wasAlreadyAnswered) {

score++;

}
    button.style.background = "green";
   feedback.innerHTML = '<span class="green-tick">✅</span> <span class="correct-text">Correct!</span>';

    showCorrectSparkles();

    correctSound.currentTime = 0;
    correctSound.play();

} else {

    button.style.background = "red";
    buttons[correct].style.background = "green";
    feedback.textContent = "❌ Not quite!";

    wrongSound.currentTime = 0;
    wrongSound.play();
}
sessionStorage.setItem("quizCurrentQuestion", currentQuestion);

sessionStorage.setItem("quizScore", score);

sessionStorage.setItem("quizPlayerAnswers", JSON.stringify(playerAnswers));

const q = questions[currentQuestion];
setTimeout(() => {

    // Make the answer screen more compact
    question.style.display = "none";
    feedback.style.display = "none";

   if (q.revealVideo) {

    buttons.forEach(btn => btn.style.display = "none");

    // Do not allow moving on until the reveal video finishes
    nextQuestion.style.display = "none";
    nextQuestion.disabled = true;

    questionVideo.src = q.revealVideo;
    questionVideo.currentTime = 0;

   questionVideo.onplaying = () => {

questionImage.style.display = "none";

questionVideo.style.display = "block";

photoFrame.style.display = "block";

if (q.videoTitle || q.videoText) {

imageCaption.innerHTML = "";

if (q.videoTitle) {

const title = document.createElement("strong");

title.className = "photo-note-title";

title.textContent = q.videoTitle;

imageCaption.appendChild(title);

}

if (q.videoText) {

const text = document.createElement("span");

text.className = "photo-note-text";

text.textContent = q.videoText;

imageCaption.appendChild(text);

}

imageCaption.style.display = "block";

}

};

    questionVideo.onended = () => {

        questionVideo.style.display = "none";

     photoFrame.style.display = "block";

questionImage.classList.remove("small-image");
questionImage.src = q.revealImage;
questionImage.style.display = "block";

        if (q.photoTitle || q.photoText) {

    imageCaption.innerHTML = `
        ${q.photoTitle
            ? `<strong class="photo-note-title">${q.photoTitle}</strong>`
            : ""}
        ${q.photoText
            ? `<span class="photo-note-text">${q.photoText}</span>`
            : ""}
    `;

    imageCaption.style.display = "block";
} else {
    imageCaption.style.display = "none";
}

       showNextButton();

        playClip.style.display = "inline-block";
        playClip.disabled = false;
    playClip.textContent = "▶️ Play Again";

playClip.onclick = () => {

    nextQuestion.style.display = "none";

    questionImage.style.display = "none";
    questionVideo.style.display = "block";

    questionVideo.currentTime = 0;
    questionVideo.play();

    playClip.disabled = true;
};
    };

    questionVideo.play();
}

    if ((q.revealImageAfterAnswer || q.showPhotoTitleAfterAnswer) && q.image) {

    buttons.forEach(btn => btn.style.display = "none");

  photoFrame.style.display = "block";photoFrame.style.display = "block";

questionImage.classList.remove("small-image");
questionImage.style.display = "block";
questionImage.src = q.revealImage || q.image;

   if (q.photoTitle || q.photoText || q.caption) {

    if (q.photoTitle || q.photoText) {
        imageCaption.innerHTML = `
            ${q.photoTitle
                ? `<strong class="photo-note-title">${q.photoTitle}</strong>`
                : ""}
            ${q.photoText
                ? `<span class="photo-note-text">${q.photoText}</span>`
                : ""}
        `;
    } else {
        imageCaption.textContent = q.caption;
    }

    imageCaption.style.display = "block";

    }
}
}, 1200);
        scoreText.textContent = `⭐ Score: ${score}`;
        
        // Play question audio, if one has been provided
const answerAudio =
    questions[currentQuestion].audioAnswer ||
    questions[currentQuestion].audio;

    function showNextButton() {

    nextQuestion.textContent =
        currentQuestion === questions.length - 1
            ? "🎉 That's All Folks! Click for Your Score"
            : "Next Question ➜";

    nextQuestion.disabled = false;
    nextQuestion.style.display = "inline-block";
}

function moveToNextQuestion() {
    questionVideo.pause();
    questionVideo.style.display = "none";

    currentQuestion++;

    sessionStorage.setItem("quizCurrentQuestion", currentQuestion);

if (currentQuestion < questions.length) {
    loadQuestion();
        } else {
            card.classList.remove("fade-out");
            card.classList.remove("fade-in");
            showFinalScreen();
        }
   
}
nextQuestion.onclick = () => {
    nextQuestion.style.display = "none";
    moveToNextQuestion();
};

if (answerAudio) {
    const revealAudio = new Audio(answerAudio);

    revealAudio.addEventListener("ended", () => {

    const currentQ = questions[currentQuestion];

    if (currentQ.audioQuestion || currentQ.manualNext) {

        if (currentQ.audioFull) {

            setTimeout(() => {
                playClip.style.display = "inline-block";
                playClip.disabled = false;
                playClip.textContent = "▶️ Play Full Clip";
            }, 1200);

            playClip.onclick = () => {

                const fullAudio = new Audio(currentQ.audioFull);

                // Prevent moving on while the full clip is playing
                nextQuestion.disabled = true;
                playClip.disabled = true;
                playClip.textContent = "🎵 Playing...";

                fullAudio.addEventListener("ended", () => {
                    nextQuestion.disabled = false;
                    playClip.disabled = false;
                    playClip.textContent = "▶️ Play Full Clip";
                });

                fullAudio.play().catch(() => {
                    nextQuestion.disabled = false;
                    playClip.disabled = false;
                    playClip.textContent = "▶️ Play Full Clip";
                });
            };
        }

        // Show both buttons at the same time
        setTimeout(showNextButton, 1200);

    } else {

        moveToNextQuestion();
    }
});

    revealAudio.play().catch(() => {

       if (questions[currentQuestion].audioQuestion || questions[currentQuestion].manualNext) {
            nextQuestion.style.display = "inline-block";
        } else {
            setTimeout(moveToNextQuestion, 5000);
        }

    });

} else {

    // Video questions and reveal videos show Next only after the video finishes
    if (q.type !== "video" && !q.revealVideo) {
        setTimeout(showNextButton, 1200);
    }

}
});
});

// ==========================================
// Final Screen
// ==========================================

// ==========================================
// Confetti
// ==========================================

function launchConfetti() {

    const colours = [
        "#d4af37",
        "#ffd700",
        "#7a1838",
        "#ffffff",
        "#ff69b4",
        "#4CAF50"
    ];

    for (let i = 0; i < 120; i++) {

        const piece = document.createElement("div");

        piece.className = "confetti";

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.background =
            colours[Math.floor(Math.random() * colours.length)];

        piece.style.width = (6 + Math.random() * 8) + "px";
        piece.style.height = piece.style.width;

        piece.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 5000);

    }

}
function showFinalScreen(silent = false) {

    progress.style.width = "100%";

    let heading = "";
    let message = "";

   if (score === questions.length) {

    heading = "🌟 PERFECT SCORE! 🌟";
    message = "You really know Diane & Robert!";

} else if (score >= 4) {

    heading = "🎉 Excellent! 🎉";
    message = "What a fantastic score!";

} else if (score >= 3) {

    heading = "😊 Well Done! 😊";
    message = "You know Diane & Robert pretty well!";

} else if (score >= 2) {

    heading = "👏 Thanks for Playing!";
    message = "Every memory is special.";

} else {

    heading = "❤️ Thanks for Celebrating!";
    message = "We hope you enjoyed the Golden Anniversary Challenge.";

}

if (!silent) {

congratulationsSound.muted = false;
congratulationsSound.currentTime = 0;
congratulationsSound.play()

    .catch(error => {
        console.error(
            "Congratulations sound could not play:",
            error
        );
    });

congratulationsSound.onended = () => {

    launchConfetti();

    cheerSound.muted = false;
    cheerSound.currentTime = 0;

    cheerSound.play()
        .catch(error => {
            console.error(
                "Cheer sound could not play:",
                error
            );
        
        });
};
}



    card.innerHTML = `
        <div class="finish-screen">

            <img
                src="images/family2026.jpg"
                class="finish-photo"
                 alt="Diane & Robert">

            <h1 class="finish-title">
                🏆 Congratulations ${playerName}! 🏆
            </h1>

            <div class="finish-score">
                ⭐ ${score} / ${questions.length} ⭐
            </div>

            <h2 class="finish-heading">
                ${heading}
            </h2>

            <p class="finish-message">
                ${message}
            </p>

           <p class="finish-thanks">
    🥂 Thank you for taking part in
    <strong>Diane & Robert’s Golden Anniversary Challenge</strong>
    and helping them celebrate
    <strong>50 wonderful years of marriage.</strong>
</p>

<p class="finish-message">
    We hope this quiz brought back happy memories and a few smiles.
</p>

<p class="finish-footer">
    With all our love,<br>
    <strong>❤️ Dawn & Kevin ❤️</strong><br><br>
    Golden Wedding Anniversary • 2026
</p>

<div class="finish-buttons">

    <button id="printResults" class="start-btn">
    📄 Download My Results
</button>

    <button id="viewSlideshow" class="start-btn">
        📸 View Slideshow
    </button>

    <button id="playAgain" class="start-btn">
        🔄 Play Quiz Again
    </button>

</div>

        </div>
    `;
const viewSlideshowButton = document.getElementById("viewSlideshow");
const playAgainButton = document.getElementById("playAgain");
const printResultsButton =
    document.getElementById("printResults");

printResultsButton.addEventListener("click", () => {

    const resultsData = {
        playerName: playerName,
        score: score,
        total: questions.length,

        results: questions.map((q, index) => {

            const selectedAnswerIndex = playerAnswers[index];
            const correctAnswerIndex = q.correct;

            return {
                question: q.question,

                selectedAnswer:
                    selectedAnswerIndex !== undefined
                        ? q.answers[selectedAnswerIndex]
                        : "No answer",

                correctAnswer:
                    q.answers[correctAnswerIndex],

                isCorrect:
                    selectedAnswerIndex === correctAnswerIndex
            };
        })
    };

    localStorage.setItem(
        "goldenQuizResults",
        JSON.stringify(resultsData)
    );

    window.open("results.html", "_blank");
});

viewSlideshowButton.addEventListener("click", () => {
    startSlideshow();
});

playAgainButton.addEventListener("click", () => {

sessionStorage.removeItem("diamondQuizUnlocked");

sessionStorage.removeItem("quizCurrentQuestion");

sessionStorage.removeItem("quizScore");

sessionStorage.removeItem("quizPlayerAnswers");

window.location.href = "index.html";

});
}
// ==========================================
// Image Popup
// ==========================================

questionImage.addEventListener("click", () => {

    if (questionImage.style.display !== "none") {

        modalImage.src = questionImage.src;
        imageModal.classList.add("show");

    }

});

closeModal.addEventListener("click", () => {

    imageModal.classList.remove("show");

});

imageModal.addEventListener("click", (e) => {

    if (e.target === imageModal) {

        imageModal.classList.remove("show");

    }

});

// ==========================================
// Start Quiz
// ==========================================

// Final photo slideshow

const slideshowImages = Array.from(
    { length: 103 },
    (_, index) => `images/slideshow/slide${index + 1}.jpg`
);

let slideshowIndex = 0;
let slideshowTimer = null;
let slideshowControlsTimer = null;
let slideshowPaused = false;
let slideshowTouchStartX = 0;
let slideshowTouchStartY = 0;
let slideshowWasSwiped = false;

const previousSlideButton =
    document.getElementById("previousSlide");

const nextSlideButton =
    document.getElementById("nextSlide");

const pauseSlideshowButton =
    document.getElementById("pauseSlideshow");

const closeSlideshowButton =
    document.getElementById("closeSlideshow");

const slideshow =
    document.getElementById("slideshow");

const slideshowImage =
    document.getElementById("slideshow-image");

const slideshowControls =
    document.getElementById("slideshowControls");

// Keep the full-screen slideshow outside the animated quiz card.
// This allows position: fixed to work correctly on iPhones.
if (slideshow && slideshow.parentElement !== document.body) {
    document.body.appendChild(slideshow);
}

function slideshowIsOpen() {
    return slideshow &&
        !slideshow.classList.contains("hidden");
}

function hideSlideshowControls() {
    if (!slideshowControls) {
        return;
    }

    slideshowControls.classList.remove("show");
}

function showSlideshowControls() {
    if (!slideshowControls) {
        return;
    }

    slideshowControls.classList.add("show");

    clearTimeout(slideshowControlsTimer);

    slideshowControlsTimer = setTimeout(() => {
        hideSlideshowControls();
    }, 3000);
}

function displaySlideshowImage() {
    if (
        !slideshowImage ||
        slideshowImages.length === 0
    ) {
        return;
    }

    slideshowImage.src =
    slideshowImages[slideshowIndex];
    sessionStorage.setItem("slideshowIndex", slideshowIndex);

    slideshowImage.alt =
        `Slideshow photograph ${slideshowIndex + 1} ` +
        `of ${slideshowImages.length}`;
}

function stopSlideshowTimer() {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
}

function closeSlideshow(showEnding = true) {
    stopSlideshowTimer();
    sessionStorage.removeItem("slideshowActive");

    sessionStorage.removeItem("slideshowIndex");

    sessionStorage.removeItem("slideshowPaused");

    clearTimeout(slideshowControlsTimer);


    if (slideshow) {
        slideshow.classList.add("hidden");
    }

    document.body.classList.remove(
        "slideshow-open"
    );

    hideSlideshowControls();

    // Return to the congratulations screen instead.
}

function showPreviousSlide() {
    slideshowIndex--;

    if (slideshowIndex < 0) {
        slideshowIndex =
            slideshowImages.length - 1;
    }

    displaySlideshowImage();
    showSlideshowControls();
}

function showNextSlide() {
    slideshowIndex++;

    if (
        slideshowIndex >=
        slideshowImages.length
    ) {
        slideshowIndex = 0;
    }

    displaySlideshowImage();
    showSlideshowControls();
}

function startSlideshowTimer() {
    stopSlideshowTimer();

    slideshowTimer = setInterval(() => {
        if (slideshowPaused) {
            return;
        }

        slideshowIndex++;

        // After the final photograph has been shown,
        // close the slideshow and display the
        // thank-you screen.
        if (
            slideshowIndex >=
            slideshowImages.length
        ) {
           closeSlideshow(false);
            return;
        }

        displaySlideshowImage();

    }, 4000);
}

function startSlideshow() {
    if (
        !slideshow ||
        !slideshowImage ||
        slideshowImages.length === 0
    ) {
        return;
    }

    stopSlideshowTimer();

    slideshowIndex = 0;
    slideshowPaused = false;
    sessionStorage.setItem("slideshowActive", "true");

    sessionStorage.setItem("slideshowPaused", "false");

    if (pauseSlideshowButton) {
        pauseSlideshowButton.textContent =
            "⏸ Pause";
    }

    slideshow.classList.remove("hidden");

    document.body.classList.add(
        "slideshow-open"
    );

    hideSlideshowControls();
    displaySlideshowImage();
    startSlideshowTimer();
}
function restoreSlideshow() {

slideshowIndex = Number(sessionStorage.getItem("slideshowIndex")) || 0;

slideshowPaused = sessionStorage.getItem("slideshowPaused") === "true";

slideshow.classList.remove("hidden");

document.body.classList.add("slideshow-open");

displaySlideshowImage();

if (pauseSlideshowButton) {

pauseSlideshowButton.textContent = slideshowPaused ? "▶ Play" : "⏸ Pause";

}

hideSlideshowControls();

if (!slideshowPaused) {

startSlideshowTimer();

}

}
if (slideshowImage) {
    slideshowImage.addEventListener(
        "click",
        () => {
            if (slideshowWasSwiped) {
                slideshowWasSwiped = false;
                return;
            }

            if (
                slideshowControls &&
                slideshowControls.classList
                    .contains("show")
            ) {
                hideSlideshowControls();

                clearTimeout(
                    slideshowControlsTimer
                );
            } else {
                showSlideshowControls();
            }
        }
    );

    // Swipe left // Swipe left or right anywhere on the slideshow
if (slideshow) {

    slideshow.addEventListener(
        "touchstart",
        (event) => {
            if (event.touches.length !== 1) {
                return;
            }

            slideshowTouchStartX =
                event.touches[0].clientX;

            slideshowTouchStartY =
                event.touches[0].clientY;

            slideshowWasSwiped = false;
        },
        { passive: true }
    );

    slideshow.addEventListener(
        "touchend",
        (event) => {
            if (event.changedTouches.length !== 1) {
                return;
            }

            const touch =
                event.changedTouches[0];

            const horizontalDistance =
                touch.clientX - slideshowTouchStartX;

            const verticalDistance =
                touch.clientY - slideshowTouchStartY;

            // Ignore short movements and vertical gestures
            if (
                Math.abs(horizontalDistance) < 45 ||
                Math.abs(horizontalDistance) <=
                    Math.abs(verticalDistance)
            ) {
                return;
            }

            slideshowWasSwiped = true;

            if (horizontalDistance < 0) {
                showNextSlide();
            } else {
                showPreviousSlide();
            }
        },
        { passive: true }
    );

    slideshow.addEventListener(
        "touchcancel",
        () => {
            slideshowWasSwiped = false;
        },
        { passive: true }
    );
}

// Close: if (slideshowImage)
}

if (previousSlideButton) {
    previousSlideButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            showPreviousSlide();
        }
    );
}

if (nextSlideButton) {
    nextSlideButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            showNextSlide();
        }
    );
}

if (pauseSlideshowButton) {

pauseSlideshowButton.addEventListener("click", (event) => {

event.stopPropagation();

slideshowPaused = !slideshowPaused;
sessionStorage.setItem("slideshowPaused", slideshowPaused);

if (slideshowPaused) {

pauseSlideshowButton.textContent = "▶ Play";

} else {

pauseSlideshowButton.textContent = "⏸ Pause";

}

showSlideshowControls();

});

}

if (closeSlideshowButton) {
    closeSlideshowButton.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
            closeSlideshow(false);
        }
    );
}

// Desktop and laptop keyboard controls.
document.addEventListener(
    "keydown",
    (event) => {
        if (!slideshowIsOpen()) {
            return;
        }

        if (event.key === "ArrowLeft") {
            showPreviousSlide();

        } else if (
            event.key === "ArrowRight"
        ) {
            showNextSlide();

        } else if (
            event.key === "Escape"
        ) {
           closeSlideshow(false);

        } else if (
            event.key === " " ||
            event.key === "Spacebar"
        ) {
            event.preventDefault();

            if (pauseSlideshowButton) {
                pauseSlideshowButton.click();
            }
        }
    }
);

function showSlideshowEnding() {
    card.innerHTML = `
        <div class="finish-screen">

            <h1 class="finish-title">
                ❤️ Thank You ❤️
            </h1>

            <p class="finish-message">
                Thank you for celebrating
                <strong>
                    Diane & Robert's Golden Wedding
                    Anniversary
                </strong>.
            </p>

            <p class="finish-message">
                We hope you've enjoyed looking back
                over
                <strong>50 wonderful years</strong>
                of love, laughter and family memories.
            </p>

            <p class="finish-footer">
                With all our love,<br>
                <strong>
                    ❤️ Dawn & Kevin ❤️
                </strong>
            </p>

            <div class="finish-buttons">

                <button
                    id="watchSlideshowAgain"
                    class="start-btn"
                >
                    📸 Watch Slideshow Again
                </button>

                <button
                    id="slideshowHome"
                    class="start-btn"
                >
                    🏠 Home
                </button>

                <button
                    id="slideshowPlayAgain"
                    class="start-btn"
                >
                    🔄 Play Again
                </button>

            </div>

        </div>
    `;

    document
        .getElementById(
            "watchSlideshowAgain"
        )
        .addEventListener(
            "click",
            () => {
                startSlideshow();
            }
        );

    document
        .getElementById(
            "slideshowHome"
        )
        .addEventListener(
            "click",
            () => {
                sessionStorage.removeItem(
                    "diamondQuizUnlocked"
                );
                sessionStorage.removeItem("quizCurrentQuestion");

sessionStorage.removeItem("quizScore");

sessionStorage.removeItem("quizPlayerAnswers");

                window.location.href =
                    "index.html";
            }
        );

    document
        .getElementById(
            "slideshowPlayAgain"
        )
        .addEventListener(
            "click",
            () => {
                sessionStorage.removeItem(
                    "diamondQuizUnlocked"
                );
                sessionStorage.removeItem("quizCurrentQuestion");

sessionStorage.removeItem("quizScore");

sessionStorage.removeItem("quizPlayerAnswers");

                window.location.href =
                    "index.html";
            }
        );
}

// Start the quiz

if (currentQuestion >= questions.length) {

const restoringSlideshow = sessionStorage.getItem("slideshowActive") === "true";

showFinalScreen(restoringSlideshow);

if (restoringSlideshow) {

restoreSlideshow();

}

} else {

    loadQuestion();
  
}