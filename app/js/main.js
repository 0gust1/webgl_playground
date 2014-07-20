var settings = {};
var camera, scene, renderer, controls;
var geometry, material, material2, mesh, circle, circleMesh, extrudeG, extrudeMesh, dummy;

//main initialisations
init();
animate();

function initCamAndEnv() {
  //*********
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  material = new THREE.MeshBasicMaterial({
    color: 0xff4499,
    wireframe: true
  });

  material2 = new THREE.MeshLambertMaterial({
    color: 0xff4499,
    wireframe: false
  });

  var axisHelper = new THREE.AxisHelper(500);
  scene.add(axisHelper);
  scene.add(new THREE.AmbientLight(0xffffff));

  var light = new THREE.PointLight(0xffffff);
  light.position = camera.position;
  scene.add(light);

  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0x333333);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.minDistance = 200;
  controls.maxDistance = 500;
}

/**
 * init dat.gui controls
 * @param  {[type]} settings
 * @return {[type]}
 */
function initGui(settings) {
  //var text = new FizzyText();

  var gui = new dat.GUI();

  /*settings.iterations = 1;
  settings.segmentIterations = 5;
  settings.displayOutline = true;*/
  settings.branchLength = 100;
  settings.branchCount = 2;
  settings.decayFactor = 0.7;
  settings.rotationAuto = false;
  settings.regenerate = reinit;

  /*gui.add(settings, 'iterations').min(1).step(1);
  gui.add(settings, 'segmentIterations').min(1).step(1);
  gui.add(settings, 'displayOutline');*/
  gui.add(settings,'branchCount').max(5).step(1);
  gui.add(settings,'branchLength').step(1);
  gui.add(settings,'decayFactor').step(0.1);
  gui.add(settings, 'rotationAuto');
  gui.add(settings, 'regenerate');

}

function randomSpline(length, pointsCount) {
    var randomPoints = [];
    var segLength = length / pointsCount;
    var variation = length / 50;
    for (var i = 0; i <= pointsCount; i++) {

      randomPoints.push(new THREE.Vector3(i * segLength, THREE.Math.randFloat(-variation, variation), THREE.Math.randFloat(-variation, variation)));

    }

    return new THREE.SplineCurve3(randomPoints);
  }

function reinit(){
    //remove object
    scene.remove(scene.children[3]);
    //render a new tree
    renderTree();
}

function renderTree(){
    dummy = new THREE.Object3D();

  generateBranch(settings.branchLength, dummy);
  dummy.rotateZ(1.5);

  scene.add(dummy);


  /**
   * generate a slightly irregular THREE.shape
   * @param  {[type]} n
   * @param  {[type]} r
   * @return {[type]}
   */
  function getShape(n, r) {
    var sh = new THREE.Shape();
    for (var i = 0; i < n; i++) {
      var method = i ? 'lineTo' : 'moveTo';
      var a = (i / n) * Math.PI * 2;
      var x = Math.cos(a) * r;
      var y = Math.sin(a) * r;
      sh[method](x, y);
    }
    return sh;
  }

  /**
   * return an array of irregular shapes (for testing extrusion)
   * @param  {[type]} num
   * @param  {[type]} n
   * @param  {[type]} r
   * @return {[type]}
   */
  function getShapes(num, n, r) {
    var shapes = new Array();
    //array init - ugly
    for (var i = 0; i < num; i++) {
      shapes[i] = "";
    }
    return shapes.map(function() {
      return getShape(n, r)
    })
  }

  /**
   * [generateTree description]
   * @param  {[type]} segLength [description]
   * @param  {[type]} steps     [description]
   * @return {[type]}           [description]
   */
  function generateTree(segLength, steps) {
    for (var i = 0; i <= steps; i++) {
      generateBranch();

    }
  }

  /**
   * Generate recursively a tree (branches)
   * @param  {[type]} segLength [description]
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  function generateBranch(segLength, container) {
    var dummy, geometry, mesh;
    var branchCount = settings.branchCount;

    var extrudeSettings = {
      steps: 5,
      extrudePath: randomSpline(segLength, 5)
    };

    if (segLength > 20) {

      for (var j = 0; j < branchCount; j++) {
        geometry = new THREE.ExtrudeGeometry(getShapes(1, 3, 4), extrudeSettings);
        mesh = new THREE.Mesh(geometry, material2);

        //put a positionned container at the end of the geom, for the next branch
        dummy = new THREE.Object3D();
        //dummy.add(new THREE.AxisHelper(segLength / 4));

        dummy.position.setX(segLength);
        dummy.rotateY(THREE.Math.randFloat(-1, 1));
        dummy.rotateX(THREE.Math.randFloat(-1, 1));
        dummy.rotateZ(THREE.Math.randFloat(-1, 1));
        mesh.add(dummy);

        container.add(mesh);

        generateBranch(segLength * settings.decayFactor, dummy);
      }

      //geometry2 = new THREE.ExtrudeGeometry(shapes.map(function(){return getShape(8,3)}),extrudeSettings);
      //mesh2 = new THREE.Mesh(geometry, material2);
    } else {
      return;
    }

  }

  /**
   * Generate recursively a tree (branches)
   * @param  {[type]} segLength [description]
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  function generateBranch2(segLength, container) {
    var geometry, mesh;
    var branchCount = settings.branchCount;

    var extrudeSettings = {
      steps: 5,
      extrudePath: randomSpline(segLength, 5)
    };

    if (segLength > 10) {

      for (var j = 0; j < branchCount; j++) {
        geometry = new THREE.ExtrudeGeometry(getShapes(1, 3, 1), extrudeSettings);
        //geometry.applyMatrix(new THREE.Matrix4().makeTranslation(segLength, 0, 0));
        mesh = new THREE.Mesh(geometry, material2);
        //put a positionned container at the end of the geom, for the next branch
        /*dummy = new THREE.Object3D();
              dummy.add(new THREE.AxisHelper(segLength / 4));

              dummy.position.setX(segLength);
              dummy.rotateY(THREE.Math.randFloat(-1, 1));
              dummy.rotateX(THREE.Math.randFloat(-1, 1));
              dummy.rotateZ(THREE.Math.randFloat(-1, 1));
              mesh.add(dummy);*/


        mesh.position.setX(segLength);
        mesh.rotateY(THREE.Math.randFloat(-1, 1));
        mesh.rotateX(THREE.Math.randFloat(-1, 1));
        mesh.rotateZ(THREE.Math.randFloat(-1, 1));
        mesh.add(new THREE.AxisHelper(segLength / 4))
        //THREE.GeometryUtils.merge(container, mesh);
        container.add(mesh);
        //container.merge(mesh);
        generateBranch2(segLength * settings.decayFactor, mesh);
      }

      //geometry2 = new THREE.ExtrudeGeometry(shapes.map(function(){return getShape(8,3)}),extrudeSettings);
      //mesh2 = new THREE.Mesh(geometry, material2);
    } else {
      return;
    }

  }

}

function init() {

  initCamAndEnv();

  initGui(settings);
  renderTree();
} //end init function

function animate() {

  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame(animate);
  if (settings.rotationAuto) {
    dummy.rotation.y += 0.01;
  }

  controls.update();

  renderer.render(scene, camera);

}