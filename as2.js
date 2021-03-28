// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +

  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotationMatrix;\n' +

  'void main() {\n' +
  '  v_Color = a_Color;\n' +
  '  gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +

  'varying vec4 v_Color;\n' +

  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';


//global vars
let canvas;
let gl;
let a_Position;
let a_Color;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let vertexBuffer;

let FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;

function setupWebGL(){
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true, alpha: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  //enabling alpha
  gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

function setupBuffer(){
  // Create a buffer object
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
}

let g_animate = true;
let g_rotation = [0,0,0];
let g_tentacleAngle = 0;
let g_headAngle = 0;
let g_flapAngle = 0;

//connects the widgets from the HTML page to variables in js
function addActionsForHtmlUI(){
  document.getElementById('animateButton').onclick = function(){ g_animate = !g_animate; };
  //getting global rotation
  document.getElementById('xSlide').addEventListener('mousemove', function(){g_rotation[0] = this.value; });
  document.getElementById('ySlide').addEventListener('mousemove', function(){g_rotation[1] = this.value; });
  document.getElementById('zSlide').addEventListener('mousemove', function(){g_rotation[2] = this.value; });
  document.getElementById('tSlide').addEventListener('mousemove', function(){g_tentacleAngle = this.value/100; });
  document.getElementById('hSlide').addEventListener('mousemove', function(){g_headAngle = this.value; });
  document.getElementById('fSlide').addEventListener('mousemove', function(){g_flapAngle = this.value; });
}

//conecting the shaders to GLSL
function connectVariablesToGLSL(){
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //getting a_position from GLSL
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  //getting u_FragColor from GLSL
  a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (!a_Color) {
    console.log('Failed to get the storage location of a_Color');
    return;
  }

  //getting u_ModelMatrix from GLSL
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
  if (!u_GlobalRotationMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotationMatrix');
    return;
  }
}

let squids = [];
let squidsPos = [];

let color1 = [1.0, 0.4, 0.4, 1.0];
let color2 = [1.0, 0.80, 0.88, 1.0];

// let color1 = [57/100, 187/255, 122/255, 1.0];
// let color2 = [87/100, 217/255, 152/255, 1.0];

function main() {
  
  setupWebGL();
  setupBuffer();
  connectVariablesToGLSL();
  addActionsForHtmlUI();


  gl.clearColor(0.1, 0.1, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let s = new Squid();

  squids.push(s);
  squidsPos.push([0, 0, 0]);

  // let a = new Squid();
  // a.color1 = color3;
  // a.color2 = color4;

  // squids.push(a);
  // squidsPos.push([0, 0, 0]);

  update();

}


function update(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  
  renderScene();

  requestAnimationFrame(update);
}

//angle controls timing of tentacles, -0.03 to 1.0
let angle = 0;
let zRot = 0;
let sPos = 0;
let tPos = 0;
let hPos = 0;
let fPos = 0;
let globalRotationMatrix = new Matrix4();

function renderScene(){
  
  if(g_animate){
    tPos = 0.5 * Math.sin(2*angle) + 0.47;
    hPos = 5 * Math.sin(angle);
    fPos = 20 * Math.sin(2*angle);
    sPos += 0.005 / (Math.sin(2*angle) + 2);
    //zRot = 1 / (Math.sin(2*angle) + 2);

    if(sPos > 1.5){
      sPos = -1.5;
    }

    angle += 0.02;
    zRot += 0.5;
    zRot = zRot % 360;
  }

  for(let i = 0; i < squids.length; i++){
    squids[i].modelMatrix.setIdentity();
   
    if(g_animate){
      //squids[i].head.seg1RotMatrix.setIdentity();
      squids[i].head.seg1RotMatrix.setRotate(hPos, 0, 1, 0);
      squids[i].head.flapsRotMatrix.setRotate(fPos, 0, 0, 1);
      squids[i].translate(0, sPos, 0);
      squids[i].rotate(70, 0,zRot);
      squids[i].scale(0.5,0.5,0.5);
      squids[i].tentacleAngle = tPos;
    }else{
      squids[i].head.seg1RotMatrix.setRotate(g_headAngle, 0, 1, 0);
      squids[i].head.flapsRotMatrix.setRotate(g_flapAngle, 0, 0, 1);
      squids[i].translate(0, 0, 0);
      squids[i].rotate(g_rotation[0], g_rotation[1],g_rotation[2]);
      squids[i].rotate(90, 0, 0);
      squids[i].scale(1, 1, 1);
      squids[i].tentacleAngle = g_tentacleAngle;
    }
    
     //g_tentacleAngle;

    squids[i].update();
    squids[i].render();
    //updating the global rotation matrix
    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, globalRotationMatrix.elements);
  }
}

