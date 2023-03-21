/*Em algum momento na main eu faço setGeometry passando o gl, aqui podem ficar todos os vértices e
conforme for chamado na main pode-se diferenciar as funções aqui. Tipo setF, setT, setO, set!.
Todas são iguais, com apenas as diferenças de mudar o nome e as coordenadas dos vértices*/

let count;

function setGeometry(gl, index) {
  switch (index) {
    case 0: setF(gl);
    break;
    case 1: setCube(gl);
    break;
    case 2: setPiramid(gl);
    break;
    case 3: setRectangule(gl);
    break;
    case 4: setHexagon(gl);
    break;
    default: setF(gl);
    break;
  }
    return count;
  }

function setF (gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // left column front
        0,   0,  0,
        0, 150,  0,
        30,   0,  0,
        0, 150,  0,
        30, 150,  0,
        30,   0,  0,

        // top rung front
        30,   0,  0,
        30,  30,  0,
        100,   0,  0,
        30,  30,  0,
        100,  30,  0,
        100,   0,  0,

        // middle rung front
        30,  60,  0,
        30,  90,  0,
        67,  60,  0,
        30,  90,  0,
        67,  90,  0,
        67,  60,  0,

        // left column back
          0,   0,  30,
          30,   0,  30,
          0, 150,  30,
          0, 150,  30,
         30,   0,  30,
         30, 150,  30,

        // top rung back
         30,   0,  30,
        100,   0,  30,
         30,  30,  30,
         30,  30,  30,
        100,   0,  30,
        100,  30,  30,

        // middle rung back
         30,  60,  30,
         67,  60,  30,
         30,  90,  30,
         30,  90,  30,
         67,  60,  30,
         67,  90,  30,

        // top
          0,   0,   0,
        100,   0,   0,
        100,   0,  30,
          0,   0,   0,
        100,   0,  30,
          0,   0,  30,

        // top rung right
        100,   0,   0,
        100,  30,   0,
        100,  30,  30,
        100,   0,   0,
        100,  30,  30,
        100,   0,  30,

        // under top rung
        30,   30,   0,
        30,   30,  30,
        100,  30,  30,
        30,   30,   0,
        100,  30,  30,
        100,  30,   0,

        // between top rung and middle
        30,   30,   0,
        30,   60,  30,
        30,   30,  30,
        30,   30,   0,
        30,   60,   0,
        30,   60,  30,

        // top of middle rung
        30,   60,   0,
        67,   60,  30,
        30,   60,  30,
        30,   60,   0,
        67,   60,   0,
        67,   60,  30,

        // right of middle rung
        67,   60,   0,
        67,   90,  30,
        67,   60,  30,
        67,   60,   0,
        67,   90,   0,
        67,   90,  30,

        // bottom of middle rung.
        30,   90,   0,
        30,   90,  30,
        67,   90,  30,
        30,   90,   0,
        67,   90,  30,
        67,   90,   0,

        // right of bottom
        30,   90,   0,
        30,  150,  30,
        30,   90,  30,
        30,   90,   0,
        30,  150,   0,
        30,  150,  30,

        // bottom
        0,   150,   0,
        0,   150,  30,
        30,  150,  30,
        0,   150,   0,
        30,  150,  30,
        30,  150,   0,

        // left side
        0,   0,   0,
        0,   0,  30,
        0, 150,  30,
        0,   0,   0,
        0, 150,  30,
        0, 150,   0,
    ]),
    gl.STATIC_DRAW);
    count = 96;
}

function setCube (gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // front face
        0,   0,  0,
        0, 150,  0,
        150,   0,  0,
        0, 150,  0,
        150, 150,  0,
        150,   0,  0,

        // back face
        0,   0,  150,
        150,   0,  150,
        0, 150,  150,
        0, 150,  150,
        150,   0, 150,
        150, 150, 150,

        //side face
        0,   0,  0,
        0, 0,  150,
        0,   150,  0,
        0, 0,  150,
        0,   150, 150,
        0,   150,  0,

        //side rigth face
        150,   0,  0,
        150,   150,  0,
        150, 0,  150,
        150, 0,  150,
        150,   150,  0,
        150,   150, 150,

        //bottom face
        0,    150,  0,
        0,    150,  150,
        150,  150,  0,
        0,    150,  150,
        150,  150,  150,
        150,  150,  0,

        //top face
        0,    0,  0,
        150,  0,  0,
        0,    0,  150,
        0,    0,  150,
        150,  0,  0,
        150,  0,  150,

    ]),
    gl.STATIC_DRAW);
    count = 36;
}

function setPiramid (gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // front face
        0,    0,  0,
        75,    100,  75,
        150,  0,  0,

        // rigth face
        150,    0,  0,
        75,    100,  75,
        150,  0,  150,

        // back face
        0,    0,  150,
        150,  0,  150,
        75,    100,  75,

        // left face
        0,    0,  0,
        0,  0,  150,
        75,    100,  75,

        // base face
        0,  0,  0,
        150,  0,  0,
        0, 0,  150,
        150,  0,  0,
        150, 0,  150,
        0, 0,  150,

    ]),
    gl.STATIC_DRAW);
    count = 18;
}

function setRectangule (gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // front face
        0,   0,  0,
        0, 150,  0,
        300,   0,  0,
        0, 150,  0,
        300, 150,  0,
        300,   0,  0,

        // back face
        0,   0,  150,
        300,   0,  150,
        0, 150,  150,
        0, 150,  150,
        300,   0, 150,
        300, 150, 150,

        //side face
        0,   0,  0,
        0, 0,  150,
        0,   150,  0,
        0, 0,  150,
        0,   150, 150,
        0,   150,  0,

        //side rigth face
        300,   0,  0,
        300,   150,  0,
        300, 0,  150,
        300, 0,  150,
        300,   150,  0,
        300,   150, 150,

        //bottom face
        0,    150,  0,
        0,    150,  150,
        300,  150,  0,
        0,    150,  150,
        300,  150,  150,
        300,  150,  0,

        //top face
        0,    0,  0,
        300,  0,  0,
        0,    0,  150,
        0,    0,  150,
        300,  0,  0,
        300,  0,  150,

    ]),
    gl.STATIC_DRAW);
    count = 36;
}

function setHexagon (gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // front face
        0,    0,  0,
        75,    100,  75,
        150,  0,  0,

        // front face down
        0,    200,  0,
        150,  200,  0,
        75,    100,  75,

        // rigth face
        150,    0,  0,
        75,    100,  75,
        150,  0,  150,

        // rigth down face
        150,    200,  0,
        150,  200,  150,
        75,    100,  75,

        // back face
        0,    0,  150,
        150,  0,  150,
        75,    100,  75,

        // back down face
        0,    200,  150,
        75,    100,  75,
        150,  200,  150,

        // left face
        0,    0,  0,
        0,  0,  150,
        75,    100,  75,

        // left down face
        0,  200,  0,
        75, 100,  75,
        0,  200,  150,

        // base face
        0,  0,  0,
        150,  0,  0,
        0, 0,  150,
        0, 0,  150,
        150,  0,  0,
        150, 0,  150,

        // base down face
        0,  200,  0,
        0, 200,  150,
        150,  200,  0,
        0, 200,  150,
        150, 200,  150,
        150,  200,  0,

    ]),
    gl.STATIC_DRAW);
    count = 36;
}