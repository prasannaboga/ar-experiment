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
    // Creates a scene.
    var scene = new THREE.Scene()

    // Creates the renderer and appends it to the DOM.
    var renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    root.appendChild(renderer.domElement)

    var markerRoot = arController.createThreeBarcodeMarker(20)

    // Creates the text.
    var geometry = new THREE.TextGeometry('AR', {
      font:   font,
      size:   1,
      height: 0.1
    })
    var material = new THREE.MeshBasicMaterial({color: 0xffa500})

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

    // Adds the master to the sceene.
    arScene.scene.add(markerRoot)

    var tick = function() {
      arScene.process()
      arScene.renderOn(renderer)
      requestAnimationFrame(tick)
    }

    tick()
  }
}
