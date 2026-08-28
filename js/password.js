document.addEventListener("DOMContentLoaded", () => {
    const passwordGate = document.getElementById("passwordGate");
    const passwordInput = document.getElementById("quizPassword");
    const passwordSubmit = document.getElementById("passwordSubmit");
    const passwordMessage = document.getElementById("passwordMessage");

     // Preload the round pictures while the player enters the password
    const roundPictures = [
        "images/rounds/wedding.jpg",
        "images/rounds/family.jpg",
        "images/rounds/holidays.jpg",
        "images/rounds/year.jpg",
        "images/rounds/music.jpg",
        "images/rounds/true-false.jpg",
        "images/rounds/whatnext.jpg",
        "images/rounds/dianerobert2026.jpg"
    ];

    roundPictures.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
   const quizPasswordHash = "1699b82c32dd7fe9a74d3c5e10942876b173233ec0386c577829f27eec5c4a34";
  
   async function hashPassword(password) {

const data = new TextEncoder().encode(password);

const hashBuffer = await crypto.subtle.digest("SHA-256", data);

const hashArray = Array.from(new Uint8Array(hashBuffer));

return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

}

    async function unlockQuiz() {

const enteredPassword = passwordInput.value.trim().toLowerCase();

const enteredHash = await hashPassword(enteredPassword);

if (enteredHash === quizPasswordHash) {

sessionStorage.setItem("diamondQuizUnlocked", "true");

document.body.classList.remove("quiz-locked");

passwordGate.style.display = "none";

document.querySelector(".container").style.display = "block";

} else {

passwordMessage.textContent = "Sorry, that password is incorrect.";

passwordInput.value = "";

passwordInput.focus();

}

}

    const container = document.querySelector(".container");

if (sessionStorage.getItem("diamondQuizUnlocked") === "true") {
    document.body.classList.remove("quiz-locked");
    passwordGate.style.display = "none";
    container.style.display = "block";
} else {
    container.style.display = "none";
    passwordInput.focus();
}
    passwordSubmit.addEventListener("click", unlockQuiz);

    passwordInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            unlockQuiz();
        }
    });
});