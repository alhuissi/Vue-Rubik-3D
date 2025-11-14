import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import Cube from "cubejs";

var camera = null;
var scene = null;
var light = null;
var cubes = [];
var renderer = null;
var width = 0;
var height = 0;
var originPoint = null;
var controller = null;
var raycaster = null;
var mouse = null;
export var cubeParams = {};
var isRotating = false;
var intersect = null;
var normalize = null;
var startPoint = null;
var movePoint = null;
var initStatus = [];
var XLine = null;
var XLineAd = null;
var YLine = null;
var YLineAd = null;
var ZLine = null;
var ZLineAd = null;
export var stepCount = 0;
var minCubeIndex = null;
var speed = 200;
var oldSpeed = 200;
let cube = null;
var answer = {};
var stepBystep = [];
var newSolution = true;
var mobile = false;
var start = true;
var canvasOff = 0;
export var randomRotateLoading = false;
export var autoRestRunning = false;
export var acceptStringRunning = false;

export function init(is_mobile) {
  if (originPoint === null) {
    originPoint = new THREE.Vector3(0, 0, 0);
    XLine = new THREE.Vector3(1, 0, 0);
    XLineAd = new THREE.Vector3(-1, 0, 0);
    YLine = new THREE.Vector3(0, 1, 0);
    YLineAd = new THREE.Vector3(0, -1, 0);
    ZLine = new THREE.Vector3(0, 0, 1);
    ZLineAd = new THREE.Vector3(0, 0, -1);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    answer = {
      R: R,
      U: U,
      F: F,
      B: B,
      L: L,
      D: D,
      r: r,
      u: u,
      f: f,
      b: b,
      l: l,
      d: d
    };

    cubeParams = {
      x: 0,
      y: 0,
      z: 0,
      num: 3,
      len: 50,
      colorName: ["red", "orange", "blue", "green", "white", "yellow"],

      colors: [
        "rgba(236, 56, 35, 1)",
        "rgba(252, 138, 10, 1)",
        "rgba(56, 148, 173, 1)",
        "rgba(101, 157, 44, 1)",
        "rgba(252, 244, 252, 1)",
        "rgba(252, 236, 71, 1)"
      ],
      sequences: ["R", "L", "U", "D", "F", "B"]
    };
  }

  if (cube === null) {
    cube = new Cube();
    Cube.initSolver();
  }

  window.requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.webkitRequestAnimationFrame
    );
  })();

  if (is_mobile) mobile = true;

  initThree();
  initCamera();
  initScene();
  initLight();
  initObj();
  // initCord(); 
  render();


  renderer.domElement.addEventListener("mousedown", startCube, false);
  renderer.domElement.addEventListener("mousemove", moveCube, false);
  renderer.domElement.addEventListener("mouseup", stopCube, false);

  renderer.domElement.addEventListener("touchstart", startCube, false);
  renderer.domElement.addEventListener("touchmove", moveCube, false);
  renderer.domElement.addEventListener("touchend", stopCube, false);

  controller = new OrbitControls(camera, renderer.domElement);
  controller.target = new THREE.Vector3(0, 0, 0);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  console.log("size change");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function changeSpeed(newSpeed) {
  oldSpeed = newSpeed;
}

function initThree() {
  width = window.innerWidth;
  if (mobile) {
    height = window.innerHeight;
    document.getElementById("canvas3d").style.marginTop = "0px";
  } else {
    height = window.innerHeight;
    document.getElementById("canvas3d").style.marginTop = "0px";
  }
  if (renderer === null) {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  }

  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  document.getElementById("canvas3d").appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(200, 200, 600);
  camera.up.set(0, 1, 0);
  camera.lookAt(originPoint);
}

function initScene() {
  scene = new THREE.Scene();
  
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
    ]);
    scene.background = texture;
  
}

function initLight() {
  light = new THREE.AmbientLight(0x404040, 2);
  scene.add(light);

  var position = 160;
  for (var i = 0; i < 6; i++) {
    var spotLight = new THREE.SpotLight(0xffffff, 1.5);
    switch (i) {
      case 0:
        spotLight.position.set(0, position, 0);
        break;
      case 1:
        spotLight.position.set(0, -position, 0);
        break;
      case 2:
        spotLight.position.set(position, 0, 0);
        break;
      case 3:
        spotLight.position.set(-position, 0, 0);
        break;
      case 4:
        spotLight.position.set(0, 0, position);
        break;
      case 5:
        spotLight.position.set(0, 0, -position);
        break;
      default:
        break;
    }
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
  }
}

function SimpleCube(x, y, z, num, len, colors) {
  var leftUpX = x - (num / 2) * len;
  var leftUpY = y + (num / 2) * len;
  var leftUpZ = z + (num / 2) * len;

  var materialArr = [];
  for (var i = 0; i < colors.length; i++) {
    var texture = new THREE.Texture(faces(colors[i]));
    texture.needsUpdate = true;
    var material = new THREE.MeshLambertMaterial({ map: texture });
    materialArr.push(material);
  }
  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num * num; j++) {
      var cubegeo = new THREE.BoxGeometry(len, len, len, 2, 5);
      var cube = new THREE.Mesh(cubegeo, materialArr);

      cube.position.x = leftUpX + len / 2 + (j % num) * len;
      cube.position.y = leftUpY - len / 2 - parseInt(j / num) * len;
      cube.position.z = leftUpZ - len / 2 - i * len;
      cubes.push(cube);
    }
  }
}

function faces(rgbaColor) {
  var canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  var context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "rgba(0,0,0,1)";
    context.fillRect(0, 0, 256, 256);
    var x = 16;
    var y = 16;
    var h = 224;
    var w = 224;
    var r = 32;
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
    context.lineWidth = 16;
    context.imageSmoothingQuality = "high";
    context.fillStyle = rgbaColor;
    context.strokeStyle = rgbaColor;
    context.stroke();
    context.fill();
  } else {
    alert("Canvas");
  }
  return canvas;
}

export function acceptCubeString(cubeString) {
  start = true;
  stepCount = 0;
  cube = Cube.fromString(cubeString);
  var moves = Cube.inverse(cube.solve());

  if (scene != null) {
    scene.remove(cubes);
  }

  camera = null;
  scene = null;
  light = null;
  cubes = [];
  // renderer = null;
  width = 0;
  height = 0;
  originPoint = null;
  controller = null;
  raycaster = null;
  mouse = null;
  cubeParams = {};
  isRotating = false;
  intersect = null; 
  normalize = null;
  startPoint = null;
  movePoint = null;
  initStatus = [];
  XLine = null; 
  XLineAd = null; 
  YLine = null;
  YLineAd = null;
  ZLine = null;
  ZLineAd = null;
  stepCount = 0;
  minCubeIndex = null;
  answer = {};
  stepBystep = [];
  newSolution = true;

  var x = document.getElementsByTagName("canvas")[1];
  x.parentNode.removeChild(x);
  init();
  speed = 50;
  acceptStringRunning = true;
  runOperations(moves);
}

export function clearAll() {
  if (scene != null) {
    scene.remove(cubes);
  }
  start = true;
  stepCount = 0;
  camera = null;
  scene = null;
  light = null;
  cubes = [];
  // renderer = null;
  width = 0;
  height = 0;
  originPoint = null;
  controller = null;
  raycaster = null;
  mouse = null;
  cubeParams = {};
  isRotating = false;
  intersect = null;
  normalize = null; 
  startPoint = null; 
  movePoint = null;
  initStatus = [];
  XLine = null; 
  XLineAd = null; 
  YLine = null;
  YLineAd = null;
  ZLine = null;
  ZLineAd = null;
  stepCount = 0;
  minCubeIndex = null;
  answer = {};
  stepBystep = [];
  newSolution = true;

  var x = document.getElementsByTagName("canvas")[1];
  x.parentNode.removeChild(x);
  init();
}

export function acceptMethod(moves, newSpeed) {
  start = true;
  stepCount = 0;
  camera = null;
  scene = null;
  light = null;
  cubes = [];
  // renderer = null;
  width = 0;
  height = 0;
  originPoint = null;
  controller = null;
  raycaster = null;
  mouse = null;
  cubeParams = {};
  isRotating = false;
  intersect = null; 
  normalize = null; 
  startPoint = null; 
  movePoint = null;
  initStatus = [];
  XLine = null; 
  XLineAd = null; 
  YLine = null;
  YLineAd = null;
  ZLine = null;
  ZLineAd = null;
  stepCount = 0;
  minCubeIndex = null;
  answer = {};
  stepBystep = [];
  newSolution = true;

  var x = document.getElementsByTagName("canvas")[1];
  x.parentNode.removeChild(x);
  init();
  speed = newSpeed;
  acceptStringRunning = true;
  runOperations(moves);
}

function runOperations(operations) {
  
  operations = operations.split(" ");
  var arr = [];
  var reg1 = /^[a-zA-Z]{1}$/; 
  var reg2 = /^[a-zA-Z]{1}[2]{1}$/;
  var reg3 = /^[a-zA-Z]{1}'$/;
  operations.forEach(move => {
    if (reg3.test(move)) {
      var temp = move.substring(0, 1);
      arr.push(temp.toLowerCase());
    } else if (reg2.test(move)) {
      var temp = move.substring(0, 1);
      arr.push(temp);
      arr.push(temp);
    } else if (reg1.test(move)) {
      arr.push(move);
    } else {

    }
  });

  
  var funcs = [];
  stepCount = 0;
  arr.forEach(move => {
    var f = answer[move];
    funcs.push(f);
  });
  var count = stepCount;
  autoRestRunning = true;
  runMethodAtNo(funcs, 0, 0, function() {
    var endTime = window.performance.now();
    console.log("end at:" + endTime);
    console.log("total times:" + (endTime - startTime));
    console.log("total steps:" + count);
  });
}

export function randomRotate(newSpeed) {
  start = true;
  stepCount = 0;
  randomRotateLoading = true;
  if (!isRotating) {
    speed = newSpeed;
    oldSpeed = speed;
    var stepNum = parseInt(40 * Math.random());
    if (stepNum < 20) {
      stepNum = 20; 
    }
    var funcArr = [R, U, F, B, L, D, r, u, f, b, l, d];
    var stepArr = [];
    for (var i = 0; i < stepNum; i++) {
      var num = parseInt(Math.random() * funcArr.length);
      stepArr.push(funcArr[num]);
    }
    runMethodAtNo(stepArr, 0, 0);
  }
}

function runMethodAtNo(arr, no, next) {
  if (no >= arr.length - 1) {
    if (next) {
      arr[no](next);
      randomRotateLoading = false;
      autoRestRunning = false;
      acceptStringRunning = false;
    } else {
      arr[no]();
      randomRotateLoading = false;
      autoRestRunning = false;
      acceptStringRunning = false;
    }
  } else {
    arr[no](function() {
      if (no < arr.length - 1) {
        no++;
        runMethodAtNo(arr, no, next);
      }
    });
  }
}

export async function autoRest(newSpeed) {
  start = true;
  autoRestRunning = true;
  speed = newSpeed;
  oldSpeed = speed;
  var startTime = window.performance.now();
  console.log("start autoReset");
  console.log("start at:" + startTime);

  var rubik = getRubikSequence();
  cube.init(Cube.fromString(rubik));
  if (cube.isSolved()) {
    autoRestRunning = false;
    return;
  }
  // Cube.initSolver();
  var moves = await cube.solve();

  runOperations(moves);
}

export async function autoRestOneStep(newSpeed) {
  autoRestRunning = true;
  speed = newSpeed;
  oldSpeed = speed;
  if (newSolution) {
    var stepCount = 0;
    stepBystep = [];

    
    var rubik = getRubikSequence();
    cube.init(Cube.fromString(rubik));
    if (cube.isSolved()) {
      autoRestRunning = false;
      return;
    }
    // Cube.initSolver();
    var moves = await cube.solve();
    moves = moves.split(" ");

    
    var reg1 = /^[a-zA-Z]{1}$/; 
    var reg2 = /^[a-zA-Z]{1}[2]{1}$/;
    var reg3 = /^[a-zA-Z]{1}'$/; 
    moves.forEach(move => {
      if (reg3.test(move)) {
        var temp = move.substring(0, 1);
        stepBystep.push(temp.toLowerCase());
      } else if (reg2.test(move)) {
        var temp = move.substring(0, 1);
        stepBystep.push(temp);
        stepBystep.push(temp);
      } else if (reg1.test(move)) {
        stepBystep.push(move);
      } else {
        console.log("出错啦");
      }
    });

    newSolution = false;
  }

  var f = answer[stepBystep.shift()];
  if (f) {
    f(0);
  } else {
    newSolution = true;
  }
  autoRestRunning = false;
}

export async function autoRunOneStep(methodMoves, newSpeed, currentStep) {
  autoRestRunning = true;
  speed = newSpeed;
  oldSpeed = speed;
  if (newSolution && currentStep === 0) {
    stepBystep = [];

    // Cube.initSolver();
    var moves = methodMoves.split(" ");


    var reg1 = /^[a-zA-Z]{1}$/; 
    var reg2 = /^[a-zA-Z]{1}[2]{1}$/; 
    var reg3 = /^[a-zA-Z]{1}'$/; 
    moves.forEach(move => {
      if (reg3.test(move)) {
        var temp = move.substring(0, 1);
        stepBystep.push(temp.toLowerCase());
      } else if (reg2.test(move)) {
        var temp = move.substring(0, 1);
        stepBystep.push(temp);
        stepBystep.push(temp);
      } else if (reg1.test(move)) {
        stepBystep.push(move);
      } else {
        console.log("出错啦");
      }
    });

    newSolution = false;
  }

  var f = answer[stepBystep.shift()];
  if (f) {
    f(0);
  } else {
    newSolution = true;
  }
  autoRestRunning = false;
}

function getRubikSequence() {
  var seq = [];

  //U
  var us = [18, 19, 20, 9, 10, 11, 0, 1, 2];
  us.forEach(u => {
    var ui = getCubeByIndex(u);
    seq.push(getFaceColorByVector(ui, YLine));
  });

  //R
  var rs = [2, 11, 20, 5, 14, 23, 8, 17, 26];
  rs.forEach(r => {
    var ri = getCubeByIndex(r);
    seq.push(getFaceColorByVector(ri, XLine));
  });

  //F
  var fs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  fs.forEach(f => {
    var fi = getCubeByIndex(f);
    seq.push(getFaceColorByVector(fi, ZLine));
  });

  //D
  var ds = [6, 7, 8, 15, 16, 17, 24, 25, 26];
  ds.forEach(d => {
    var di = getCubeByIndex(d);
    seq.push(getFaceColorByVector(di, YLineAd));
  });

  //L
  var ls = [18, 9, 0, 21, 12, 3, 24, 15, 6];
  ls.forEach(l => {
    var li = getCubeByIndex(l);
    seq.push(getFaceColorByVector(li, XLineAd));
  });

  //B
  var bs = [20, 19, 18, 23, 22, 21, 26, 25, 24];
  bs.forEach(b => {
    var bi = getCubeByIndex(b);
    seq.push(getFaceColorByVector(bi, ZLineAd));
  });

  var cube10 = getCubeByIndex(10);
  var uColorIndex = getFaceColorByVector(cube10, YLine);
  cubeParams.sequences[uColorIndex] = "U";

  var cube4 = getCubeByIndex(4);
  var fColorIndex = getFaceColorByVector(cube4, ZLine);
  cubeParams.sequences[fColorIndex] = "F";

  var cube14 = getCubeByIndex(14);
  var rColorIndex = getFaceColorByVector(cube14, XLine);
  cubeParams.sequences[rColorIndex] = "R";

  var cube12 = getCubeByIndex(12);
  var lColorIndex = getFaceColorByVector(cube12, XLineAd);
  cubeParams.sequences[lColorIndex] = "L";

  var cube16 = getCubeByIndex(16);
  var dColorIndex = getFaceColorByVector(cube16, YLineAd);
  cubeParams.sequences[dColorIndex] = "D";

  var cube22 = getCubeByIndex(22);
  var bColorIndex = getFaceColorByVector(cube22, ZLineAd);
  cubeParams.sequences[bColorIndex] = "B";

  var str = "";
  seq.forEach(s => {
    str += cubeParams.sequences[s];
  });

  return str;

  //UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
  /**
      |************|
      |*U1**U2**U3*|
      |************|
      |*U4**U5**U6*|
      |************|
      |*U7**U8**U9*|
      |************|
************|************|************|************
*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*
************|************|************|************
*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*
************|************|************|************
*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*
************|************|************|************
      |************|
      |*D1**D2**D3*|
      |************|
      |*D4**D5**D6*|
      |************|
      |*D7**D8**D9*|
      |************|
      */
}

function getFaceColorByVector(cube, vector) {
  var materials = cube.material;
  var faces = cube.geometry.faces;
  var normalMatrix = cube.normalMatrix;

  var viewMatrix = new THREE.Matrix4();
  viewMatrix.lookAt(camera.position, originPoint, camera.up);
  viewMatrix.getInverse(viewMatrix);
  var tempVector = vector.clone();
  tempVector.applyMatrix4(viewMatrix);
  var angles = [];

  faces.forEach(face => {
    var tempNormal = face.normal.clone();
    tempNormal.applyMatrix3(normalMatrix);
    angles.push(tempNormal.angleTo(tempVector));
  });
  var minNo = min(angles).no;
  return faces[minNo].materialIndex;
}

function U(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = ZLine;
  rotateMove(cube2, XLineAd, next);
}

function u(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = XLine;
  rotateMove(cube2, ZLineAd, next);
}

function F(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = XLine;
  rotateMove(cube2, YLineAd, next);
}

function f(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = YLine;
  rotateMove(cube2, XLineAd, next);
}

function L(next) {
  // stepCount++;
  var cube0 = getCubeByIndex(0);
  normalize = ZLine;
  rotateMove(cube0, YLineAd, next);
}

function l(next) {
  // stepCount++;
  var cube0 = getCubeByIndex(0);
  normalize = YLine;
  rotateMove(cube0, ZLineAd, next);
}

function D(next) {
  // stepCount++;
  var cube8 = getCubeByIndex(8);
  normalize = XLine;
  rotateMove(cube8, ZLineAd, next);
}

function d(next) {
  // stepCount++;
  var cube8 = getCubeByIndex(8);
  normalize = ZLine;
  rotateMove(cube8, XLineAd, next);
}

function R(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = YLine;
  rotateMove(cube2, ZLineAd, next);
}

function r(next) {
  // stepCount++;
  var cube2 = getCubeByIndex(2);
  normalize = ZLine;
  rotateMove(cube2, YLineAd, next);
}

function B(next) {
  // stepCount++;
  var cube20 = getCubeByIndex(20);
  normalize = XLine;
  rotateMove(cube20, YLine, next);
}

function b(next) {
  // stepCount++;
  var cube20 = getCubeByIndex(20);
  normalize = XLine;
  rotateMove(cube20, YLineAd, next);
}

function getCubeByIndex(index) {
  var cube;
  cubes.forEach(element => {
    if (element.cubeIndex == index + minCubeIndex) {
      cube = element;
    }
  });
  return cube;
}

function rotateMove(target, vector, next) {
  isRotating = true; //转动标识置为true
  var direction = getDirection(vector); 
  var elements = getBoxs(target, direction);
  findWhichOperation(direction, elements);
  stepCount++;
  window.requestAnimFrame(function(timestamp) {
    rotateAnimation(elements, direction, timestamp, 0, null, next);
  });
}

function findWhichOperation(direction, elements) {
  var ids = [];
  cubes.forEach(cube => {
    ids.push(cube.cubeIndex);
  });
  var minId = min(ids).value;
  var targetId = 0;
  switch (direction) {
    
    case 0.1:
    case 1.2:
    case 2.4:
    case 3.3:
      elements.forEach(element => {
        var targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("F");
        }
        if (targetId === 10) {
          cube.move("S");
        }
        if (targetId === 20) {
          cube.move("b");
        }
      });
      break;
    
    case 0.2:
    case 1.1:
    case 2.3:
    case 3.4:
      elements.forEach(element => {
        targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("F'");
        }
        if (targetId === 10) {
          cube.move("S'");
        }
        if (targetId === 20) {
          cube.move("B");
        }
      });
      break;
    
    case 0.4:
    case 1.3:
    case 4.3:
    case 5.4:
      elements.forEach(element => {
        targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("U");
        }
        if (targetId === 5) {
          cube.move("E");
        }
        if (targetId === 8) {
          cube.move("D");
        }
      });
      break;
    
    case 1.4:
    case 0.3:
    case 4.4:
    case 5.3:
      elements.forEach(element => {
        targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("U'");
        }
        if (targetId === 5) {
          cube.move("E'");
        }
        if (targetId === 8) {
          cube.move("D'");
        }
      });
      break;
    
    case 2.2:
    case 3.1:
    case 4.1:
    case 5.2:
      elements.forEach(element => {
        targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("R'");
        }
        if (targetId === 4) {
          cube.move("M");
        }
        if (targetId === 0) {
          cube.move("L");
        }
      });
      break;
    
    case 2.1:
    case 3.2:
    case 4.2:
    case 5.1:
      elements.forEach(element => {
        targetId = element.cubeIndex - minId;
        if (targetId === 2) {
          cube.move("R");
        }
        if (targetId === 4) {
          cube.move("M'");
        }
        if (targetId === 0) {
          cube.move("L'");
        }
      });
      break;
    default:
      break;
  }
}

function initCord() {
  var xmat = new THREE.LineBasicMaterial({ color: "red" });
  var xgeo = new THREE.Geometry();
  xgeo.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(300, 0, 0));
  var xline = new THREE.Line(xgeo, xmat);
  scene.add(xline);
  var ymat = new THREE.LineBasicMaterial({ color: "blue" });
  var ygeo = new THREE.Geometry();
  ygeo.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 300, 0));
  var yline = new THREE.Line(ygeo, ymat);
  scene.add(yline);
  var zmat = new THREE.LineBasicMaterial({ color: "green" });
  var zgeo = new THREE.Geometry();
  zgeo.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 300));
  var zline = new THREE.Line(zgeo, zmat);
  scene.add(zline);
}

function initObj() {
  SimpleCube(
    cubeParams.x,
    cubeParams.y,
    cubeParams.z,
    cubeParams.num,
    cubeParams.len,
    cubeParams.colors
  );
  var ids = [];
  cubes.forEach(element => {
    initStatus.push({
      x: element.position.x,
      y: element.position.y,
      z: element.position.z,
      cubeIndex: element.id
    });
    element.cubeIndex = element.id;
    ids.push(element.id);
    scene.add(element);
  });
  minCubeIndex = min(ids).value;

  
  var cubegeo = new THREE.BoxGeometry(150, 150, 150);
  var hex = 0x000000;
  for (var i = 0; i < cubegeo.faces.length; i += 2) {
    cubegeo.faces[i].color.setHex(hex);
    cubegeo.faces[i + 1].color.setHex(hex);
  }
  var cubemat = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    opacity: 0,
    transparent: true
  });
  var cube = new THREE.Mesh(cubegeo, cubemat);
  cube.cubeType = "coverCube";
  scene.add(cube);

  // var geometry = new THREE.PlaneBufferGeometry(100, 100);
  // var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  // var ground = new THREE.Mesh(geometry, planeMaterial);
  // ground.position.set(0, -80, 0);
  // ground.rotation.x = - Math.PI / 2;
  // ground.scale.set(100, 100, 100);
  // ground.castShadow = false;
  // ground.receiveShadow = true;
  // scene.add(ground);
}

function render() {
  renderer.clear();
  renderer.render(scene, camera);
  window.requestAnimFrame(render);
}


function stopCube() {
  intersect = null;
  startPoint = null;
}


function rotateAroundWorldY(obj, rad) {
  var x0 = obj.position.x;
  var z0 = obj.position.z;
  var q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
  obj.quaternion.premultiply(q);
  obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
  obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
}

function rotateAroundWorldZ(obj, rad) {
  var x0 = obj.position.x;
  var y0 = obj.position.y;
  var q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
  
  obj.quaternion.premultiply(q);
  obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
  obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
}

function rotateAroundWorldX(obj, rad) {
  var y0 = obj.position.y;
  var z0 = obj.position.z;
  var q = new THREE.Quaternion();
  q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
  obj.quaternion.premultiply(q);
  obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
  obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
}


function moveCube(event) {
  getIntersects(event); 
  if (intersect) {
    if (!isRotating && startPoint) {
      
      movePoint = intersect.point;
      if (!movePoint.equals(startPoint)) {
        
        isRotating = true; 
        speed = oldSpeed;
        newSolution = true;
        var sub = movePoint.sub(startPoint);
        if (start) {
          start = false;
          stepCount = 0;
        }
        rotateMove(intersect, sub);
      }
    }
  }
  event.preventDefault();
}

function rotateAnimation(
  elements,
  direction,
  currentstamp,
  startstamp,
  laststamp,
  next
) {
  var totalTime = speed;
  var isLastRotate = false; 
  if (startstamp === 0) {
    startstamp = currentstamp;
    laststamp = currentstamp;
  }
  if (currentstamp - startstamp >= totalTime) {
    currentstamp = startstamp + totalTime;
    isLastRotate = true;
  }
  var ids = [];
  cubes.forEach(cube => {
    ids.push(cube.cubeIndex);
  });
  var minId = min(ids).value;
  switch (direction) {
    
    case 0.1:
    case 1.2:
    case 2.4:
    case 3.3:
      elements.forEach(element => {
        rotateAroundWorldZ(
          element,
          (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    
    case 0.2:
    case 1.1:
    case 2.3:
    case 3.4:
      elements.forEach(element => {
        rotateAroundWorldZ(
          element,
          (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    
    case 0.4:
    case 1.3:
    case 4.3:
    case 5.4:
      elements.forEach(element => {
        rotateAroundWorldY(
          element,
          (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    
    case 1.4:
    case 0.3:
    case 4.4:
    case 5.3:
      elements.forEach(element => {
        rotateAroundWorldY(
          element,
          (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    
    case 2.2:
    case 3.1:
    case 4.1:
    case 5.2:
      elements.forEach(element => {
        rotateAroundWorldX(
          element,
          (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    
    case 2.1:
    case 3.2:
    case 4.2:
    case 5.1:
      elements.forEach(element => {
        rotateAroundWorldX(
          element,
          (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
        );
      });
      break;
    default:
      break;
  }
  if (!isLastRotate) {
    window.requestAnimFrame(function(timestamp) {
      rotateAnimation(
        elements,
        direction,
        timestamp,
        startstamp,
        currentstamp,
        next
      );
    });
  } else {
    isRotating = false;
    startPoint = null;
    updateCubeIndex(elements);
    if (next) next();
  }
}


function updateCubeIndex(elements) {
  for (var i = 0; i < elements.length; i++) {
    var temp1 = elements[i];
    for (var j = 0; j < initStatus.length; j++) {
      var temp2 = initStatus[j];
      if (
        Math.abs(temp1.position.x - temp2.x) <= cubeParams.len / 2 &&
        Math.abs(temp1.position.y - temp2.y) <= cubeParams.len / 2 &&
        Math.abs(temp1.position.z - temp2.z) <= cubeParams.len / 2
      ) {
        temp1.cubeIndex = temp2.cubeIndex;
        break;
      }
    }
  }
}

function getBoxs(target, direction) {
  var targetId = 0;
  if (target.object != null) targetId = target.object.cubeIndex;
  else targetId = target.cubeIndex;
  var ids = [];
  cubes.forEach(cube => {
    ids.push(cube.cubeIndex);
  });
  var minId = min(ids).value;
  targetId = targetId - minId;
  var numI = parseInt(targetId / 9);
  var numJ = targetId % 9;
  var boxs = [];
  switch (direction) {
    
    case 0.1:
    case 0.2:
    case 1.1:
    case 1.2:
    case 2.3:
    case 2.4:
    case 3.3:
    case 3.4:
      cubes.forEach(cube => {
        var tempId = cube.cubeIndex - minId;
        if (numI === parseInt(tempId / 9)) {
          boxs.push(cube);
        }
      });
      break;
    
    case 0.3:
    case 0.4:
    case 1.3:
    case 1.4:
    case 4.3:
    case 4.4:
    case 5.3:
    case 5.4:
      cubes.forEach(cube => {
        var tempId = cube.cubeIndex - minId;
        if (parseInt(numJ / 3) === parseInt((tempId % 9) / 3)) {
          boxs.push(cube);
        }
      });
      break;
    
    case 2.1:
    case 2.2:
    case 3.1:
    case 3.2:
    case 4.1:
    case 4.2:
    case 5.1:
    case 5.2:
      cubes.forEach(cube => {
        var tempId = cube.cubeIndex - minId;
        if ((tempId % 9) % 3 === numJ % 3) {
          boxs.push(cube);
        }
      });
      break;
    default:
      break;
  }
  return boxs;
}


function getDirection(vector3) {
  var direction;
  
  var xAngle = vector3.angleTo(XLine);
  var xAngleAd = vector3.angleTo(XLineAd);
  var yAngle = vector3.angleTo(YLine);
  var yAngleAd = vector3.angleTo(YLineAd);
  var zAngle = vector3.angleTo(ZLine);
  var zAngleAd = vector3.angleTo(ZLineAd);
  var minAngle = min([xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd])
    .value; 
  switch (minAngle) {
    case xAngle:
      direction = 0;
      if (normalize.equals(YLine)) {
        direction = direction + 0.1; 
      } else if (normalize.equals(YLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(ZLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    case xAngleAd:
      direction = 1; 
      if (normalize.equals(YLine)) {
        direction = direction + 0.1; 
      } else if (normalize.equals(YLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(ZLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    case yAngle:
      direction = 2; 
      if (normalize.equals(ZLine)) {
        direction = direction + 0.1; 
      } else if (normalize.equals(ZLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(XLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    case yAngleAd:
      direction = 3; 
      if (normalize.equals(ZLine)) {
        direction = direction + 0.1; 
      } else if (normalize.equals(ZLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(XLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    case zAngle:
      direction = 4; 
      if (normalize.equals(YLine)) {
        direction = direction + 0.1;
      } else if (normalize.equals(YLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(XLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    case zAngleAd:
      direction = 5; 
      if (normalize.equals(YLine)) {
        direction = direction + 0.1;
      } else if (normalize.equals(YLineAd)) {
        direction = direction + 0.2; 
      } else if (normalize.equals(XLine)) {
        direction = direction + 0.3; 
      } else {
        direction = direction + 0.4; 
      }
      break;
    default:
      break;
  }
  return direction;
}

function min(arr) {
  var min = arr[0];
  var no = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
      no = i;
    }
  }
  return { no: no, value: min };
}


function startCube(event) {
  getIntersects(event);
  
  if (!isRotating && intersect) {
    startPoint = intersect.point; 
    controller.enabled = false; 
  } else {
    controller.enabled = true; 
  }
}


function getIntersects(event) {
  
  if (event.touches) {
    var offset = document.getElementsByTagName("canvas")[1].offsetTop;
    var touch = event.touches[0];
    mouse.x = (touch.clientX / width) * 2 - 1;
    mouse.y = -((touch.clientY - offset - canvasOff) / height) * 2 + 1;
  } else {
    mouse.x = (event.offsetX / width) * 2 - 1;
    mouse.y = -(event.offsetY / height) * 2 + 1;
  }
  raycaster.setFromCamera(mouse, camera);
  
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length) {
    try {
      if (intersects[0].object.cubeType === "coverCube") {
        intersect = intersects[1];
        normalize = intersects[0].face.normal;
      } else {
        intersect = intersects[0];
        normalize = intersects[1].face.normal;
      }
    } catch (err) {}
  }
}
