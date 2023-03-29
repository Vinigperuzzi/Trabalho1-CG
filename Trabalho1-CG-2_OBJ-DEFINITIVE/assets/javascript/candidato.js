"use strict";

let nomeBemVido = window.prompt("Informe o seu nome para uma experiência mais personalizada!!");
// let nomeBemVido;
const nomeP = document.querySelector("#h1-msg");
if (nomeBemVido == null || nomeBemVido == ""){
  nomeBemVido = 'Visitante';
}
nomeP.innerHTML += `, ${nomeBemVido}!`;

let audio = new Audio('assets/audio/audio.mp3');
let boraAudio;
let tocando = false;

function playAudio(){
  if (!tocando){
    audio.play();
    tocando = true;
  } else {
    audio.pause();
    audio.currentTime = 0;
    tocando = false;
  }
}


function criaItem(obj, texture){
  return {
    obj,
    texture
  };
}
let carrinhoQTD = 0;
let itensCarrinho = [];

function pegaContexto(obj, index) {
  carrinhoQTD++;
  itensCarrinho.push(criaItem(obj, texturaGlobal[index]));
  console.log(itensCarrinho);
  console.log(carrinhoQTD);
  carrinho();
}

function carrinho(){
  // for (let i = 0; i<carrinhoQTD; i++){
  //   draw2("#canvas-carrinho", itensCarrinho[i].obj, itensCarrinho[i].texture, 0, [1, 1, 1], i, false, i*3);
  // }
  drawCar();
}

let texturaGlobal = ["assets/obj/airplane1/apA.png",
                  "assets/obj/airplane2/jpA.png",
                  "assets/obj/costerGuard/hcA.png",
                  "assets/obj/fighter/fgtA.png",
                  "assets/obj/Heli3/Mi28A.png"];


function atualizaTextura(canvas, obj, textura, index, rot, esc){
  texturaGlobal[index] = textura;
  draw(canvas, obj, texturaGlobal[index], rot, esc, index, false);
}

let mutex = false;

function main(){
  itensCarrinho.push(criaItem("assets/obj/chao/heliport.obj", "assets/obj/chao/heliport.png"));
  carrinhoQTD++;
  boraAudio = window.confirm("Vai uma musiquinha??");
  if (boraAudio){
    playAudio();
  }
  for (let i = 0; i<0; i++){
    let name = `#canvas${i}`;
    let objPath;
    let pngPath;
    let orientation;
    let initialScale = [1, 1, 1];
    let animate = true;
    switch (i%5){
      case 0: objPath = "assets/obj/airplane1/ap.obj";
              pngPath = "assets/obj/airplane1/apA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
              pngPath = "assets/obj/airplane2/jpA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
              pngPath = "assets/obj/costerGuard/hcA.png";
              orientation = 270;
              initialScale = [0.001, 0.001, 0.001];
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
              pngPath = "assets/obj/fighter/fgtA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 4: objPath = "assets/obj/Heli3/Mi28.obj";
              pngPath = "assets/obj/Heli3/Mi28A.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      default:  objPath = "assets/obj/Heli3/Mi28.obj";
                pngPath = "assets/obj/Heli3/Mi28A.png";
                orientation = 0;
                initialScale = [1, 1, 1];
      break;
    }
    draw(name, objPath, pngPath, orientation, initialScale, i, animate);
  }
  for (let i = 3; i<4; i++){
    let nameItem = `#item-canvas${i}`;
    let objPath;
    let pngPath;
    let orientation;
    let initialScale = [1, 1, 1];
    let animate = false;
    switch (i%5){
      case 0: objPath = "assets/obj/airplane1/ap.obj";
              pngPath = "assets/obj/airplane1/apA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
              pngPath = "assets/obj/airplane2/jpA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
              pngPath = "assets/obj/costerGuard/hcA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
              pngPath = "assets/obj/fighter/fgtA.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      case 4: objPath = "assets/obj/Heli3/Mi28.obj";
              pngPath = "assets/obj/Heli3/Mi28A.png";
              orientation = 0;
              initialScale = [1, 1, 1];
      break;
      default:  objPath = "assets/obj/Heli3/Mi28.obj";
                pngPath = "assets/obj/Heli3/Mi28A.png";
                orientation = 0;
                initialScale = [1, 1, 1];
      break;
    }
    draw(nameItem, objPath, pngPath, orientation, initialScale, i, animate);
  }
  carrinho();
}


async function draw(name, objPath, pngPath, orientation, initialScale, i, animate) {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector(name);     //Passar isso por parâmetro
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Tell the twgl to match position with a_position etc..
  twgl.setAttributePrefix("a_");

  // compiles and links the shaders, looks up attribute and uniform locations
  const meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const response = await fetch(objPath);
  const text = await response.text();
  const obj = parseOBJ(text);

  const parts = obj.geometries.map(({data}) => {

    // create a buffer for each array by calling
    // gl.createBuffer, gl.bindBuffer, gl.bufferData
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
    const vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);
    return {
      material: {
        u_diffuse: [Math.random(), Math.random(), Math.random(), 1],
      },
      bufferInfo,
      vao,
    };
  });

  function getExtents(positions) {
    const min = positions.slice(0, 3);
    const max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
      for (let j = 0; j < 3; ++j) {
        const v = positions[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }
    return {min, max};
  }

  function getGeometriesExtents(geometries) {
    return geometries.reduce(({min, max}, {data}) => {
      const minMax = getExtents(data.position);
      return {
        min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
        max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
      };
    }, {
      min: Array(3).fill(Number.POSITIVE_INFINITY),
      max: Array(3).fill(Number.NEGATIVE_INFINITY),
    });
  }

  const extents = getGeometriesExtents(obj.geometries);
  const range = m4.subtractVectors(extents.max, extents.min);
  // amount to move the object so its center is at the origin
  const objOffset = m4.scaleVector(
      m4.addVectors(
        extents.min,
        m4.scaleVector(range, 0.5)),
      -1);

  //Preparation to draw it//

  //Set da camera//
  const cameraTarget = [0, 0, 0];
  // figure out how far away to move the camera so we can likely
  // see the object.
  const radius = m4.length(range) * 1.2;
  const cameraPosition = m4.addVectors(cameraTarget, [
    0,
    0,
    radius,
  ]);
  // Set zNear and zFar to something hopefully appropriate
  // for the size of this object.
  const zNear = radius / 100;
  const zFar = radius * 3;

  //Fim do set da camera//

  var texcoordAttributeLocation = gl.getAttribLocation(meshProgramInfo.program, "a_texcoord");
  gl.enableVertexAttribArray(texcoordAttributeLocation);

  // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floating point values
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      texcoordAttributeLocation, size, type, normalize, stride, offset);

  // Create a texture.
  var texture = gl.createTexture();

  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0 + 0);

  // bind to the TEXTURE_2D bind point of texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = pngPath;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  var translation = [0, 0, 0];
  var rotation = [degToRad(0), degToRad(0), degToRad(0)];
  var scale = [1, 1, 1];

  webglLessonsUI.setupSlider(`#x${i}`,      {value: translation[0], slide: updatePosition(0), min: -(gl.canvas.width), max: gl.canvas.width});
  webglLessonsUI.setupSlider(`#y${i}`,      {value: translation[1], slide: updatePosition(1), min: -(gl.canvas.height), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#z${i}`,      {value: translation[2], slide: updatePosition(2), min: -(gl.canvas.height), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#angleX${i}`, {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
  webglLessonsUI.setupSlider(`#angleY${i}`, {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
  webglLessonsUI.setupSlider(`#angleZ${i}`, {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});

  function updatePosition(index) {
    return function(event, ui) {
      let ind = index;
      if (i == 0){
        ui.value /= 50;
        if (index == 1){
          ind = 2;
        }if (index == 2){
          ind = 1;
        }
      }
      if (i == 1){
        ui.value /= 16;
        if (index == 1){
          ind = 2;
        }if (index == 2){
          ind = 1;
        }
      }
      if (i == 2){
        ui.value *= 6;
      }
      if (i == 3){
        ui.value /= 6;
        if (index == 1){
          ind = 2;
        }if (index == 2){
          ind = 1;
        }
      }
      if (i == 4){
        ui.value /= 20;
        if (index == 1){
          ind = 2;
        }if (index == 2){
          ind = 1;
        }
      }
      translation[ind] = ui.value;
      mutex = true;
      requestAnimationFrame(render);
    };
  }

  function updateRotation(index) {
    return function(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = degToRad(angleInDegrees);
      rotation[index] = angleInRadians;
      requestAnimationFrame(render);
      mutex = true;
    };
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      mutex = true;
      requestAnimationFrame(render);
    };
  }

  function render(time) {
    let speed;
    if (animate){
      speed = 0.001;
    } else {
      speed = 0;
    }
    time *= speed;  // convert to seconds

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
    };

    gl.useProgram(meshProgramInfo.program);

    // calls gl.uniform
    twgl.setUniforms(meshProgramInfo, sharedUniforms);

    // compute the world matrix once since all parts
    // are at the same space.
    
    let u_world = m4.yRotation(time);
    u_world = m4.translate(u_world, ...objOffset);
    m4.xRotate(u_world, degToRad(orientation), u_world);                          //Sets initial orientation
    m4.scale(u_world, initialScale[0], initialScale[1], initialScale[2], u_world);//sets initial scale
    m4.translate(u_world, translation[0], translation[2], translation[1], u_world);
    m4.xRotate(u_world, rotation[0], u_world);
    m4.yRotate(u_world, rotation[1], u_world);
    m4.zRotate(u_world, rotation[2], u_world);

    for (const {bufferInfo, vao, material} of parts) {
      // set the attributes for this part.
      gl.bindVertexArray(vao);
      // calls gl.uniform
      twgl.setUniforms(meshProgramInfo, {
        u_world,
        u_diffuse: material.u_diffuse,
      });
      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(gl, bufferInfo);
    }
    
    if (!mutex) {
      requestAnimationFrame(render);
    }
    mutex = false;
  }
  requestAnimationFrame(render);
}

let globalRange;
let globalParts = [];
let texture = [];
async function drawCar() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector(`#canvas-carrinho`);
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Tell the twgl to match position with a_position etc..
  twgl.setAttributePrefix("a_");

  // compiles and links the shaders, looks up attribute and uniform locations
  const meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

  /*Provavelmente a partir daqui
  Pelo menos o parts deve ser vetor*/

  for (let i = 0; i<carrinhoQTD; i++){
    const response = await fetch(itensCarrinho[i].obj);
    const text = await response.text();
    const obj = parseOBJ(text);

    let parts = obj.geometries.map(({data}) => {

      // create a buffer for each array by calling
      // gl.createBuffer, gl.bindBuffer, gl.bufferData
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
      const vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);
      return {
        material: {
          u_diffuse: [Math.random(), Math.random(), Math.random(), 1],
        },
        bufferInfo,
        vao,
      };
    });
    
    globalParts[i] = parts;

    function getExtents(positions) {
      const min = positions.slice(0, 3);
      const max = positions.slice(0, 3);
      for (let i = 3; i < positions.length; i += 3) {
        for (let j = 0; j < 3; ++j) {
          const v = positions[i + j];
          min[j] = Math.min(v, min[j]);
          max[j] = Math.max(v, max[j]);
        }
      }
      return {min, max};
    }

    function getGeometriesExtents(geometries) {
      return geometries.reduce(({min, max}, {data}) => {
        const minMax = getExtents(data.position);
        return {
          min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
          max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
        };
      }, {
        min: Array(3).fill(Number.POSITIVE_INFINITY),
        max: Array(3).fill(Number.NEGATIVE_INFINITY),
      });
    }

    const extents = getGeometriesExtents(obj.geometries);
    const range = m4.subtractVectors(extents.max, extents.min);
    globalRange = range;
    // amount to move the object so its center is at the origin
    const objOffset = m4.scaleVector(
        m4.addVectors(
          extents.min,
          m4.scaleVector(range, 0.5)),
        -1);

    //Preparation to draw it//

    var texcoordAttributeLocation = gl.getAttribLocation(meshProgramInfo.program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordAttributeLocation);

    // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordAttributeLocation, size, type, normalize, stride, offset);

    // Create a texture.
    texture[i] = gl.createTexture();

    // use texture unit 0
    gl.activeTexture(gl.TEXTURE0 + 0);

    // bind to the TEXTURE_2D bind point of texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture[i]);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = itensCarrinho[i].texture;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }
  
  function radToDeg(r) {
    return r * 180 / Math.PI;
  }
  
  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  //Set da camera//
  let camX = 0, camY = 0, camZ = 0;
  let volta = 1;
  const cameraTarget = [0, 0, 0];
  // figure out how far away to move the camera so we can likely
  // see the object.
  let radius = m4.length(globalRange) * 1.2;
  let cameraPosition = m4.addVectors(cameraTarget, [
    0,
    0,
    radius,
  ]);
  // Set zNear and zFar to something hopefully appropriate
  // for the size of this object.
  const zNear = radius / 1000;
  const zFar = radius * 30;

    var translation = [0, 0, 0];
    var rotation = [degToRad(0), degToRad(0), degToRad(0)];
    var scale = [1, 1, 1];

  //Fim do set da camera//

  requestAnimationFrame(render);

  function render(time) {
    let animate = false;
    let speed;
    if (animate){
      speed = 0.001;
    } else {
      speed = 0;
    }
    time *= speed;  // convert to seconds

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1019, 0.8, 0.9411, 0.75);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);


     //Camera moviment fez todo o sentido aqui==================================================================================
    let speedCam = 0.3;
    camY = 5;
    let camAnimate = true;
    if (camAnimate){
      if(camX > 25){
        camX -= speedCam;
        volta = 2;
      }
      if (camZ > 25){
        camZ -= speedCam;
        volta = 3
      }
      if (camX < -25){
        camX += speedCam;
        volta = 4;
      }
      if (camZ < -25){
        camZ += speedCam;
        volta = 1;
      }
      if (volta == 1){
        camX += speedCam;
      } else if (volta == 2){
        camZ += speedCam;
      } else if (volta == 3) {
        camX -= speedCam;
      } else {
        camZ -= speedCam;
      }
      if(camX > 10){
        camZ += speedCam;
      }
      if (camZ > 15){
        camX -= speedCam;
      }
      if (camX < -10){
        camZ -= speedCam;
      }
      if (camZ < -15){
        camX += speedCam;
      }

      // if (camX > 30){
      //   volta = 1;
      // }
      // if (camX < -30){
      //   volta = 0;
      // }
      // if (volta == 1){
      //   camX -= speedCam;
      //   camZ = Math.cos(degToRad(camX*12));
      // } else {
      //   camX += speedCam;
      //   camZ = Math.cos(degToRad(camX*12));
      // }

      // if (radius > 20){
      //   radius = 16;
      // }
    }
    cameraPosition = m4.addVectors([((carrinhoQTD-1) * 4), 0, 0], [camX, camY, camZ,]);//camZ*radius para o cosseno

    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    const camera = m4.lookAt(cameraPosition, [((carrinhoQTD-1) * 2.5), 0, 0], up);    //Camera look fez todo o sentido aqui=========================================================

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
    };

      
    for (let i = 0; i<carrinhoQTD; i++){

      gl.useProgram(meshProgramInfo.program);

      // calls gl.uniform
      twgl.setUniforms(meshProgramInfo, sharedUniforms);
      // compute the world matrix once since all parts
      // are at the same space.
      let u_world = m4.yRotation(time);
      m4.xRotate(u_world, degToRad(0), u_world);                          //Sets initial orientation
      m4.scale(u_world, scale[0], scale[1], scale[2], u_world);//sets initial scale
      m4.translate(u_world, translation[0]+(i*6), translation[2], translation[1], u_world);
      m4.xRotate(u_world, rotation[0], u_world);
      m4.yRotate(u_world, rotation[1], u_world);
      m4.zRotate(u_world, rotation[2], u_world);

      if (itensCarrinho[i].obj == "assets/obj/chao/heliport.obj"){
        m4.xRotate(u_world, degToRad(270), u_world);
        m4.scale(u_world, 8, 8, 8, u_world);
        m4.translate(u_world, 20, 4, -1.4, u_world);
      }
      if (itensCarrinho[i].obj == "assets/obj/fighter/fgt.obj"){
        m4.xRotate(u_world, degToRad(0), u_world);
        m4.translate(u_world, 2, 0, 0, u_world);
        m4.scale(u_world, 0.25, 0.25, 0.25, u_world);
        m4.zRotate(u_world, degToRad(0), u_world);
        m4.yRotate(u_world, degToRad(90), u_world);
      }
      if (itensCarrinho[i].obj == "assets/obj/airplane2/jp.obj"){
        m4.yRotate(u_world, degToRad(90), u_world);
        m4.translate(u_world, 0, 0, 4, u_world);
      }
      if (itensCarrinho[i].obj == "assets/obj/airplane1/ap.obj"){
        m4.yRotate(u_world, degToRad(180), u_world);
        m4.translate(u_world, -4, 0, 0, u_world);
      }
      if (itensCarrinho[i].obj == "assets/obj/costerGuard/hc.obj"){
        m4.scale(u_world, 0.005, 0.005, 0.005, u_world);
        m4.xRotate(u_world, degToRad(270), u_world);
        m4.translate(u_world, 100, 150, 75, u_world);
      }
      gl.bindTexture(gl.TEXTURE_2D, texture[i]);//FOIIIIIIIIIIII PORRAAAAAA!!!!!!!!! ERA AQUIIIIIIIIII!!!!!!!! AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!!!!! PORRAAAAAAAAAAAAAAAA!!!
      for (const {bufferInfo, vao, material} of globalParts[i]) {
        // set the attributes for this part.
        gl.bindVertexArray(vao);
        // calls gl.uniform
        twgl.setUniforms(meshProgramInfo, {
          u_world,
          u_diffuse: material.u_diffuse,
        });
        // calls gl.drawArrays or gl.drawElements
        twgl.drawBufferInfo(gl, bufferInfo);
      }
    }


    requestAnimationFrame(render);
  }
}

main();
