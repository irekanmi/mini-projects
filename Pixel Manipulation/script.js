const dataImage = new Image();

dataImage.src = './pngfind.com-hamburger-png-501031.png'

console.log(dataImage.width, dataImage.height);

dataImage.addEventListener('load',function(e){
  let angle = 0;
  let frame = 0
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 613 ;
  canvas.height = 349 ;














  ctx.drawImage(dataImage,0,0);
  const pixels = ctx.getImageData(0,0,canvas.width ,canvas.height);
  ctx.clearRect(0,0,canvas.width,canvas.height)
  
  let numberOfParticles = 2500;
  let particleArray = [];
  let mappedImage = []

  for(let y=0;y<canvas.height;y++){
    let row =[];
    for(let x=0;x<canvas.width;x++){
      const red = pixels.data[(y * 4 * canvas.width) + (x * 4)]
      const green = pixels.data[(y * 4 * canvas.width) + (x * 4 + 1)]
      const blue = pixels.data[(y * 4 * canvas.width) + (x * 4 + 2)];
      const brightness = calculaterelativeBrightness(red,green,blue);
      const rgba = `rgba(${red},${green},${blue})`;
      const cell = [
        cellBrightness = brightness,
        color = rgba
      ];
      row.push(cell)
    }
    mappedImage.push(row)
  }
// console.log(mappedImage);

  function calculaterelativeBrightness(red,green,blue){
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) + 0.587 + 
      (blue * blue) * 0.114
    )/100;
  }



  class Particle{
    constructor(){
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.size = Math.random() * 1.5 + 1;
      this.velocity = Math.random() * 2.5 ;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.color = mappedImage[this.position1][this.position2][1];
    }
    update(){
      // this.x+= Math.sin(angle) *  + 10
      if(this.y > canvas.height ){
        this.y = 0;
        this.x = Math.random() * canvas.width
        this.velocity = Math.random() * 1.5
      }
      try {
        this.color = mappedImage[this.position1][this.position2][1];
        
      } catch (error) {
        console.log(error);
        this.color = 'rgb(255,255,255)'
      }

      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      try {
        
        this.speed = Number(mappedImage[this.position1][this.position2][0]);
      } catch (error) {
        this.speed = 1.7
        console.log(error);
      }
      let movement = (2.5 - this.speed) + this.velocity


      this.y+= movement;
    }
    draw(){
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
      ctx.fill();
    }
  }

  for(let i = 0;i<numberOfParticles;i++){
    particleArray.push(new Particle)
  }

  function animate(){
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // frame++;
    // if(frame%10 == 0){
    //   angle++

    // }
    // ctx.globalAlpha = 0.05
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    // ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    for(let i =0;i<particleArray.length;i++){
      particleArray[i].update();
      // ctx.globalAlpha = particleArray[i].speed * 0.5
      particleArray[i].draw();
    }
    requestAnimationFrame(animate)
  }
  animate()
})

const value =  Math.floor(0.5 + Math.ceil(-0.79) + Math.floor(0.54  + Math.ceil(-99.99)))  ;
console.log(value);