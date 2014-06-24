  var settings = {};
  (function() {

    var camera, scene, renderer, controls;
    var geometry, material, material2, mesh, circle, circleMesh, extrudeG, extrudeMesh, group;


    init();
    animate();

    function initGui(settings) {
      //var text = new FizzyText();

      var gui = new dat.GUI();

      settings.iterations = 1;
      settings.segmentIterations = 5;
      settings.displayOutline = true;
      settings.rotationAuto = false;

      gui.add(settings, 'iterations').min(1).step(1);
      gui.add(settings, 'segmentIterations').min(1).step(1);
      gui.add(settings, 'displayOutline');
      gui.add(settings, 'rotationAuto');

    }


    function init() {

      var generate = function generate() {
        var shapes = [];
        var shape = new THREE.CircleGeometry(100, 8);
        shapes.push(shape);
        return shapes;
      };

      function randomSpline(length, pointsCount) {
        var randomPoints = [];
        var segLength = length / pointsCount;
        var variation = length / 100;
        for (var i = 0; i <= pointsCount; i++) {

          randomPoints.push(new THREE.Vector3(i * segLength, THREE.Math.randFloat(-variation, variation), THREE.Math.randFloat(-variation, variation)));

        }

        return new THREE.SplineCurve3(randomPoints);
      }

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      camera.position.y = -1000;
      camera.position.x = -100;


      scene = new THREE.Scene();


      material = new THREE.MeshBasicMaterial({
        color: 0xff4499,
        wireframe: true,


      });

      material2 = new THREE.MeshLambertMaterial({
        color: 0xff4499,
        wireframe: false,


      });



      circle = new THREE.CircleGeometry(100);
      circleMesh = new THREE.Mesh(circle, material);



      //

      var extrudeSettings = {
        steps: 10
        // extrudePath		: randomSpline(),
      };


      function getShape(n, r) {

        // Make shape
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
      var shapes = new Array();
      for (var i = 0; i < 1; i++) {
        shapes[i] = "";
      }
      //extrudeSettings.extrudePath = randomSpline();

      function generateTree(segLength, steps) {
        for (var i = 0; i <= steps; i++) {
          generateBranch();

        }
      }

      function generateBranch(segLength, container) {
        var dummy, geometry, mesh;
        var branchCount = 2;
        var extrudeSettings = {
          steps: 10,
          extrudePath: randomSpline(segLength, 10)
        };

        if (segLength > 10) {

          for (var j = 0; j <= branchCount; j++) {
            geometry = new THREE.ExtrudeGeometry(shapes.map(function() {
              return getShape(3, 1)
            }), extrudeSettings);
            mesh = new THREE.Mesh(geometry, material2);
            //put a positionned container at the end of the geom, for the next branch
            dummy = new THREE.Object3D();
            dummy.add(new THREE.AxisHelper(segLength / 4));

            dummy.position.setX(segLength);
            dummy.rotateY(THREE.Math.randFloat(-1, 1));
            dummy.rotateX(THREE.Math.randFloat(-1, 1));
            dummy.rotateZ(THREE.Math.randFloat(-1, 1));
            mesh.add(dummy);

            container.add(mesh);

            generateBranch(segLength * 0.7, dummy);
          }

          //geometry2 = new THREE.ExtrudeGeometry(shapes.map(function(){return getShape(8,3)}),extrudeSettings);
          //mesh2 = new THREE.Mesh(geometry, material2);



        } else {
          return;
        }

      }

      var dummy = new THREE.Object3D();
      /*extrudeSettings.extrudePath = randomSpline(100, 10);
      extrudeG = new THREE.ExtrudeGeometry(shapes.map(function() {
        return getShape(3, 3)
      }), extrudeSettings);
      extrudeSettings.extrudePath = randomSpline(50, 10);
      var ext2 = new THREE.ExtrudeGeometry(shapes.map(function() {
        return getShape(3, 3)
      }), extrudeSettings);
      // console.dir(ext2);
      //THREE.GeometryUtils.merge(extrudeG,ext2);
      extrudeMesh = new THREE.Mesh(extrudeG, material2);
      dummy.position.setX(100);
      //dummy.position.setY(10);
      dummy.rotateY(0.5);

      extrudeMesh.add(dummy);
      dummy.add(new THREE.AxisHelper(50));

      var extrudeMesh2 = new THREE.Mesh(ext2, material2);
      extrudeMesh2.position.setX(0);
      dummy.add(extrudeMesh2);*/


      group = new THREE.Object3D();


      //extrudeMesh2.position.x =100;
      //extrudeMesh2.rotation.y =0.4;

      //console.log(extrudeMesh);
      generateBranch(75,dummy);
      dummy.rotateZ(1.5);
      group.add(dummy);
      group.add(new THREE.AxisHelper(50));
      // group.add(extrudeMesh2);


      //scene.add(circleMesh);
      scene.add(group);

      var axisHelper = new THREE.AxisHelper(500);
      scene.add(axisHelper);
      scene.add(new THREE.AmbientLight(0x333333));

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

      initGui(settings);

    }

    function animate() {

      // note: three.js includes requestAnimationFrame shim
      requestAnimationFrame(animate);
      if (settings.rotationAuto) {
        group.rotation.y += 0.01;
        group.rotation.z += 0.005;
      }

      controls.update();

      renderer.render(scene, camera);

    }

  })();