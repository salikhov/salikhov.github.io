const MOVE_SPEED = 500; // pixels per second
const TICKS_PER_SECOND = 200;
const PIXELS_PER_TICK = MOVE_SPEED / TICKS_PER_SECOND;
const MILLIS_PER_TICK = 1000 / TICKS_PER_SECOND;
const UP_ARROW_VEL = 300;
const GRAVITY = 500; // pixels per second per second
const FLAPPY_INITIAL_POSITION = 50;
const SCORE_MULTIPLIER = 0.125;
const WALL_GEN_INTERVAL = 2000; // walls period in milliseconds
const WALL_WIDTH = 100;
const FLAPPY_POS_X = 100;
const FLAPPY_SIZE = 75;
const GAP_DECREASE_PER_SECOND = 50 / 60; //pixels per second
const GAP_DECREASE_PER_TICK = GAP_DECREASE_PER_SECOND / TICKS_PER_SECOND;
const WALL_DIFF_INITIAL = 300;

let intervals = [];

let wallDifficulty = WALL_DIFF_INITIAL;
let initialized = false;
let running = false;
let posY = FLAPPY_INITIAL_POSITION;
let velY = 0;
let score = 0;

function processClick() {
  if (initialized) {
    if (!running) {
      reset();
      initialize();
    }
  } else {
    initialize();
  }
}

function initialize() {
  setTitle("", "");
  intervals.push(setInterval(tick, MILLIS_PER_TICK));
  window.onkeydown = function(e) {
    if (e.keyCode === 38) {
      velY = -1 * UP_ARROW_VEL;
    }
    if (e.keyCode === 80) {
      triggerPause();
      console.log("P");
    }
  };
  intervals.push(setInterval(wallGenerator, WALL_GEN_INTERVAL));
  initialized = true;
  running = true;
}

function triggerPause() {
  if (running) {
    for (let i = 0; i < intervals.length; i++) {
      clearInterval(intervals[i]);
    }
    running = false;
  } else {
    intervals.push(setInterval(tick, MILLIS_PER_TICK));
    intervals.push(setInterval(wallGenerator, WALL_GEN_INTERVAL));
    running = true;
  }
}

function setTitle(heading, subheading) {
  let headingElem = document.getElementById("heading-title");
  let subheadingElem = document.getElementById("subheading");
  headingElem.innerHTML = heading;
  subheadingElem.innerHTML = subheading;
}

function reset() {
  posY = FLAPPY_INITIAL_POSITION;
  velY = 0;
  setElementPosY(document.getElementById("flappy"), posY);
  for (let i = 0; i < walls.length; i++) {
    let wall = document.getElementById("wall-" + walls[i].id);
    wall.outerHTML = "";
    delete wall;
  }
  walls = []
  numWalls = 0;
  score = 0;
  setScore(0);
  initialized = false;
  wallDifficulty = WALL_DIFF_INITIAL;
}

function stop() {
  running = false;
  for (let i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  setTitle("Game Over!", "Click anywhere or press any key to restart...");
}

function tick() {
  updateFlappyPos();
  updateWallsPos();
  checkBounds();
  increaseDifficulty();
  checkWallCollision();
  cleanUpWalls();
  updateScore();
}

function increaseDifficulty() {
  if (wallDifficulty > 175) {
    wallDifficulty = wallDifficulty - GAP_DECREASE_PER_TICK;
  }
}

function updateFlappyPos() {
  velY = integrateGravity(velY, MILLIS_PER_TICK / 1000, GRAVITY);
  posY = integrateGravityVel(posY, velY, MILLIS_PER_TICK / 1000);
  setElementPosY(document.getElementById("flappy"), posY);
}

function updateWallsPos() {
  for (let i = 0; i < walls.length; i++) {
    let wallElement = document.getElementById("wall-" + walls[i].id);
    posX = integrateWallVel(getElementPos(wallElement)["x"], PIXELS_PER_TICK, 1);
    setElementPosX(wallElement, posX);
  }
}

function updateScore() {
  score += SCORE_MULTIPLIER;
  setScore(Math.round(score));
}

function checkWallCollision() {
  let rightX = FLAPPY_POS_X + FLAPPY_SIZE;
  let botY = posY + FLAPPY_SIZE;
  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    let wallElement = document.getElementById("wall-" +  wall.id);
    let wallPos = getElementPos(wallElement);
    let leftOfWall = wallPos.x;
    let rightOfWall = leftOfWall + WALL_WIDTH;
    let withinXOfWall = (rightX >= leftOfWall && rightX <= rightOfWall) || (FLAPPY_POS_X >= leftOfWall && FLAPPY_POS_X <= rightOfWall);
    if (wall.type === "top") {
      let bottomOfWall = wall.height;
      if (posY <= bottomOfWall && withinXOfWall) {
        stop();
      }
    } else {
      let screenHeight = getScreenBounds().h;
      let topOfWall = screenHeight - wall.height;
      if (botY >= topOfWall && withinXOfWall) {
        stop();
      }
    }
  }
}

function cleanUpWalls() {
  for (let i = 0; i < walls.length; i++) {
    let wallElement = document.getElementById("wall-" + walls[i].id);
    let leftOfWall = getElementPos(wallElement).x;
    if (leftOfWall + WALL_WIDTH < 0) {
      document.getElementById("bod").removeChild(wallElement);
      walls.shift();
    }
  }
}

function wallGenerator() {
  genRandomWallPair(wallDifficulty);
}

function setScore(score) {
  let scoreElement = document.getElementById("score");
  scoreElement.innerHTML = score;
}

function getScreenBounds() {
  return {
    w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }
}

function checkBounds() {
  if (posY < 0 || (posY + 80) > getScreenBounds()["h"]) {
    stop();
  }
}

function setElementPosX(element, x) {
  element.style.left = x + "px";
}

function setElementPosY(element, y) {
  element.style.top = y + "px";
}

function getElementPos(element) {
  element = element.getBoundingClientRect();
  return {
    x: element.left + window.scrollX,
    y: element.top + window.scrollY
  };
}
