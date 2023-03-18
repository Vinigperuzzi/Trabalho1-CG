"use strict";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

// the varied color passed from the vertex shader
in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = v_color;
}
`;


function createShader(gl, type, source){
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
      return shader;
  }
  console.log(gl.getShaderInfoLog(sha));
  gl.deleteShader(shader);
}
  
function createProgram(gl, vertexShader, fragmentShader){
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
      return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {

  for (let i = 0; i<10; i++){
    let name = `#canvas${i}`;
    let tx = 110; let ty = 60; let tz = 0;
    let rx = 5; let ry = 0; let rz = -5;
    let sx = 0.6; let sy = 0.6; let sz = 0.6;
    let animation = true;
    draw1(name, tx, ty, tz, rx, ry, rz, sx, sy, sz, animation);
  }
  for (let i = 0; i<5; i++){
    let nameItem = `#item-canvas${i}`;
    let tx = 550; let ty = 220; let tz = 0;
    let rx = 1; let ry = 0; let rz = 0;
    let sx = 1; let sy = 1; let sz = 1;
    let animation = false;
    draw1(nameItem, tx, ty, tz, rx, ry, rz, sx, sy, sz, animation);
  }

}

/*A chamada da função é feita passando:
O nome do canvas a ser desenhado;
O deslocamento em X, Y e Z;
A rotação em X, Y e Z;
A escala em X, Y e Z;
E um boleano se deve animar ou não (Talvez evolua para um inteiro para setar mais de um tipo de animação)
 */
function draw1(canvasName, tx, ty, tz, rx, ry, rz, sx, sy, sz,  animation){
  let canvas = document.querySelector(`${canvasName}`);
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  let program = createProgram(gl, vertexShader, fragmentShader);
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  let matrixLocation = gl.getUniformLocation(program, "u_matrix");
  let positionBuffer = gl.createBuffer();
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);      //ARRUMAR UM JEITO DE PASSAR ISSO POR PARÂMETRO, OU SELECIONAR POR PARÂMETRO

  var size = 3;          
  var type = gl.FLOAT;   
  var normalize = false; 
  var stride = 0;        
  var offset = 0;        
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  gl.enableVertexAttribArray(colorAttributeLocation);

  var size = 3;          
  var type = gl.UNSIGNED_BYTE;   
  var normalize = true;  
  var stride = 0;        
  var offset = 0;        
  gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }
  
  let translation = [tx, ty, tz];
  let rotation = [degToRad(rx), degToRad(ry), degToRad(rz)];
  let scale = [sx, sy, sz];

  drawScene();

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    gl.enable(gl.DEPTH_TEST);
  
    gl.enable(gl.CULL_FACE);
  
    gl.useProgram(program);
  
    gl.bindVertexArray(vao);
  
    var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
    
    if (animation){ // && mutex (setando ao final da execução e sendo desativado no boilerplate)
      rotation[1] += degToRad(1);
      matrix = m4.yRotate(matrix, rotation[1])
      requestAnimationFrame(drawScene);
    }

  }  
}


main();

