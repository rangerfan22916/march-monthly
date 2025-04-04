// Word list based on difficulty
const wordlist = {
  easy: ["Puck", "Goal", "Rink", "Stick", "Goalie", "Icing"],
  medium: ["Faceoff", "Penalty", "Slapshot", "Playoffs", "Overtime"],
  hard: ["Hockeyman", "Defender", "Backhand", "Breakaway", "Slapshot"],
};

let selectedWord = "";
let displayedWord = "";
let wrongGuesses = 0;
let guessedLetters = [];
const maxMistakes = 6;
let wins = 0;
let losses = 0;
let wordGraveyard = [];

// Function to start the game with the selected difficulty level
function startGame(level) {
  updateDifficultyDisplay(level);

  // Reset game data
  guessedLetters = [];
  wrongGuesses = 0;
  document.getElementById("wrongLetters").textContent = "Wrong Guesses: ";
  document.getElementById("letterInput").value = "";

  // Select a random word from the word list based on difficulty
  selectedWord =
    wordlist[level][
      Math.floor(Math.random() * wordlist[level].length)
    ].toLowerCase();
  displayedWord = "_".repeat(selectedWord.length);

  // Update the word display
  document.getElementById("wordDisplay").textContent = displayedWord;

  // Show the game area and hide the difficulty screen
  document.getElementById("gameArea").classList.remove("d-none");
  document.getElementById("difficultyScreen").classList.add("d-none");
  document.getElementById("postGameScreen").classList.add("d-none");

  // Focus the input field
  document.getElementById("letterInput").focus();
}

// Function to update the displayed difficulty level
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById("difficultyBox");
  difficultyBox.textContent = `${
    level.charAt(0).toUpperCase() + level.slice(1)
  } Level`;
}

// Function to handle a letter guess
function guessLetter() {
  let inputField = document.getElementById("letterInput");
  let guessedLetter = inputField.value.toLowerCase();

  if (!guessedLetter.match(/^[a-z]$/)) {
    alert("Please enter a valid letter.");
    inputField.value = "";
    return;
  }

  if (guessedLetters.includes(guessedLetter)) {
    alert("You already guessed this letter.");
    inputField.value = "";
    return;
  }

  guessedLetters.push(guessedLetter);

  // Check if the guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)) {
    updateWordDisplay(guessedLetter);
    document.getElementById("correctSound").play();
  } else {
    wrongGuesses++;
    document.getElementById("wrongLetters").textContent += ` ${guessedLetter}`;
    document.getElementById("wrongSound").play();
  }

  // Check if the max mistakes have been reached
  if (wrongGuesses >= maxMistakes) {
    alert("Game Over! You've reached the max number of wrong guesses.");
    losses++;
    updateScoreboard();
    showPostGameScreen();
  }

  // Clear input field
  inputField.value = "";
}

// Function to update the word display after a correct guess
function updateWordDisplay(guessedLetter) {
  let newDisplayedWord = "";
  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === guessedLetter) {
      newDisplayedWord += guessedLetter;
    } else {
      newDisplayedWord += displayedWord[i];
    }
  }
  displayedWord = newDisplayedWord;
  document.getElementById("wordDisplay").textContent = displayedWord;

  // If the word is completely guessed, update score and show the congrats screen
  if (displayedWord === selectedWord) {
    wins++;
    updateScoreboard();
    showCongratulationsScreen();
    showConfetti();
  }
}

// Function to update the scoreboard
function updateScoreboard() {
  document.getElementById(
    "scoreboard"
  ).textContent = `Wins: ${wins} | Losses: ${losses}`;
}

// Function to show the post-game screen
function showPostGameScreen() {
  document.getElementById("lastWord").textContent = selectedWord;
  wordGraveyard.push(selectedWord);
  document.getElementById("wordGraveyard").innerHTML = wordGraveyard
    .map((word) => `<li>${word}</li>`)
    .join("");

  document.getElementById("gameArea").classList.add("d-none");
  document.getElementById("postGameScreen").classList.remove("d-none");
}

// Function to show the congratulations screen
function showCongratulationsScreen() {
  document.getElementById("finalScore").textContent = `Score: ${wins * 10}`;
  document.getElementById("gameArea").classList.add("d-none");
  document.getElementById("congratulationsScreen").classList.remove("d-none");
}

// Function to continue the game with a new word (starts the game again)
function continueGame() {
  wordGraveyard = [];
  document.getElementById("wordGraveyard").innerHTML = "";
  startGame("easy"); // You can choose to keep the difficulty level or randomize
}

// Function to reset the game (go back to the difficulty selection screen)
function resetGame() {
  wins = 0;
  losses = 0;
  updateScoreboard();
  document.getElementById("difficultyScreen").classList.remove("d-none");
  document.getElementById("congratulationsScreen").classList.add("d-none");
  document.getElementById("postGameScreen").classList.add("d-none");
}

// Confetti Function
function showConfetti() {
  const numConfetti = 100;
  for (let i = 0; i < numConfetti; i++) {
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);

    // Randomize position
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 2 + "s";
  }
}

// Press 'Enter' to guess
document
  .getElementById("letterInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      guessLetter();
    }
  });
