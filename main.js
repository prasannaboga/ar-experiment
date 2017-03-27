var notify = document.getElementById('notify')

function notification(text) {
  var node = document.createElement('div')

  node.appendChild(document.createTextNode(text))
  notify.appendChild(node)
}

if (window.ARController && ARController.getUserMediaThreeScene) {
  ARThreeOnLoad()
}

function ARThreeOnLoad() {
  ARController.getUserMediaThreeScene({
    maxARVideoSize: 640,
    cameraParam:    'camera_para.dat',
    onSuccess:      createAR
  })
}

function createAR(arScene, arController, arCamera) {
  arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION)

  // The dom element inside which to place the camera.
  var root = document.getElementById("root")

  // Creates a font loader.
  var loader = new THREE.FontLoader()

  // Call a function when the font is loaded.
  loader.load('droid_sans_mono_regular.typeface.json', startAnimation)

  // Start to animate.
  function startAnimation(font) {
    // Creates the renderer and appends it to the DOM.
    var renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    root.appendChild(renderer.domElement)

    notification(navigator.userAgent)

    if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
      if (arController.orientation === 'portrait') {
        changeProjection();

        var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
        var h = window.innerWidth;
        renderer.setSize(w, h);
        renderer.domElement.style.paddingBottom = (w-h) + 'px';
        document.body.className += ' portrait';

        notification('portrait')
      }
      else {
        changeProjection();

        renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
        document.body.className += ' landscape';

        notification('landscape')
      }
    }
    else {
      renderer.setSize(arController.videoWidth, arController.videoHeight);
      document.body.className += ' desktop';

      notification('desktop')
    }

    var markerRoot = arController.createThreeBarcodeMarker(20)

    // Creates the text.
    var geometry = new THREE.TextGeometry('Augumented reality rocks!', {
      font:   font,
      size:   0.2,
      height: 0.1
    })
    material = new THREE.MultiMaterial([
      new THREE.MeshBasicMaterial({color: 0xffa500}),
      new THREE.MeshPhongMaterial({color: 0xffa500, shading: THREE.SmoothShading})
    ]);

    var text = new THREE.Mesh(geometry, material)
    text.material.shading = THREE.FlatShading
    text.position.z = 0

    // Centering text
    geometry.computeBoundingBox()
    var textWidth  = geometry.boundingBox.max.x - geometry.boundingBox.min.x
    var textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y
    text.position.x = -textWidth/2
    text.position.y = -textHeight/2

    // Adds the text to the marker.
    markerRoot.add(text)

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    arScene.scene.add(dirLight);

    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    arScene.scene.add(pointLight);

    // Adds the master to the sceene.
    arScene.scene.add(markerRoot)

    var tick = function() {
      arScene.process()
      arScene.renderOn(renderer)
      requestAnimationFrame(tick)
    }

    tick()

    function changeProjection() {
      var projectionMatrixArr = arController.getCameraMatrix();
      var projectionMatrix = new THREE.Matrix4().fromArray(projectionMatrixArr)

      var projectionAxisTransformMatrix = new THREE.Matrix4()

      projectionAxisTransformMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI/2))
      projectionMatrix.multiply(projectionAxisTransformMatrix)

      arScene.camera.projectionMatrix.copy(projectionMatrix)

      // Potential fix for marker axis
      // var markerAxisTransformMatrix = new THREE.Matrix4().makeRotationX(Math.PI/4)
      // markerRoot.matrix.copy(markerRoot.matrix.multiply(markerAxisTransformMatrix))
    }
  }
}
