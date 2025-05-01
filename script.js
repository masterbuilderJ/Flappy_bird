// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let pipes = [];
let pipe_gap = 275;
let height_score = 0;

let gameInterval = null;

let frame = 0;
const frame_time = 200;

// sesion 2
let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("button");

function applyGravity() {
  bird_dy += gravity;
  let birdtop = bird.offsetTop + bird_dy;

  bird.classList.remove("jump");
  bird.classList.remove("fall");
  if (bird_dy < 0) {
    bird.classList.add("jump");
  } else if (bird_dy > 0) {
    bird.classList.add("fall");
  }
  birdtop = Math.max(birdtop, 0);
  birdtop = Math.min(birdtop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdtop + "px";
}

function startGame() {
  if (gameInterval !== null) return;

  backgroundMusic.play();
  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    getDifficultySettings();
    frame++;
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    flapSound.play();
    bird_dy = -7;
  }
});

function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
}

// greate pipe
function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  // Bottom pipe
  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  // Collision with top and bottom
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  // Increase score when bird passes pipes (pipes are paired)
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      // Only check once for each top-bottom pair
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play();
  }
  score = newScore;
  score_display.textContent = "Score: " + score;
}

function endGame() {
  hitSound.play();
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  if (height_score < score) {
    alert("new height score " + score);
    height_score = score;
  } else {
    alert("Game Over! Your Score: " + score);
  }
  resetGame();
}

function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";
}

let pipeSpeed = 3; // Default speed

function getDifficultySettings() {
  const selected = document.getElementById("difficulty-select").value;

  if (selected === "easy") {
    pipeSpeed = 2;
  } else if (selected === "medium") {
    pipeSpeed = 3;
  } else if (selected === "hard") {
    pipeSpeed = 5;
  }
}

const flapSound = new Audio("sounds/flap.mp3");
const scoreSound = new Audio("sounds/score.mp3");
const hitSound = new Audio("sounds/hit.mp3");

// Load background music
const backgroundMusic = new Audio("sounds/background.mp3");
backgroundMusic.loop = true; // music should keep playing
backgroundMusic.volume = 0.5; // adjust volume
backgroundMusic.play();
