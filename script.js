// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";
let pipes = [];
let pipe_gap = 250;

let gameInterval = null;

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
  math.floor(math.rabdom() * (game_container.offsetHeight - pipe_gap - 100)) + 
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

pipe_position.push(top_pipe, bottom_pipe);
}

// move pipes
function movePipes() {
  for (let pipe of pipe) {
    pipe.style.left = pipe.offsetleft - 3 + "px";

    //remove pipe off screan
    if (pipe.offsetleft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  //remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetleft + pipe.offsetWidth > 0);
}