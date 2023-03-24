"use strict";


// let nomeBemVido = window.prompt("Informe o seu nome para uma experiência mais personalizada!!");
let nomeBemVido;
const nomeP = document.querySelector("#h1-msg");
if (nomeBemVido == null || nomeBemVido == ""){
    nomeBemVido = 'Visitante';
}
nomeP.innerHTML += `, ${nomeBemVido}!`;

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

function criaItem(index, color){
  return {
    index,
    color
  };
}
let carrinhoQTD = 0;

let itensCarrinho = [];

function pegaContexto(index, color) {
  carrinhoQTD++;
  itensCarrinho.push(criaItem(index, color));
  console.log(itensCarrinho);
  console.log(carrinhoQTD);
  carrinho();
}

function carrinho (){
  let tx = 110; let ty = 60; let tz = 0;
  let rx = 1; let ry = 0; let rz = 0;
  let sx = 1; let sy = 1; let sz = 1;
  let index = 0;
  draw(tx, ty, tz, rx, ry, rz, sx, sy, sz, index);
}

function main() {

  drawBack();
  // for (let i = 0; i<10; i++){
  //   let name = `#canvas${i}`;
  //   let tx = 110; let ty = 60; let tz = 0;
  //   let rx = 5; let ry = 0; let rz = -5;
  //   let sx = 0.6; let sy = 0.6; let sz = 0.6;
  //   let index = i%5;
  //   let animation = true;
  //   draw1(i, name, tx, ty, tz, rx, ry, rz, sx, sy, sz, index, animation);
  // }
  for (let i = 0; i<5; i++){
    let nameItem = `#item-canvas${i}`;
    let tx = 550; let ty = 220; let tz = 0;
    let rx = 1; let ry = 0; let rz = 0;
    let sx = 1; let sy = 1; let sz = 1;
    let index = i%5;
    let animation = false;
    draw1(i, nameItem, tx, ty, tz, rx, ry, rz, sx, sy, sz, index, animation);
  }
  carrinho();
  

}

/*A chamada da função é feita passando:
O nome do canvas a ser desenhado;
O deslocamento em X, Y e Z;
A rotação em X, Y e Z;
A escala em X, Y e Z;
E um boleano se deve animar ou não (Talvez evolua para um inteiro para setar mais de um tipo de animação)
 */
function draw1(i, canvasName, tx, ty, tz, rx, ry, rz, sx, sy, sz, index, animation){
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
  let count = setGeometry(gl, index);      //ARRUMAR UM JEITO DE PASSAR ISSO POR PARÂMETRO, OU SELECIONAR POR PARÂMETRO

  var size = 3;          
  var type = gl.FLOAT;   
  var normalize = false; 
  var stride = 0;        
  var offset = 0;        
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl, index, 0);

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

  webglLessonsUI.setupSlider(`#x${i}`,      {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider(`#y${i}`,      {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#z${i}`,      {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#angleX${i}`, {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
  webglLessonsUI.setupSlider(`#angleY${i}`, {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
  webglLessonsUI.setupSlider(`#angleZ${i}`, {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
  webglLessonsUI.setupSlider(`#scaleX${i}`, {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleY${i}`, {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleZ${i}`, {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateRotation(index) {
    return function(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = degToRad(angleInDegrees);
      rotation[index] = angleInRadians;
      drawScene();
    };
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }
  
  var then = 0;

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
    //let count agora é o retorno da função setGeometry();
    gl.drawArrays(primitiveType, offset, count);
    
    if (animation){ // && mutex (setando ao final da execução e sendo desativado no boilerplate)
      rotation[1] += degToRad(1);
      matrix = m4.yRotate(matrix, rotation[1])
      requestAnimationFrame(drawScene);
    }

  }  
}


//================================================================================================
//Início do carrinho
//================================================================================================

function draw(tx, ty, tz, rx, ry, rz, sx, sy, sz, index){
  let canvas = document.querySelector(`#canvas-carrinho`);
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
  count = setGeometry(gl, index);      //ARRUMAR UM JEITO DE PASSAR ISSO POR PARÂMETRO, OU SELECIONAR POR PARÂMETRO

  var size = 3;          
  var type = gl.FLOAT;   
  var normalize = false; 
  var stride = 0;        
  var offset = 0;        
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl, index, 0);

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

  
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
  gl.enable(gl.CULL_FACE);
  
  for (let i = 0; i < carrinhoQTD; i++){
    count = setGeometry(gl, itensCarrinho[i].index); 
    var size = 3;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;        
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl, index, 0);
  
    gl.enableVertexAttribArray(colorAttributeLocation);
  
    var size = 3;          
    var type = gl.UNSIGNED_BYTE;   
    var normalize = true;  
    var stride = 0;        
    var offset = 0;        
    gl.vertexAttribPointer(
        colorAttributeLocation, size, type, normalize, stride, offset);

    drawScene();
    if (i%2 == 0){
      scale[0] = -1;
      translation[0] += 650;
    } else {
      scale[0] = 1;
      translation[0] -= 650;
      translation[1] += 160;
    }
  }   


  function drawScene() {
  
  
  
    gl.useProgram(program);
  
    gl.bindVertexArray(vao);
  
    var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    gl.drawArrays(primitiveType, offset, count);

  }  
}

//================================================================================================
//Fim do carrinho
//================================================================================================


function drawBack(){
  let canvas = document.querySelector(`#back`);
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
  let count = setGeometry(gl, 0);      //ARRUMAR UM JEITO DE PASSAR ISSO POR PARÂMETRO, OU SELECIONAR POR PARÂMETRO

  var size = 3;          
  var type = gl.FLOAT;   
  var normalize = false; 
  var stride = 0;        
  var offset = 0;        
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl, 0, 0);

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
  
  let translation = [0, 0, 0];
  let rotation = [degToRad(0), degToRad(0), degToRad(0)];
  let scale = [1, 1, 1];

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

    gl.drawArrays(primitiveType, offset, count);
    
      var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
    primitiveType = gl.TRIANGLES;
    offset = 0;


    gl.drawArrays(primitiveType, offset, count);
    
    if (translation[0] > (gl.canvas.clientWidth - 80) && translation[1] < (gl.canvas.clientHeight - 150)){
      move = 0;
    }
    if (translation[0] < 50 && translation[1] < 80){
      move = 1;
    }
    if (translation[0] < 50 && translation[1] > (gl.canvas.clientHeight - 150)){
      move = 3;
    }
    if (translation[0] > (gl.canvas.clientWidth - 80) && translation[1] > (gl.canvas.clientHeight - 150)){
      move = 2;
    }
    if (move == 0){
      translation[1] += speed;
    } else if (move == 1){
      translation[0] += speed;
    } else if (move == 2){
      translation[0] -= speed;
    } else{
      translation[1] -= speed;
    }
  
    rotation[1] += 0.01;
    rotation[0] += 0.005;
    rotation[2] += 0.3;
  
  
    requestAnimationFrame(drawScene);

  }  
}

let move = 0;
let speed = 5;
let turn = true;
main();