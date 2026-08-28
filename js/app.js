const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {

    const name = document.getElementById("playerName").value.trim();

    if (name === "") {

        alert("Please enter your name.");

        return;

    }

    localStorage.setItem("playerName", name);

    window.location.href = "quiz.html";

});