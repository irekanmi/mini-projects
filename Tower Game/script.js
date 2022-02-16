const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
let numberOfresources = 1000;
let frame = 0;
let enemyInterval = 600;
let gameOver = false;
let score = 0;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
};
let canvasPosition = canvas.getBoundingClientRect();

canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener("mouseleave", function (e) {
  mouse.x = undefined;
  mouse.y = undefined;
});

// game board
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }
  draw() {
    if (collision(this, mouse)) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
function createGrid() {
  for (let y = 100; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      gameGrid.push(new Cell(x, y));
    }
  }
}
createGrid();

function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
  // gameGrid.forEach(function(grid){
  //   grid.draw()
  // })
}

// projectiles
class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;
  }
  update() {
    this.x += this.speed;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    ctx.fill();
  }
}
function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();
    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

// defenders
class Defender {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.health = 100;
    this.projectiles = [];
    this.shooting = false;
    this.timer = 0;
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30);
  }
  update() {
    if (this.shooting) {
      this.timer++;
      if (this.timer % 100 == 0) {
        projectiles.push(new Projectile(this.x + 70, this.y + 50));
      }
    } else {
      this.timer = 0;
    }
  }
}

canvas.addEventListener("click", function (e) {
  const gridPostionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPostionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (gridPostionY < cellSize) {
    return;
  }
  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x == gridPostionX && defenders[i].y == gridPostionY) {
      return;
    }
  }
  let defendersCost = 100;
  if (numberOfresources >= defendersCost) {
    defenders.push(new Defender(gridPostionX, gridPostionY));
    numberOfresources -= defendersCost;
  }
});

function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].draw();
    defenders[i].update();
    if (enemyPositions.indexOf(defenders[i].y) !== -1) {
      defenders[i].shooting = true;
    }
    if (enemyPositions.indexOf(defenders[i].y) === -1) {
      defenders[i].shooting = false;
    }
    for (let j = 0; j < enemies.length; j++) {
      if (defenders[i] && enemies[j] && collision(defenders[i], enemies[j])) {
        enemies[j].movement = 0;
        defenders[i].health -= 0.5;
      }
      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}

// enemies
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.total = this.health;
  }
  update() {
    this.x -= this.movement;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30);
  }
}
function handleEnemies() {
  if (frame % enemyInterval === 0) {
    let verticalPosition =
      Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemyPositions.push(verticalPosition);
    console.log(enemyPositions);
    if (enemyInterval > 170) {
      enemyInterval -= 25;
    }
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    for (let j = 0; j < projectiles.length; j++) {
      if (enemies[i] && enemies[i].health <= 0) {
        let findIndex = enemies.indexOf(enemies[i].y);
        enemyPositions.splice(i, 1);
        console.log(enemyPositions);

        let gainedResources = enemies[i].total / 2;
        enemies.splice(i, 1);
        i--;
        numberOfresources += gainedResources;
        score += gainedResources;
      }
      if (
        enemies[i] &&
        projectiles[j] &&
        collision(enemies[i], projectiles[j])
      ) {
        enemies[i].health -= projectiles[j].power;
        projectiles.splice(j, 1);
      }
    }
    if (enemies[i] && enemies[i].x < 0) {
      gameOver = true;
    }
  }
}

// resources
// utilites
function handleGameStatus() {
  ctx.fillStyle = "gold";
  ctx.font = "27px Arial";
  ctx.fillText(`Resources: ${numberOfresources}`, 40, 42);
  ctx.fillText(`Score: ${score}`, 40, 72);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(0, cellSize);
  ctx.lineTo(canvas.width, cellSize);
  ctx.stroke();
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "90px sans-serif";
    ctx.fillText("GAMEOVER", 295, 380);
  }
}

function animate() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleEnemies();
  handleProjectiles();
  handleGameGrid();
  handleGameStatus();
  handleDefenders();
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}
animate();

function collision(first, second) {
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
}
