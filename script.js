// sesion 2
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state= "start";





// sesion 2
let bird = decument. getElememtById("bird");
let score_display = decument. getElememtById("score");
let game_container = decument. getElememtById("game-container");
let start_btn = decument. getElememtById("start-btn");

function applyGravity() {
    bird_dy += gravity;
    let birdtop = bird.offsettop + bird_dy;
    birdtop = Math.max(birdtop, 0);
// iff (bird < 0) {birdtyop = o;}
birdtop = Math.min(birdtop,game_container.offsetHeight - bird.offsetHeight);

bird.style.top = birdtop + "px";
}