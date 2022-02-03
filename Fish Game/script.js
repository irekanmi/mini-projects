// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameOver = false;
ctx.font = '50px Georgia';


// Mouse interativity
const mouse = {
  x:canvas.width/2,
  y:canvas.height/2,
  click:false
}

const canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);

canvas.addEventListener('mousedown',function(e){
  mouse.click = true
  mouse.x = Math.floor(e.x - canvasPosition.left);
  mouse.y = Math.floor(e.y - canvasPosition.top);
  console.log(mouse.x,mouse.y);
})

canvas.addEventListener('mouseup',function(e){
  mouse.click = false
  mouse.x = Math.floor(e.x - canvasPosition.left);
  mouse.y = Math.floor(e.y - canvasPosition.top);
  console.log(mouse.x,mouse.y);
})
// canvas.addEventListener('mousemove',function(e){
//   mouse.click = true
//   mouse.x = Math.floor(e.x - canvasPosition.left);
//   mouse.y = Math.floor(e.y - canvasPosition.top);
//   console.log(mouse.x,mouse.y);
// })
// Player
class Player{
  constructor(){
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
  }
  update(){
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    // const distance = Math.sqrt(dx*dx+dy*dy);
    if(mouse.x != this.x){
      this.x-=dx/15
    }
    if(mouse.y != this.y){
      this.y-=dy/15
    }
  }
  draw(){
    if(mouse.click){
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.5
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(mouse.x,mouse.y);
      ctx.stroke()
    }
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }
}
const player = new Player()
// Bubbles
const bubblesArray = [];
class Bubble {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.size = 50;
    this.speed = Math.random() * 1.5;
    this.distance = 0;
    this.counted = false;
  }
  update(){
    this.y -= this.speed *3 ;
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx+dy*dy);
  }
  draw(){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
    ctx.fill()
  }
}


function handleBubble(){
  if(gameFrame%50 === 0){
    bubblesArray.push(new Bubble)
  }
  for(let i=0;i<bubblesArray.length;i++){
    bubblesArray[i].update();
    bubblesArray[i].draw();
    // console.log(bubblesArray[i].distance);
    if(bubblesArray[i].y < -bubblesArray[i].size){
      bubblesArray.splice(i,1);
      i--;
    }
    if(bubblesArray[i]){

      if(bubblesArray[i].distance < bubblesArray[i].size + player.radius){
        bubblesArray.splice(i,1);
        i--;
        score++
      }
    }
    
    // console.log(bubblesArray.length);
    
  }
  
}

// Enemy
class Enemy {
  constructor(){
    this.x = canvas.width + 200;
    this.y = Math.random() * canvas.height + 150;
    this.radius = 50;
    this.speed = 3;
    this.distance;
  }
  update(){
    this.x-=this.speed;
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx+dy*dy)
    if(this.x < -this.radius-50){
      this.x = canvas.width + 350;
      this.y = Math.random() * canvas.height +150;
    }
  }
  draw(){
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
    ctx.fill()
  }
}
const enemy = new Enemy();
function handleEnemy(){
  enemy.update();
  enemy.draw();
  if(enemy.distance < enemy.radius + player.radius){
    gameOver = true
  }
}

// Animation loop
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // ctx.fillStyle = 'rgba(0,0,0,0.2)';
  // ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = 'black'
  ctx.fillText(`score:${score}`,40,50)
  gameFrame++
  player.update();
  player.draw();
  handleEnemy()
  handleBubble();
  if(!gameOver)  requestAnimationFrame(animate)
}
animate()