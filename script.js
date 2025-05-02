// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let difficulty = "easy";
let pipes = [];
let pipe_gap = 275;
let flickerInterval = null;
const defaultScore = {
  Baby: 0,
  medium: 0,
  hard: 0,
  imposeible: 0,
  easy: 0,
  flicker: 0,
};
let height_score = JSON.parse(localStorage.getItem("height_score")) || {
  ...defaultScore,
};

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
    height_score = JSON.parse(localStorage.getItem("height_score")) || {
      ...defaultScore,
    };

    if (difficulty === "flicker") {
      triggerFlicker();
    }

    score_display.textContent =
      "score: " + score + " | best: " + height_score[difficulty];
    frame++;
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

let calledTrigger = false;

function triggerFlicker() {
  if(calledTrigger) return;
  pipes.forEach((pipe, index) => {
    pipe.style.visibility = "hidden";

    let timeout = setTimeout(() => {
      pipe.style.visibility = "visible";
      clearTimeout(timeout);
    }, 2000);
  });

  let resettimeout  = setTimeout(() => {
    calledTrigger = false;
    clearTimeout(resettimeout);
  }, 1000);

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
  updateBackgroungAvatar(score)
}

function endGame() {
  if (Number(score) > Number(height_score[difficulty])) {
    localStorage.setItem(
      "height_score",
      JSON.stringify({ ...height_score, [difficulty]: score })
    );
  }
  hitSound.play();
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  if (height_score < score) {
    alert("new height score " + score);
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
  clearInterval(flickerInterval);
  score_display.textContent = "";
}

let pipeSpeed = 3; // Default speed

function getDifficultySettings() {
  difficulty = document.getElementById("difficulty-select").value;
  console.log(difficulty);
  // debugger;
  if (difficulty === "easy") {
    pipeSpeed = 4;
    bird.style.height = "80px";
    bird.style.width = "100px";
  } else if (difficulty === "medium") {
    pipeSpeed = 7;
    bird.style.height = "90px";
    bird.style.width = "110px";
  } else if (difficulty === "hard") {
    pipeSpeed = 12;
    bird.style.height = "100px";
    bird.style.width = "120px";
  } else if (difficulty === "imposeible") {
    pipeSpeed = 100;
    bird.style.height = "110px";
    bird.style.width = "130px";
  } else if (difficulty === "Baby") {
    pipeSpeed = 2;
    bird.style.width = "20px";
    bird.style.height = "20px";
  } else if (difficulty === "flicker") {
    pipeSpeed = 5;
    bird.style.width = "90px";
    bird.style.height = "110px";
  }
}

const flapSound = new Audio("/assests/sound.mp3"); // temp
const scoreSound = new Audio("/assests/sound.mp3"); // temp
const hitSound = new Audio("/assests/sound.mp3"); // temp

// Load background music
const backgroundMusic = new Audio("/assests/sound.mp3"); // temp
backgroundMusic.loop = true; // music should keep playing
backgroundMusic.volume = 0.5; // adjust volume
backgroundMusic.play();

function updateBackgroungAvatar(score) {
  if (score >= 6 && score < 12) {
    game_container.style.background = "url(/assests/background_level.2.jpg) center center";
  } else if ((score = 12 && score < 18)) {
    game_container.style.background = "url(/assests/background_level.3.png) center center";
  } else if (score >= 18) {
    game_container.style.background = "url(/background_level 4.jpg) center center";
  } else {
    game_container.style.background = "url(/assests/background.jpg) center center";
  }
}
