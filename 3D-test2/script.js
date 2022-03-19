// ----------SETUP---------
const canvas = document.getElementById("canvas4");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

// ----------------------MATH----------------

// Vectors

class Vec3d {
  
  constructor(x,y,z,w = 1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static Vector_Mul(vecA,vecB){
    let val = new Vec3d();
    val.x = vecA.x * vecB.x;
    val.y = vecA.y * vecB.y;
    val.z = vecA.z * vecB.z;
    return val;
  }

  static Vector_Div(vecA,vecB){
    let val = new Vec3d();
    val.x = vecA.x / vecB.x;
    val.y = vecA.y / vecB.y;
    val.z = vecA.z / vecB.z;
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
    val.x = (vecA.z * vecB.y) - (vecA.y * vecB.z);
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
    for(let c =0;c<3;c++){
      for(let r = 0;r<3;r++){
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
    val.x = matrix.m[0][0] * vec.x + matrix.m[1][0] * vec.y + matrix.m[2][0] * vec.z + matrix.m[3][0] * vec.w;
    val.y = matrix.m[0][1] * vec.x + matrix.m[1][1] * vec.y + matrix.m[2][1] * vec.z + matrix.m[3][1] * vec.w;
    val.z = matrix.m[0][2] * vec.x + matrix.m[1][2] * vec.y + matrix.m[2][2] * vec.z + matrix.m[3][2] * vec.w;
    val.w = matrix.m[0][3] * vec.x + matrix.m[1][3] * vec.y + matrix.m[2][3] * vec.z + matrix.m[3][3] * vec.w;
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
    val.m[3][0] = x;
    val.m[3][1] = y;
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
    val.m[3][2] = -((fFar * fNear ) / fFar - fNear);
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
  constructor(){};

  #DrawTriangles(a,b,c){
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.closePath();
  ctx.stroke();
  }

  #FillTriangles(a,b,c){
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.closePath();
  ctx.fill();
  }

}


// -------------------------------------------------------INITIALIZATION-----------------------