import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  // 장면
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // 카메라
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    1e5
  )
  camera.position.z = 250
  camera.position.x = 100
  camera.position.y = 150

  // 렌더러
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  // orbitcontrol
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 20
  controls.maxDistance = 2000
  controls.update()

  // 빛
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(0, 2, 12)
  scene.add(pointLight)

  // svg?

  const fillMaterial = new THREE.MeshBasicMaterial({ color: '#F3FBFB' })
  const stokeMaterial = new THREE.LineBasicMaterial({
    color: '#00A5E6',
  })

  const loader = new SVGLoader()
  const svgUrl = '../static/objects/small-map.svg'
  const svgGroup = new THREE.Group()
  const updateMap = []
  svgGroup.scale.y *= -1

  loader.load(svgUrl, (data) => {
    data.paths.forEach((path) => {
      const shapes = path.toShapes(true)

      shapes.forEach((shape) => {
        const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
          depth: 20,
          bevelEnabled: false,
        })
        const linesGeometry = new THREE.EdgesGeometry(meshGeometry)
        const mesh = new THREE.Mesh(meshGeometry, fillMaterial)
        const lines = new THREE.LineSegments(linesGeometry, stokeMaterial)

        updateMap.push({ shape, mesh, lines })
        svgGroup.add(mesh, lines)
      })
    })
  })
  scene.add(svgGroup)

  svgGroup.position.x = -900
  svgGroup.position.y = -400
  svgGroup.position.z = -500
  svgGroup.rotateX(-Math.PI / 2)

  console.log(svgGroup)

  // 렌더링 루프
  function render(time) {
    time *= 0.001

    // cube.rotation.x = time
    // cube.rotation.y = time

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
