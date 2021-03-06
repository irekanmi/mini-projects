// ----------SETUP---------
const canvas = document.getElementById("canvas4");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
let fYaw = 0;


window.addEventListener("keypress",(e)=>{
  // console.log(e.key);
  if(e.key == "q"){
    Engine.Vcamera.y += 0.2; 
    
    console.log(e.key);
  }
  if(e.key == "e"){
    Engine.Vcamera.y -= 0.2; 
    console.log(e.key);
  }
  if(e.key == "z"){
    Engine.Vcamera.x += 0.2; 
    
    console.log(e.key);
  }
  if(e.key == "c"){
    Engine.Vcamera.x -= 0.2; 
    console.log(e.key);
  }
  let vForw = Vec3d.Vector_Mul(Engine.VlookDir,0.022)
  if(e.key == "w"){
    Engine.Vcamera = Vec3d.Vector_Add(Engine.Vcamera,vForw); 
    console.log(e.key);
  }
  if(e.key == "s"){
    Engine.Vcamera = Vec3d.Vector_Sub(Engine.Vcamera,vForw); 
    console.log(e.key);
  }
  if(e.key == "a"){
    fYaw -= 0.01; 
    console.log(e.key);
  }
  if(e.key == "d"){
    fYaw += 0.01; 
    console.log(e.key);
  }
} ,false)

// -------------FUNTIONS-----------------

function randomNumGenerator(min, max) {
  let result;
  result = Math.random() * (max ) + (min / 2);
  return result;
}


function animate() {

  ftheta += 0.012;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  Engine.INIT();
  requestAnimationFrame(animate);
}


// ----------------------MATH----------------

// Vectors

class Vec3d {
  
  constructor(x,y,z,w=1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static Vector_Mul(vecA,num){
    let val = new Vec3d();
    val.x = vecA.x * num;
    val.y = vecA.y * num;
    val.z = vecA.z * num;
    return val;
  }

  static Vector_Div(vecA,num){
    let val = new Vec3d();
    val.x = vecA.x / num;
    val.y = vecA.y / num;
    val.z = vecA.z / num;
    val.w = vecA.w / num;
    return val;
  }

  static Vector_Sub(vecA,vecB){
    let val = new Vec3d();
    val.x = vecA.x - vecB.x;
    val.y = vecA.y - vecB.y;
    val.z = vecA.z - vecB.z;
    return val;
  }

  static Vector_Add(vecA,vecB){
    let val = new Vec3d();
    val.x = vecA.x + vecB.x;
    val.y = vecA.y + vecB.y;
    val.z = vecA.z + vecB.z;
    return val;
  }

  static Vector_Lenght(vec){
    let l = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
    return l;
  }

  static Vector_Dp(vecA,vecB){
    let dp;
    dp = vecA.x*vecB.x + vecA.y*vecB.y + vecA.z*vecB.z;
    return dp;
  }

  static Vector_Cross(vecA,vecB){
    let val = new Vec3d();
    val.x = (vecA.y * vecB.z) - (vecA.z * vecB.y);
    val.y = (vecA.z * vecB.x) - (vecA.x * vecB.z);
    val.z = (vecA.x * vecB.y) - (vecA.y * vecB.x);
    return val;
  }

  static Vector_Normalize(vec){
    let val = new Vec3d();
    let l = this.Vector_Lenght(vec);
    val.x = vec.x / l;
    val.y = vec.y / l;
    val.z = vec.z / l;
    return val;
  }


}

// Matrices

class Matrix {
  constructor(){
    this.m = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  }

  static Matrix_Mul(matA,matB){
    let val = new Matrix();
    for(let r =0;r<4;r++){
      for(let c = 0;c<4;c++){
        val.m[r][c] = matA.m[r][0] * matB.m[0][c] + matA.m[r][1] * matB.m[1][c] + matA.m[r][2] * matB.m[2][c] + matA.m[r][3] * matB.m[3][c];
      }
    }
    return val;
  }

  static Make_Identity(){
    let val = new Matrix();
    val.m[0][0] = 1;
    val.m[1][1] = 1;
    val.m[2][2] = 1;
    val.m[3][3] = 1;
    return val;
  }

  static Matrix_Mul_Vec(matrix,vec){
    let val = new Vec3d();
    val.x = matrix.m[0][0] * vec.x + matrix.m[1][0] * vec.y + matrix.m[2][0] * vec.z + matrix.m[3][0] * vec.w ;
    val.y = matrix.m[0][1] * vec.x + matrix.m[1][1] * vec.y + matrix.m[2][1] * vec.z + matrix.m[3][1] * vec.w ;
    val.z = matrix.m[0][2] * vec.x + matrix.m[1][2] * vec.y + matrix.m[2][2] * vec.z + matrix.m[3][2] * vec.w ;
    
    val.w =  matrix.m[0][3] * vec.x + matrix.m[1][3] * vec.y + matrix.m[2][3] * vec.z + matrix.m[3][3] * vec.w ;


    return val;
  }

  static Matrix_RotateZ(ftheta){
    let val = new Matrix();
    val.m[0][0] = Math.cos(ftheta);
    val.m[0][1] = Math.sin(ftheta);
    val.m[1][0] = -Math.sin(ftheta);
    val.m[1][1] = Math.cos(ftheta);
    val.m[2][2] = 1;
    val.m[3][3] = 1;
    return val;
  }

  static Matrix_RotateX(ftheta){
    let val = new Matrix();
    val.m[0][0] = 1;
    val.m[1][1] = Math.cos(ftheta);;
    val.m[1][2] = Math.sin(ftheta);
    val.m[2][1] = -Math.sin(ftheta);
    val.m[2][2] = Math.cos(ftheta);;
    val.m[3][3] = 1;
    return val;
  }

  static Matrix_RotateY(ftheta){
    let val = new Matrix();
    val.m[0][0] = Math.cos(ftheta);
    val.m[0][2] = Math.sin(ftheta);
    val.m[2][0] = -Math.sin(ftheta);
    val.m[1][1] = 1;
    val.m[2][2] = Math.cos(ftheta);;
    val.m[3][3] = 1;
    return val;
  } 

  static Matrix_Translation(x,y,z){
    let val = new Matrix();
    val.m[0][0] = 1;
    val.m[1][1] = 1;
    val.m[2][2] = 1;
    val.m[3][3] = 1;
    val.m[0][3] = x;
    val.m[1][3] = y;
    val.m[3][2] = z;
    return val;
  }

  static Make_Projection(fOv,fAspectratio,fFar,fNear){
    let val = new Matrix();
    const fFOvRad = 1 / Math.tan((fOv*0.5) * 3.14159 / 180);
    val.m[0][0] = fFOvRad * fAspectratio;
    val.m[1][1] = fFOvRad;
    val.m[2][2] = fFar / (fFar - fNear);
    val.m[2][3] = 1;
    val.m[3][2] = -(fFar * fNear ) / (fFar - fNear);
    return val;
  }

  static Matrix_PointAt(vecUp,vecTarget,vecPos){
    
    let newFow = Vec3d.Vector_Sub(vecPos,vecTarget);
    newFow = Vec3d.Vector_Normalize(newFow);

    let a = Vec3d.Vector_Mul(vecUp,Vec3d.Vector_Dp(vecUp,newFow));
    let newUp = Vec3d.Vector_Sub(a,vecUp);
    newUp = Vec3d.Vector_Normalize(newUp);

    let newRight = Vec3d.Vector_Cross(newUp,newFow);
    newRight = Vec3d.Vector_Normalize(newRight);

    let val = new Matrix();
    val.m[0][0] = newRight.x;
    val.m[0][1] = newRight.y;
    val.m[0][2] = newRight.z;
    val.m[0][3] = 0;

    val.m[1][0] = newUp.x;
    val.m[1][1] = newUp.y;
    val.m[1][2] = newUp.z;
    val.m[1][3] = 0;

    val.m[2][0] = newFow.x;
    val.m[2][1] = newFow.y;
    val.m[2][2] = newFow.z;
    val.m[2][3] = 0;

    val.m[3][0] = vecPos.x;
    val.m[3][1] = vecPos.y;
    val.m[3][2] = vecPos.z;
    val.m[3][3] = 1;

    return val;

  }

  static Matrix_Invert(mat){
    let val = new Matrix();
    val.m[0][0] = mat.m[0][0];
    val.m[0][1] = mat.m[1][0];
    val.m[0][2] = mat.m[2][0];
    val.m[0][3] = 0;

    val.m[1][0] = mat.m[0][1];
    val.m[1][1] = mat.m[1][1];
    val.m[1][2] = mat.m[2][1];
    val.m[1][3] = 0;

    val.m[2][0] = mat.m[0][2];
    val.m[2][1] = mat.m[1][2];
    val.m[2][2] = mat.m[2][2];
    val.m[2][3] = 0;

    val.m[3][0] = -(mat.m[3][0] * mat.m[0][0] + mat.m[3][1] * mat.m[0][1] + mat.m[3][2] * mat.m[0][2]);
    val.m[3][1] = -(mat.m[3][0] * mat.m[1][0] + mat.m[3][1] * mat.m[1][1] + mat.m[3][2] * mat.m[1][2]);
    val.m[3][2] = -(mat.m[3][0] * mat.m[2][0] + mat.m[3][1] * mat.m[2][1] + mat.m[3][2] * mat.m[2][2]);
    val.m[3][3] = 1;

    return val;

  }

}


// Triangle

class Triangle {
  constructor(p1,p2,p3){
    this.p = [p1,p2,p3];
  }
}


// Mesh

class Mesh {
  constructor(tri){
    this.m = [...tri];
  }

  Push_Back(val){
    this.m.push(val);
  }

}




// -------------------------------ENGINE---------------------


class Engine {
  constructor(){
  
    this.lightDir = new Vec3d(0,0,-1);
    this.fillStyle = "black";
    this.strokeStyle = "black";
  };
  static Vcamera = new Vec3d(0,0,0);
  static VlookDir;


  static DrawTriangles(a,b,c){
  ctx.strokeStyle = this.strokeStyle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.closePath();
  ctx.stroke();
  }

  static FillTriangles(a,b,c){
  ctx.fillStyle = this.fillStyle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.closePath();
  ctx.fill();
  }

  static INIT(){
    let matWorld = Matrix.Make_Identity();
    let matWorld2 ;
    let matRotZ = Matrix.Matrix_RotateZ(ftheta * 0.4);
    let matRotX = Matrix.Matrix_RotateX(ftheta * 0.6);
    let matProj = Matrix.Make_Projection(90,(canvas.height / canvas.width),1000,0.1);
    let matTrans = Matrix.Matrix_Translation(0,0,4);

    matWorld = Matrix.Matrix_Mul(matRotZ,matRotX);
    matWorld2 = Matrix.Matrix_Mul(matWorld,matTrans);
    for(let i = 0;i < BoxMesh.m.length;i++){
      let triTransformed = new Triangle();
      let triProjected = new Triangle();
      let triViewed = new Triangle();
      triTransformed.p[0] = Matrix.Matrix_Mul_Vec(matWorld2,BoxMesh.m[i].p[0]);
      triTransformed.p[1] = Matrix.Matrix_Mul_Vec(matWorld2,BoxMesh.m[i].p[1]);
      triTransformed.p[2] = Matrix.Matrix_Mul_Vec(matWorld2,BoxMesh.m[i].p[2]);


      let normal, line1, line2;
      line1 = Vec3d.Vector_Sub(triTransformed.p[1],triTransformed.p[0]);
      line2 = Vec3d.Vector_Sub(triTransformed.p[2],triTransformed.p[0]);

      normal = Vec3d.Vector_Cross(line1,line2);
      normal = Vec3d.Vector_Normalize(normal);
      // this.Vcamera = new Vec3d(0,0,0);
      let Vtarget = new Vec3d(0,0,1);
      let Vup = new Vec3d(0,1,0);
      let matRotY = Matrix.Matrix_RotateY(fYaw);
      this.VlookDir = Matrix.Matrix_Mul_Vec(matRotY,Vtarget);
      Vtarget = Vec3d.Vector_Add(this.Vcamera,this.VlookDir);


      let matCam = Matrix.Matrix_PointAt(Vup,Vtarget,this.Vcamera);

      let matView = Matrix.Matrix_Invert(matCam);

      let camera = Vec3d.Vector_Sub(triTransformed.p[0],this.Vcamera);

      let viewdp = Vec3d.Vector_Dp(normal,camera);

      if( viewdp < 0 ){
        let lightDir = new Vec3d(0,0,-1);
        lightDir = Vec3d.Vector_Normalize(lightDir);

        let lightdp = Math.max(0.03,Vec3d.Vector_Dp(normal,lightDir));
        let red = 0 * lightdp;
        let blue = 255 * lightdp;
        let green = 255 * lightdp;
        this.fillStyle = `rgb(${red},${green},${blue})`;
        this.strokeStyle = `rgb(${red},${green},${blue})`;

        triViewed.p[0] = Matrix.Matrix_Mul_Vec(matView,triTransformed.p[0]);
        triViewed.p[1] = Matrix.Matrix_Mul_Vec(matView,triTransformed.p[1]);
        triViewed.p[2] = Matrix.Matrix_Mul_Vec(matView,triTransformed.p[2]);

        triProjected.p[0] = Matrix.Matrix_Mul_Vec(matProj,triViewed.p[0]);
        triProjected.p[1] = Matrix.Matrix_Mul_Vec(matProj,triViewed.p[1]);
        triProjected.p[2] = Matrix.Matrix_Mul_Vec(matProj,triViewed.p[2]);

        if(triProjected.p[0].w != 0){
          triProjected.p[0] = Vec3d.Vector_Div(triProjected.p[0], triProjected.p[0].w);
        }
        if(triProjected.p[1].w != 0){
          triProjected.p[1] = Vec3d.Vector_Div(triProjected.p[1], triProjected.p[1].w);
        }
        if(triProjected.p[2].w != 0){
          triProjected.p[2] = Vec3d.Vector_Div(triProjected.p[2], triProjected.p[2].w);
        }


        let vOffset = new Vec3d(1,1,0);
        triProjected.p[0] = Vec3d.Vector_Add(triProjected.p[0],vOffset);
        triProjected.p[1] = Vec3d.Vector_Add(triProjected.p[1],vOffset);
        triProjected.p[2] = Vec3d.Vector_Add(triProjected.p[2],vOffset);

      triProjected.p[0].x *= (0.5 * (canvas.width));
      triProjected.p[0].y *= (0.5 * (canvas.height));
      triProjected.p[1].x *= (0.5 * (canvas.width));
      triProjected.p[1].y *= (0.5 * (canvas.height));
      triProjected.p[2].x *= (0.5 * (canvas.width));
      triProjected.p[2].y *= (0.5 * (canvas.height));

      this.DrawTriangles(triProjected.p[0],triProjected.p[1],triProjected.p[2]);
      this.FillTriangles(triProjected.p[0],triProjected.p[1],triProjected.p[2]);


      }

    }

  }

}


// -------------------------------------------------------INITIALIZATION--------------------------

const box = [

    // SOUTH
    new Triangle(
      new Vec3d(0,0,0),
      new Vec3d(0,1,0),
      new Vec3d(1,1,0)
    ),
    new Triangle(
      new Vec3d(0,0,0),
      new Vec3d(1,1,0),
      new Vec3d(1,0,0)
    ),
  
    // NORTH
    new Triangle(
      new Vec3d(1,0,1),
      new Vec3d(1,1,1),
      new Vec3d(0,1,1)
    ),
    new Triangle(
      new Vec3d(1,0,1),
      new Vec3d(0,1,1),
      new Vec3d(0,0,1)
    ),
  
    // TOP
    new Triangle(
      new Vec3d(0,1,0),
      new Vec3d(0,1,1),
      new Vec3d(1,1,1)
    ),
    new Triangle(
      new Vec3d(0,1,0),
      new Vec3d(1,1,1),
      new Vec3d(1,1,0)
    ),
  
    // BOTTOM
    new Triangle(
      new Vec3d(1,0,1),
      new Vec3d(0,0,1),
      new Vec3d(0,0,0)
    ),
    new Triangle(
      new Vec3d(1,0,1),
      new Vec3d(0,0,0),
      new Vec3d(1,0,0)
    ),
  
    // EAST
    new Triangle(
      new Vec3d(1,0,0),
      new Vec3d(1,1,0),
      new Vec3d(1,1,1)
    ),
    new Triangle(
      new Vec3d(1,0,0),
      new Vec3d(1,1,1),
      new Vec3d(1,0,1)
    ),
  
    // WEST
    new Triangle(
      new Vec3d(0,0,1),
      new Vec3d(0,1,1),
      new Vec3d(0,1,0)
    ),
    new Triangle(
      new Vec3d(0,0,1),
      new Vec3d(0,1,0),
      new Vec3d(0,0,0)
    )


];
const BoxMesh = new Mesh(box);
let ftheta = 0;

animate();
// let matA = new Matrix();

// matA.m[0][0] = 1;
// matA.m[0][1] = 2
// matA.m[0][2] = 3
// matA.m[0][3] = 4
// matA.m[1][0] = 5
// matA.m[1][1] = 6
// matA.m[1][2] = 7
// matA.m[1][3] = 8

// console.log(matA);
// let matB = new Matrix();

// matB.m[0][0] = 1;
// matB.m[0][1] = 2
// matB.m[0][2] = 3
// matB.m[0][3] = 4
// matB.m[1][0] = 5
// matB.m[1][1] = 6
// matB.m[1][2] = 7
// matB.m[1][3] = 8

// console.log(matB);

// console.log(Matrix.Matrix_Mul(matA,matB));