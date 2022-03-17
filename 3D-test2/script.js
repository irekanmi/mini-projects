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
        // val.m[r][c] = 
      }
    }
  }

}



// -------------------------------ENGINE--------------

// -------------------------------------------------------INITIALIZATION-----------------------