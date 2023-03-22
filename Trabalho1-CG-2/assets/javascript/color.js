/*Em algum momento na main eu faço setColor passando o gl, aqui podem ficar todos os vértices e
conforme for chamado na main pode-se diferenciar as funções aqui. Tipo setF, setT, setO, set!.
Todas são iguais, com apenas as diferenças de mudar o nome e as coordenadas das cores*/


function setColors(gl, index, color) {
  switch (index) {
    case 0: setFC(gl);
    break;
    case 1: setCubeC(gl);
    break;
    case 2: setPiramidC(gl);
    break;
    case 3: setRectanguleC(gl);
    break;
    case 4: setHexagonC(gl);
    break;
    default: setFC(gl);
    break;
  }
    return count;
  }

  function setFC (gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // top rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // middle rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // left column back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // middle rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
  
            // top rung right
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
  
            // under top rung
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
  
            // between top rung and middle
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
  
            // top of middle rung
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
  
            // right of middle rung
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
            // bottom of middle rung.
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
            // right of bottom
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
            // bottom
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
            // left side
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
      ]),
      gl.STATIC_DRAW);
  }
  
  function setCubeC (gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // front face
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
          // back face
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
  
          //side face
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
          //side rigth face
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          //bottom face
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
          //top face
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
      ]),
      gl.STATIC_DRAW);
  }
  
  function setPiramidC (gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // front face
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
          // rigth face
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
  
          // back face
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          // left face
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
  
          // base face
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
      ]),
      gl.STATIC_DRAW);
  }
  
  function setRectanguleC (gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // front face
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
          // back face
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
  
          //side face
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
          //side rigth face
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          //bottom face
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
          //top face
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
      ]),
      gl.STATIC_DRAW);
  }
  
  function setHexagonC (gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // front face
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
          // front face down
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          // rigth face
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
  
          // rigth down face
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          // back face
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
          // back down face
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
  
          // left face
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
          // left down face
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
          // base face
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
          // base down face
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
      ]),
      gl.STATIC_DRAW);
  }