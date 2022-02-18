const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
let numberOfresources = 300;
let frame = 0;
let enemyInterval = 600;
let gameOver = false;
let score = 0;
let winningScore = 20;

const resources = [];
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const floatingMessages = [];

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
  mouse.x = 10;
  mouse.y = 10;
});

// floating messages
class floatingMessage {
  constructor(value, x, y, size) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.color = `rgba(0,0,0,${this.opacity})`;
    this.life = 50;
    this.value = value;
    this.size = size;
  }
  update() {
    if (this.opacity > 0.01) {
      this.opacity -= 0.02;
    }
    this.life -= 0.5;
    this.y--;
  }
  draw() {
    ctx.font = `${this.size}px Arial`;
    ctx.fillStyle = this.color;
    ctx.fillText(this.value, this.x, this.y);
  }
}
function handleFloatingMessage() {
  for (let i = 0; i < floatingMessages.length; i++) {
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].life < 1) {
      floatingMessages.splice(i, 1);
      i--;
    }
  }
}

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
  } else {
    floatingMessages.push(
      new floatingMessage("Not enough resources", mouse.x, mouse.y, 20)
    );
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
        enemyPositions.splice(i, 1);
        console.log(enemyPositions);

        let gainedResources = enemies[i].total / 2;
        floatingMessages.push(
          new floatingMessage(gainedResources, enemies[i].x, enemies[i].y, 15)
        );
        floatingMessages.push(
          new floatingMessage(gainedResources, 100, 42, 25)
        );
        floatingMessages.push(
          new floatingMessage(gainedResources, 100, 72, 25)
        );
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
const amount = [20, 30, 40];

class Resources {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    this.amount = amount[Math.floor(Math.random() * amount.length)];
    this.finalY = Math.random() * 200 + 200;
  }
  update() {
    if (this.y < this.finalY) {
      this.y++;
    } else {
      this.y = this.finalY;
    }
  }
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.fillText(this.amount, this.x + 7, this.y + 15);
  }
}
function handleResources() {
  if (score > winningScore) {
    if (frame % 300 == 0) {
      resources.push(new Resources());
    }
  }
  for (let i = 0; i < resources.length; i++) {
    resources[i].update();
    resources[i].draw();
    if (resources[i] && collision(resources[i], mouse)) {
      numberOfresources += resources[i].amount;
      floatingMessages.push(
        new floatingMessage(
          resources[i].amount,
          resources[i].x,
          resources[i].y,
          10
        )
      );
      floatingMessages.push(
        new floatingMessage(resources[i].amount, 100, 42, 20)
      );
      floatingMessages.push(
        new floatingMessage(resources[i].amount, 100, 72, 20)
      );
      resources.splice(i, 1);
      i--;
    }
  }
}

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
    ctx.fillText("GAMEOVER", 235, 380);
  }
}

function animate() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleFloatingMessage();
  handleEnemies();
  handleProjectiles();
  handleGameGrid();
  handleGameStatus();
  handleDefenders();
  handleResources();
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
