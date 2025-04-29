// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "start";

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
