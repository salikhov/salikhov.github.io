let walls = [];
let numWalls = 0;

function genWall(position, height) {
  let wallHTML = "<div id='wall-" + numWalls + "' class='wall " + position + "' style='height: " + height + "px;'></div>";
  let wall = {id: numWalls, type: position, height: height, html: wallHTML};
  let body = document.getElementById("bod");
  body.innerHTML = wall.html + body.innerHTML;
  walls.push(wall);
  numWalls++;
}

function integrateWallVel(initialPos, speed, time) {
  return initialPos + -1 * speed * time;
}

function genRandomWallPair(difficulty) {
  let screenHeight = getScreenBounds()["h"]
  let maxRandHeight = screenHeight - difficulty;
  let bottomHeight = Math.floor(Math.random() * maxRandHeight);
  genWall("bottom", bottomHeight);
  genWall("top", screenHeight - difficulty - bottomHeight);
}
