"use strict";

//let nomeBemVido = window.prompt("Informe o seu nome para uma experiência mais personalizada!!");
let nomeBemVido;
const nomeP = document.querySelector("#h1-msg");
if (nomeBemVido == null || nomeBemVido == ""){
    nomeBemVido = 'Visitante';
}
nomeP.innerHTML += `, ${nomeBemVido}!`;


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

function main(){
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
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
              pngPath = "assets/obj/airplane2/jpA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
              pngPath = "assets/obj/costerGuard/hcA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
              pngPath = "assets/obj/fighter/fgtA.png";
              orientation = 270;
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
  for (let i = 0; i<5; i++){
    let nameItem = `#item-canvas${i}`;
    let objPath;
    let pngPath;
    let orientation;
    let initialScale = [1, 1, 1];
    let animate = false;
    switch (i%5){
      case 0: objPath = "assets/obj/airplane1/ap.obj";
              pngPath = "assets/obj/airplane1/apA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
              pngPath = "assets/obj/airplane2/jpA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
              pngPath = "assets/obj/costerGuard/hcA.png";
              orientation = 270;
              initialScale = [1, 1, 1];
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
              pngPath = "assets/obj/fighter/fgtA.png";
              orientation = 270;
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

  let translation = [0, 0, 0];
  let rotation = [degToRad(0), degToRad(0), degToRad(0)];
  let scale = [1, 1, 1];

  webglLessonsUI.setupSlider(`#x${i}`,      {value: translation[0], slide: updatePosition(0), min: -(gl.canvas.width), max: gl.canvas.width});
  webglLessonsUI.setupSlider(`#y${i}`,      {value: translation[1], slide: updatePosition(1), min: -(gl.canvas.height), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#z${i}`,      {value: translation[2], slide: updatePosition(2), min: -(gl.canvas.height), max: gl.canvas.height});
  webglLessonsUI.setupSlider(`#angleX${i}`, {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
  webglLessonsUI.setupSlider(`#angleY${i}`, {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
  webglLessonsUI.setupSlider(`#angleZ${i}`, {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
  webglLessonsUI.setupSlider(`#scaleX${i}`, {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleY${i}`, {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleZ${i}`, {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      render();
    };
  }

  function updateRotation(index) {
    return function(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = degToRad(angleInDegrees);
      rotation[index] = angleInRadians;
      render();
    };
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      render();
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
    
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
