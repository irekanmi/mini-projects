// Setup
const input = document.querySelector('#input');
const btn = document.querySelector('#btn');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 550;

// Variables
let text ='' || "Welcome";
let particleArray = [];
let adjustX = 10;
let adjustY = 8;
let hue = 0;
let vue = 0;
let textCoordinates

btn.addEventListener('click',function(e){
  text = input.value;
  // ctx.fillStyle = `hsl(${vue},100%,50%)`
ctx.font = '30px Verdana'
ctx.fillText(text,0,20);
textCoordinates = ctx.getImageData(0,0,100,100)
console.log(text);
init()
})



// handle mouse
const mouse ={
  x:undefined,
  y:undefined,
  radius:250
}
let canvasPosition = canvas.getBoundingClientRect()
window.addEventListener('mousemove', function(event){
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top
  
})

ctx.fillStyle = `hsl(${vue},100%,50%)`
ctx.font = '30px Verdana'
ctx.fillText(text,0,20)
ctx.strokeStyle = 'white'
// ctx.strokeRect(0,0,100,100)
textCoordinates = ctx.getImageData(0,0,100,100)

class Particle{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.size = 4;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 130) + 1;
    this.rad = 2;
    this.distance;
    this.fillStyle = `hsl(${hue},100%,50%)`;
  }
  draw(){
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI * this.rad );
    ctx.closePath();
    ctx.fill()
  }
  update(){
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.distance = distance
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) /maxDistance;
    let directionX = forceDirectionX * (force * this.density)
    let directionY = forceDirectionY * force * this.density;
    if(distance < mouse.radius ){
      this.fillStyle = `hsl(${vue},100%,50%)`;
    }else{
      this.fillStyle = `hsl(${vue},100%,50%)`;
    }
    if(distance < mouse.radius){
      this.x -= directionX;
      this.y -= directionY;
      
      
    }else{
      if(this.x !== this.baseX){
        let dx = this.x - this.baseX;
        this.x -= dx / 15
      }
      if(this.y !== this.baseY){
        let dy = this.y - this.baseY;
        this.y -= dy / 15 ;
      }
      
    }
  }
}

function init(){
  particleArray = [];
  for(let y = 0,y2=textCoordinates.height;y<y2;y++){
    for(let x=0,x2=textCoordinates.width;x<x2;x++){
      if(textCoordinates.data[(y *4*textCoordinates.width)+(x*4)+3]>128){
        let postionX = x + adjustX;
        let postionY = y + adjustY;
        particleArray.push(new Particle(postionX *10,postionY*10));
      }
    }
  }
}
init()
// console.log(particleArray);

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // ctx.fillStyle = 'rgba(0,0,0,0.60)';
  // ctx.fillRect(0,0,canvas.width,canvas.height);
  // ctx.fill()
  for(let i = 0;i < particleArray.length;i++){
    particleArray[i].draw()
    particleArray[i].update()
 
  }
  hue+=7;
  vue+=3
  connect()
  requestAnimationFrame(animate)
}
animate();

function connect(){
  for(let a=0;a<particleArray.length;a++){
    for(let b=a;b<particleArray.length;b++){
      let dx = particleArray[a].x -particleArray[b].x;
      let dy = particleArray[a].y -particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let mx = mouse.x - particleArray[a].x;
      let my = mouse.y - particleArray[a].y;
      let mDistance = Math.sqrt(mx * mx + my * my);


      if(distance<35 ){
        if(particleArray[a].distance < mouse.radius +  60){

          // ctx.strokeStyle = `hsl(${hue},100%,50%)`
          ctx.strokeStyle = 'yellow'
          ctx.lineWidth = 0.4;
          ctx.beginPath()
          ctx.moveTo(particleArray[a].x,particleArray[a].y);
          ctx.lineTo(particleArray[b].x,particleArray[b].y);
          ctx.stroke()
        }else{
          // ctx.strokeStyle = `hsl(${hue},100%,50%)`
          ctx.strokeStyle = `hsl(${hue},100%,50%)`
          ctx.lineWidth = 0.5;
          ctx.beginPath()
          ctx.moveTo(particleArray[a].x,particleArray[a].y);
          ctx.lineTo(particleArray[b].x,particleArray[b].y);
          ctx.stroke()
        }
        
        }
    
        
        
      
 
    }
  }
}
