"use strict";

//let nomeBemVido = window.prompt("Informe o seu nome para uma experiência mais personalizada!!");
let nomeBemVido;
const nomeP = document.querySelector("#h1-msg");
if (nomeBemVido == null || nomeBemVido == ""){
    nomeBemVido = 'Visitante';
}
nomeP.innerHTML += `, ${nomeBemVido}!`;




function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
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
      webglVertexData = [
        position,
        texcoord,
        normal,
      ];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
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
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
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
    mtllib(parts, unparsedArgs) {
      // the spec says there can be multiple filenames here
      // but many exist with spaces in a single filename
      materialLibs.push(unparsedArgs);
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

let translateFlag;
let rotateFlag;
let scleFlag;
function main(){
  for (let i = 0; i<10; i++){
    let name = `#canvas${i}`;
    let objPath;
    let animate = true;
    switch (i%5){
      case 0: objPath = "assets/obj/airplane1/ap.obj";
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
      break;
      case 4: objPath = "assets/obj/Heli3/Mi28.obj";
      break;
      default: objPath = "assets/obj/Heli3/Mi28.obj";
      break;
    }
    draw(name, objPath, i, animate);
  }
  for (let i = 0; i<5; i++){
    let nameItem = `#item-canvas${i}`;
    let objPath;
    let animate = false;
    switch (i%5){
      case 0: objPath = "assets/obj/airplane1/ap.obj";
      break;
      case 1: objPath = "assets/obj/airplane2/jp.obj";
      break;
      case 2: objPath = "assets/obj/costerGuard/hc.obj";
      break;
      case 3: objPath = "assets/obj/fighter/fgt.obj";
      break;
      case 4: objPath = "assets/obj/Heli3/Mi28.obj";
      break;
      default: objPath = "assets/obj/Heli3/Mi28.obj";
      break;
    }
    draw(nameItem, objPath, i, animate);
  }
}

/*Isso eu consigo modularizar recebendo o nome do arquivo obj e o nome do canvas
Só devo passar para o response abaixo do meshprogram
Talvez seja possível colocar o parser em um arquivo separado*/
async function draw(name, objPath, i, animate) {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector(name);
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Tell the twgl to match position with a_position etc..
  twgl.setAttributePrefix("a_");

  const vs = `#version 300 es
  in vec4 a_position;
  in vec3 a_normal;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;

  out vec3 v_normal;

  void main() {
    gl_Position = u_projection * u_view * u_world * a_position;
    v_normal = mat3(u_world) * a_normal;
  }
  `;

  const fs = `#version 300 es
  precision highp float;

  in vec3 v_normal;

  uniform vec4 u_diffuse;
  uniform vec3 u_lightDirection;

  out vec4 outColor;

  void main () {
    vec3 normal = normalize(v_normal);
    float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
    outColor = vec4(u_diffuse.rgb * fakeLight, u_diffuse.a);
  }
  `;


  // compiles and links the shaders, looks up attribute and uniform locations
  const meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const response = await fetch(objPath);  
  const text = await response.text();
  const obj = parseOBJ(text);

  const parts = obj.geometries.map(({data}) => {
    // Because data is just named arrays like this
    //
    // {
    //   position: [...],
    //   texcoord: [...],
    //   normal: [...],
    // }
    //
    // and because those names match the attributes in our vertex
    // shader we can pass it directly into `createBufferInfoFromArrays`
    // from the article "less code more fun".

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

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  let translation = [0, 0, 0];
  let rotation = [degToRad(0), degToRad(0), degToRad(0)];
  let scale = [1, 1, 1];

  webglLessonsUI.setupSlider(`#x${i}`,      {value: translation[0], slide: updatePosition(0), min: -(gl.canvas.width*3.5), max: gl.canvas.width*3.5});
  webglLessonsUI.setupSlider(`#y${i}`,      {value: translation[1], slide: updatePosition(1), min: -(gl.canvas.height*3.5), max: gl.canvas.height*3.5});
  webglLessonsUI.setupSlider(`#z${i}`,      {value: translation[2], slide: updatePosition(2), min: -(gl.canvas.height*3.5), max: gl.canvas.height*3.5});
  webglLessonsUI.setupSlider(`#angleX${i}`, {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
  webglLessonsUI.setupSlider(`#angleY${i}`, {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
  webglLessonsUI.setupSlider(`#angleZ${i}`, {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
  webglLessonsUI.setupSlider(`#scaleX${i}`, {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleY${i}`, {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider(`#scaleZ${i}`, {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      translateFlag = 1;
      render();
    };
  }

  function updateRotation(index) {
    return function(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = degToRad(angleInDegrees);
      rotation[index] = angleInRadians;
      rotateFlag = index;
      render();
    };
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      scleFlag = 1;
      render();
    };
  }

  function render(time) {
    time *= 0.001;  // convert to seconds

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
    let u_world;
    u_world = m4.yRotation(time);
    u_world = m4.translate(u_world, ...objOffset);
    if (!animate){
      if (translateFlag == 1){
        u_world = m4.translation(translation[0], translation[1], translation[2]);
        translateFlag = 0;
      } else if(rotateFlag == 0){
          u_world = m4.xRotation(rotation[0]);
          rotateFlag = 3;
      } else if (rotateFlag == 1){
          u_world = m4.yRotation(rotation[1]);
          rotateFlag = 3;
      } else if (rotateFlag == 2){
          u_world = m4.zRotation(rotation[2]);
          rotateFlag = 3;
      }
    }

    

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

    if (animate){
      requestAnimationFrame(render);
    }
  }
  requestAnimationFrame(render);
}

main();
