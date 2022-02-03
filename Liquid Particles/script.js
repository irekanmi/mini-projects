// Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



let hue = 0;
const mouse = {
  x:undefined,
  y:undefined
}
let particleArray = [];

window.addEventListener('resize',function(e){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


canvas.addEventListener('mousemove',function(e){
  mouse.x = e.x;
  mouse.y = e.y;
    console.log(particleArray.length);
  for(let i = 0;i<=1;i++){
    particleArray.push(new Particle())
  }
})

// Particle Setup
class Particle{
  constructor(){
    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = Math.floor(31 - Math.random() * 30 );
    this.speed = 5 - Math.random() * 4  ;
    this.rad =  2;
    this.color = 'red' || `hsl(${hue},100%,50%)`
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI * this.rad);
    ctx.fill()
  }
  update(){
    // if(this.speed < 5){
    //   this.speed = 6
    // } 
    this.y+=this.speed;
    // if(this.y < canvas.height - 200){
    //   this.y+=this.speed;
    // }else{
    //   this.y = canvas.height - 200

    // }
  }
}
function handleParticles(){
  for(let i=0;i<particleArray.length;i++){
    particleArray[i].update();
    particleArray[i].draw();

    if(particleArray[i].y > canvas.height + particleArray[i].radius || particleArray[i].y < -particleArray[i].radius){
      particleArray.splice(i,1);
      i--;
    }
  }
  
}

// Animation Loop

// setInterval(()=>{
//   particleArray.shift()
// },30)


function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  // ctx.fillStyle = 'rgba(255,255,255,0.06)'
  // ctx.fillRect(0,0,canvas.width,canvas.height)
  handleParticles();
  hue++;
  requestAnimationFrame(animate);
}
animate()