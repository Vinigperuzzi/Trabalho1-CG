"use strict";


// let nomeBemVido = window.prompt("Informe o seu nome para uma experiência mais personalizada!!");
let nomeBemVido;
const nomeP = document.querySelector("#h1-msg");
if (nomeBemVido == null || nomeBemVido == ""){
    nomeBemVido = 'Visitante';
}
nomeP.innerHTML += `, ${nomeBemVido}!`;



"use strict";

// This is not a full .obj parser.
// see http://paulbourke.net/dataformats/obj/

function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];
  const objColors = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
    objColors,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
    [],   // colors
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
  }

  function setGeometry() {
    if (!geometry) {
      const position = [];
      const texcoord = [];
      const normal = [];
      const color = [];
      webglVertexData = [
        position,
        texcoord,
        normal,
        color,
      ];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
          color,
        },
      };
      geometries.push(geometry);
    }
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
      // if this is the position index (index 0) and we parsed
      // vertex colors then copy the vertex colors to the webgl vertex color data
      if (i === 0 && objColors.length > 1) {
        geometry.data.color.push(...objColors[index]);
      }
    });
  }

  const keywords = {
    v(parts) {
      // if there are more than 3 values here they are vertex colors
      if (parts.length > 3) {
        objPositions.push(parts.slice(0, 3).map(parseFloat));
        objColors.push(parts.slice(3).map(parseFloat));
      } else {
        objPositions.push(parts.map(parseFloat));
      }
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,    // smoothing group
    mtllib(parts) {
      // the spec says there can be multiple file here
      // but I found one with a space in the filename
      materialLibs.push(parts.join(' '));
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry();
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove any arrays that have no entries.
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
        Object.entries(geometry.data).filter(([, array]) => array.length > 0));
  }

  return {
    geometries,
    materialLibs,
  };
}

function parseMapArgs(unparsedArgs) {
  // TODO: handle options
  return unparsedArgs;
}

function parseMTL(text) {
  const materials = {};
  let material;

  const keywords = {
    newmtl(parts, unparsedArgs) {
      material = {};
      materials[unparsedArgs] = material;
    },
    /* eslint brace-style:0 */
    Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
    Ka(parts)       { material.ambient        = parts.map(parseFloat); },
    Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
    Ks(parts)       { material.specular       = parts.map(parseFloat); },
    Ke(parts)       { material.emissive       = parts.map(parseFloat); },
    map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs(unparsedArgs); },
    map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs(unparsedArgs); },
    map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs(unparsedArgs); },
    Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
    d(parts)        { material.opacity        = parseFloat(parts[0]); },
    illum(parts)    { material.illum          = parseInt(parts[0]); },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return materials;
}

function makeIndexIterator(indices) {
  let ndx = 0;
  const fn = () => indices[ndx++];
  fn.reset = () => { ndx = 0; };
  fn.numElements = indices.length;
  return fn;
}

function makeUnindexedIterator(positions) {
  let ndx = 0;
  const fn = () => ndx++;
  fn.reset = () => { ndx = 0; };
  fn.numElements = positions.length / 3;
  return fn;
}

const subtractVector2 = (a, b) => a.map((v, ndx) => v - b[ndx]);

function generateTangents(position, texcoord, indices) {
  const getNextIndex = indices ? makeIndexIterator(indices) : makeUnindexedIterator(position);
  const numFaceVerts = getNextIndex.numElements;
  const numFaces = numFaceVerts / 3;

  const tangents = [];
  for (let i = 0; i < numFaces; ++i) {
    const n1 = getNextIndex();
    const n2 = getNextIndex();
    const n3 = getNextIndex();

    const p1 = position.slice(n1 * 3, n1 * 3 + 3);
    const p2 = position.slice(n2 * 3, n2 * 3 + 3);
    const p3 = position.slice(n3 * 3, n3 * 3 + 3);

    const uv1 = texcoord.slice(n1 * 2, n1 * 2 + 2);
    const uv2 = texcoord.slice(n2 * 2, n2 * 2 + 2);
    const uv3 = texcoord.slice(n3 * 2, n3 * 2 + 2);

    const dp12 = m4.subtractVectors(p2, p1);
    const dp13 = m4.subtractVectors(p3, p1);

    const duv12 = subtractVector2(uv2, uv1);
    const duv13 = subtractVector2(uv3, uv1);


    const f = 1.0 / (duv12[0] * duv13[1] - duv13[0] * duv12[1]);
    const tangent = Number.isFinite(f)
      ? m4.normalize(m4.scaleVector(m4.subtractVectors(
          m4.scaleVector(dp12, duv13[1]),
          m4.scaleVector(dp13, duv12[1]),
        ), f))
      : [1, 0, 0];

    tangents.push(...tangent, ...tangent, ...tangent);
  }

  return tangents;
}




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

  for (let i = 0; i<10; i++){
    let name = `#canvas${i}`;
    let tx = 110; let ty = 60; let tz = 0;
    let rx = 5; let ry = 0; let rz = -5;
    let sx = 0.6; let sy = 0.6; let sz = 0.6;
    let index = i%5;
    let animation = true;
    draw1(i, name, tx, ty, tz, rx, ry, rz, sx, sy, sz, index, animation);
  }
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

main();

