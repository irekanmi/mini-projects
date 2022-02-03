const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let hue = 0;


const mouse = {
  x:undefined,
  y:undefined,
}


window.addEventListener('click',function(e){
  mouse.x = e.x;
  mouse.y = e.y;
  for(let i = 0;i<6;i++){
    particleArray.push(new Particle())
  }
})

window.addEventListener('mousemove',function(e){
  mouse.x = e.x;
  mouse.y = e.y;
  for(let i = 0;i<25;i++){
    particleArray.push(new Particle())
  }
})



class Particle{
  constructor(){
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 10 + 1;
    this.speedX = Math.random() * 3 - (3/2);
    this.speedY = Math.random() * 3 - (3/2);
    this.color = `hsl(${hue},100%,50%)`;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    // ctx.fillRect(this.x,this.y,this.size,this.size)
    ctx.fill();
  }
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.size > 0.2) this.size -= 0.1;
  }
}


function handleParticles(){
  for(let a =0;a<particleArray.length;a++){
    particleArray[a].draw();
    particleArray[a].update();
    // for(let b = a;b<particleArray.length;b++){
    //   let dx = particleArray[a].x - particleArray[b].x;
    //   let dy = particleArray[a].y - particleArray[b].y;
    //   let distance = Math.sqrt(dx*dx + dy*dy);
    //   if(distance<60){
    //     ctx.strokeStyle = particleArray[a].color;
    //     ctx.beginPath();
    //     ctx.moveTo(particleArray[a].x,particleArray[a].y);
    //     ctx.lineTo(particleArray[b].x,particleArray[b].y)
    //     ctx.stroke()
    //   }
    // }
    if(particleArray[a].size < 0.3){
      particleArray.splice(a,1);
      a--;
    }
    
  }
}


function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // ctx.fillStyle = 'rgba(0,0,0,0.1)';
  // ctx.fillRect(0,0,canvas.width,canvas.height)
  handleParticles()
  hue+=6
  requestAnimationFrame(animate)
}
animate()

function connect(){
  for(let a=0;a<particleArray.length;a++){
  
  }
}