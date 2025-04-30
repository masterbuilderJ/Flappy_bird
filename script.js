// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let pipes = [];
let pipe_gap = 250;

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

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    ckeckCollision();
    frame++;
    if (frame % frame_time === 0)  {
      createpipe();
    }
  }, 10);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    bird_dy = -7;
  }
});

function onStartButtonClick() {
  if (game_state !== "Play") {
    game_syate = "Play";
    startGame();
  }
}


// greate pipe
function createpipe() {
  let pipe_position =
  Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) + 
  50;

  // top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

// bottom pipe
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
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}


function ckeckCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes){
    let pipeRect = pipe.getBoundingClientRect();
    
    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + pipeRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + pipeRect.height > pipeRect.top 

      
    ) {
      endGame();
      return;
    }
  }

  if(
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
  endGame();
  }

  pipes.forEach((pipe, index) => {
    if(index % 2 === 0) {

      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setscore(score + 1);
      }
    }
  });
}



function setscore(newScore) {
  score = newScore
  score_display.textContent = "Score: " + score;
}


function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;

  alert("GAME OVER! Your score: " + score);
  resetGame();
}

function resetGame() {
  bird.style.TOP = "50%";
  bird_dy = 0;
  for ( let pipe of pipe) {
    pipe.remove();
  }
  pipes = [];
  setscore(0);
  frame = 0;
  game_state = "start";
  score_display.textContent = "";
}