// Setup
const canvas = document.getElementById("canvas3");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("files");

const v = [];
const tri = [];

window.addEventListener("keypress",(key)=>{
  console.log(key);
},false)

fileInput.addEventListener("change",function(){
  const file = fileInput.files[0];

  const reader = new FileReader();


  reader.onload = function(){
    const value = reader.result;
    const f = value;
    const result1 = value.split( /\n/).map((line)=>{
      if(line[0] == 'v'){
        const point = line.split(' ');
        point.shift();
        v.push(new Point3d(Number(point[0]),Number(point[1]),Number(point[2])));
      }
    })
    // console.log(v);
    const result2 = f.split( /\n/).map((line)=>{
      if(line[0] == 'f'){
        const point = line.split(' ');
        point.shift();
        tri.push(new Triangle(v[Number(point[0]) - 1],v[Number(point[1]) - 1],v[Number(point[2]) - 1]));
      }
    })
      tri.sort(function(a,b){
      return ((a.p_1.z+a.p_2.z+a.p_3.z) ) - ((b.p_1.z+b.p_2.z+b.p_3.z) )
      })
    
  }

  reader.readAsText(file);
})


canvas.width = 900;
canvas.height = 600;
const mouse = {
  x:0,
  y:0
}
let lastX = 200;
let lastY = 150;
let mouseClick = false;
let mouseClickZ = false;

// File reader


// Point3d

class Point3d {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Triangle

class Triangle {
  constructor(p_1, p_2, p_3) {
    this.p_1 = p_1;
    this.p_2 = p_2;
    this.p_3 = p_3;
  }
}

// ---------------------- MATH -------------------

// Projection Matrix
let frame = 0;
let framesX = 1;
let framesZ = 1;
const matProj = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
const matRotX = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
const matRotZ = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

matRotZ[0][0] = Math.cos(framesZ);
matRotZ[0][1] = Math.sin(framesZ);
matRotZ[1][0] = -Math.sin(framesZ);
matRotZ[1][1] = Math.cos(framesZ);
matRotZ[2][2] = 1;
matRotZ[3][3] = 1;

matRotX[0][0] = 1;
matRotX[1][1] = Math.cos(framesX);;
matRotX[1][2] = Math.sin(framesX);
matRotX[2][1] = -Math.sin(framesX);
matRotX[2][2] = Math.cos(framesX);;
matRotX[3][3] = 1;



const fAspectRatio = canvas.height / canvas.width;
const fOv = 90;
const fFar = 1000;
const fNear = 0.1;
const fFOvRad = 1 / Math.tan((fOv*0.5) * 3.14159 / 180);

matProj[0][0] = fAspectRatio * fFOvRad;
matProj[1][1] = fFOvRad;
matProj[2][2] = fFar / (fFar - fNear);
matProj[2][3] = 1;
matProj[3][2] = -(fFar * fNear) / (fFar - fNear);

function MultiplyMatrix(mat,vec){
  let newPoint = new Point3d();
  newPoint.x = vec.x * mat[0][0] + vec.y * mat[1][0] + vec.z * mat[2][0] + mat[3][0];
  newPoint.y = vec.x * mat[0][1] + vec.y * mat[1][1] + vec.z * mat[2][1] + mat[3][1];
  newPoint.z = vec.x * mat[0][2] + vec.y * mat[1][2] + vec.z * mat[2][2] + mat[3][2];
  let w =  vec.x * mat[0][3] + vec.y * mat[1][3] + vec.z * mat[2][3] + mat[3][3];

  if(w != 0){
    newPoint.x /= w;
    newPoint.y /= w;
    newPoint.z /= w;
  }

  return newPoint;
}

function GetNormal(vecA,vecB){
  let norm = new Point3d();
  norm.x = vecA.y * vecB.z - vecA.z * vecB.y;
  norm.y = vecA.z * vecB.x - vecA.x * vecB.z;
  norm.z = vecA.x * vecB.y - vecA.y * vecB.x;

  return norm;

}

function DotProduct(vecA,vecB){
  let dp;
  dp = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z; 

  return dp;
}

function GetLength(vec){

  let len;
  len = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
  return len;
}


function DrawTriangle(a, b, c) {
  // const { a, b, c } = triangle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  // ctx.moveTo(a.x*(0.5*canvas.width), a.y*(0.5*canvas.height));
  // ctx.lineTo(b.x*(0.5*canvas.width), b.y*(0.5*canvas.height));
  // ctx.moveTo(b.x*(0.5*canvas.width), b.y*(0.5*canvas.height));
  // ctx.lineTo(c.x*(0.5*canvas.width), c.y*(0.5*canvas.height));
  // ctx.moveTo(c.x*(0.5*canvas.width), c.y*(0.5*canvas.height));
  // ctx.lineTo(a.x*(0.5*canvas.width), a.y*(0.5*canvas.height));
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
}

function randomNumGenerator(min, max) {
  let result;
  result = Math.random() * (max ) + (min / 2);
  return result;
}

canvas.addEventListener("mousemove",(e) =>{
  mouse.x = e.x;
  mouse.y = e.y;
  if(mouseClick){
    framesX += 0.015;

  }
  if(mouse.y > lastY){
    framesZ += 0.015
  }
  
})

canvas.addEventListener("mousedown",(e)=>{
  if(e.ctrlKey){
    mouseClickZ = true;
  }
  mouseClick = true;
})

canvas.addEventListener("mouseup",(e)=>{
  mouseClick = false;
  mouseClickZ = false;
})

// Sorting
//   tri.sort(function(a,b){
//   return ((a.p_1.z+a.p_2.z+a.p_3.z) / 3) - ((b.p_1.z+b.p_2.z+b.p_3.z) / 3)
// })

// Engine

class Engine {
  constructor() {
  }
  static DrawTriangles() {
    for (let i = 0; i < triangles.length; i++) {
      let triProjected = new Triangle();
      let triRotateZ = new Triangle();
      let triRotateZX = new Triangle();
      let triTranslated = new Triangle();

      triRotateZ.p_1 = MultiplyMatrix(matRotZ,triangles[i].p_1);
      triRotateZ.p_2 = MultiplyMatrix(matRotZ,triangles[i].p_2);
      triRotateZ.p_3 = MultiplyMatrix(matRotZ,triangles[i].p_3);

      triRotateZX.p_1 = MultiplyMatrix(matRotX,triRotateZ.p_1);
      triRotateZX.p_2 = MultiplyMatrix(matRotX,triRotateZ.p_2);
      triRotateZX.p_3 = MultiplyMatrix(matRotX,triRotateZ.p_3);

      triTranslated = triRotateZX;
      triTranslated.p_1.z = triRotateZX.p_1.z + 2.5;
      triTranslated.p_2.z = triRotateZX.p_2.z + 2.5;
      triTranslated.p_3.z = triRotateZX.p_3.z + 2.5;

      let line1 = new Point3d();
      let line2 = new Point3d();
      let norm = new Point3d();
      let lightDirection = new Point3d(0,0,-1);

      line1.x = triTranslated.p_2.x - triTranslated.p_1.x;
      line1.y = triTranslated.p_2.y - triTranslated.p_1.y;
      line1.z = triTranslated.p_2.z - triTranslated.p_1.z;

      line2.x = triTranslated.p_3.x - triTranslated.p_1.x;
      line2.y = triTranslated.p_3.y - triTranslated.p_1.y;
      line2.z = triTranslated.p_3.z - triTranslated.p_1.z;

      norm = GetNormal(line1,line2);
      let l = GetLength(norm);
      norm.x /= l;
      norm.y /= l;
      norm.z /= l;
      let lightl = GetLength(lightDirection);
      lightDirection.x /= lightl;
      lightDirection.y /= lightl;
      lightDirection.z /= lightl;

      let light_dp = DotProduct(norm,lightDirection);
      let norm_dp = DotProduct(norm,triTranslated.p_1);
      let vecColor = light_dp;
      // let vecColor = 0.4;
      if(vecColor <= 0){
        vecColor = 0.04;
      }
      let red = 225 * vecColor;
      let green = 190 * vecColor;
      let blue = 220 * vecColor;

      
      
      if(norm_dp < 0){
      triProjected.p_1 = MultiplyMatrix(matProj,triTranslated.p_1);
      triProjected.p_2 = MultiplyMatrix(matProj,triTranslated.p_2);
      triProjected.p_3 = MultiplyMatrix(matProj,triTranslated.p_3);
      
      triProjected.p_1.x += 1;
      triProjected.p_1.y += 1;
      
      triProjected.p_2.x += 1;
      triProjected.p_2.y += 1;
      
      triProjected.p_3.x += 1;
      triProjected.p_3.y += 1;

      triProjected.p_1.x *= 0.5 * (canvas.width);
      triProjected.p_1.y *= 0.5 * (canvas.height);

      triProjected.p_2.x *= 0.5 * (canvas.width);
      triProjected.p_2.y *= 0.5 * (canvas.height);

      triProjected.p_3.x *= 0.5 * (canvas.width);
      triProjected.p_3.y *= 0.5 * (canvas.height);


      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.strokeStyle = `rgb(${red},${green},${blue})`;
      // ctx.fillStyle = `rgba(255,255,255,${vecColor})`;
      // ctx.strokeStyle = `rgba(255,255,255,${vecColor})`;
      DrawTriangle(triProjected.p_1,triProjected.p_2,triProjected.p_3);
      }
    }
  }
}

// Initialzation



// testing

const points = [
  new Point3d(100, 200, 50),
  new Point3d(200, 300, 100),
  new Point3d(300, 400, 150),
];

const triangles = [
  
  // SOUTH
  new Triangle(
    new Point3d(0,0,0),
    new Point3d(0,1,0),
    new Point3d(1,1,0)
  ),
  new Triangle(
    new Point3d(0,0,0),
    new Point3d(1,1,0),
    new Point3d(1,0,0)
  ),

  // NORTH
  new Triangle(
    new Point3d(1,0,1),
    new Point3d(1,1,1),
    new Point3d(0,1,1)
  ),
  new Triangle(
    new Point3d(1,0,1),
    new Point3d(0,1,1),
    new Point3d(0,0,1)
  ),

  // TOP
  new Triangle(
    new Point3d(0,1,0),
    new Point3d(0,1,1),
    new Point3d(1,1,1)
  ),
  new Triangle(
    new Point3d(0,1,0),
    new Point3d(1,1,1),
    new Point3d(1,1,0)
  ),

  // BOTTOM
  new Triangle(
    new Point3d(1,0,1),
    new Point3d(0,0,1),
    new Point3d(0,0,0)
  ),
  new Triangle(
    new Point3d(1,0,1),
    new Point3d(0,0,0),
    new Point3d(1,0,0)
  ),

  // EAST
  new Triangle(
    new Point3d(1,0,0),
    new Point3d(1,1,0),
    new Point3d(1,1,1)
  ),
  new Triangle(
    new Point3d(1,0,0),
    new Point3d(1,1,1),
    new Point3d(1,0,1)
  ),

  // WEST
  new Triangle(
    new Point3d(0,0,1),
    new Point3d(0,1,1),
    new Point3d(0,1,0)
  ),
  new Triangle(
    new Point3d(0,0,1),
    new Point3d(0,1,0),
    new Point3d(0,0,0)
  )
];

let mat4 = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

mat4[3][0] = 4;
mat4[0][2] = 6;
mat4[0][3] = 5;
let z = mat4[0][0] *2;

console.log(mat4);
console.log(z);

console.log();
console.log(
  new Triangle(
    new Point3d(100, 200, 50),
    new Point3d(200, 300, 100),
    new Point3d(300, 400, 150)
  )
);

function animate(){
  // ctx.fillStyle = "rgba(0,0,0,0.6)"
  frame++;
  
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // ctx.fillRect(0,0,canvas.width,canvas.height);
    framesX += 0.015;
    framesZ += 0.015;
  

  
  matRotZ[0][0] = Math.cos(framesZ * 0.2);
  matRotZ[0][1] = Math.sin(framesZ * 0.2);
  matRotZ[1][0] = -Math.sin(framesZ * 0.2);
  matRotZ[1][1] = Math.cos(framesZ * 0.2);
  matRotZ[2][2] = 1;
  matRotZ[3][3] = 1;

  matRotX[0][0] = 1;
  matRotX[1][1] = Math.cos(framesX);;
  matRotX[1][2] = Math.sin(framesX);
  matRotX[2][1] = -Math.sin(framesX);
  matRotX[2][2] = Math.cos(framesX);;
  matRotX[3][3] = 1;

  Engine.DrawTriangles();
  // console.log(frames)
  
  requestAnimationFrame(animate)
}

animate();

// ctx.beginPath();
// ctx.moveTo(50,50);
// ctx.lineTo(randomNumGenerator(50,150),randomNumGenerator(100,170));
// ctx.lineTo(randomNumGenerator(50,150),randomNumGenerator(100,170));
// ctx.lineTo(50,50);
// // ctx.stroke();
// ctx.fill();
