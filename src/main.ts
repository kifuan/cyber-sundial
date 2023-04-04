import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const PANEL_RADIUS = 15
const BG_COLOR = 0xCCCCCC
const SCALE_COLOR = 0x848482
const WHITE_COLOR = 0xFFFFFF
const AMBIENT_COLOR = 0x222222

const options = {
  lightSpeed: 0.1,
  rotateDirection: -1,
  showIcon: true,
  github: () => {
    window.open('https://github.com/kifuan/cyber-sundial')
  },
}

const gui = new GUI({
  title: 'Options',
})

gui.add(options, 'lightSpeed', 0.1, 10).name('Speed').listen()
gui.add(options, 'rotateDirection', { Clockwise: -1, AntiClockwise: 1 }).name('Direction').listen()
gui.add(options, 'showIcon').name('Show Icon').listen()
gui.add(options, 'github').name('GitHub')

function createSpotLight(scene: THREE.Scene): THREE.Object3D {
  const light = new THREE.SpotLight()
  light.angle = Math.PI / 5
  light.position.set(40, 40, 10)
  light.castShadow = true

  const container = new THREE.Object3D()
  container.add(light)
  scene.add(container)
  container.rotateY(2 * Math.PI * Math.random())
  return container
}

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
if (window.innerWidth <= window.innerHeight)
  camera.position.set(20, 70, 70)
else
  camera.position.set(15, 45, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 10, 0)
controls.update()

const scene = new THREE.Scene()
scene.background = new THREE.Color(BG_COLOR)
scene.fog = new THREE.FogExp2(BG_COLOR, 0.002)

// Objects
const material = new THREE.MeshStandardMaterial({ color: WHITE_COLOR })

const panelGeo = new THREE.CylinderGeometry(PANEL_RADIUS, PANEL_RADIUS, 1, 150)
const panelMesh = new THREE.Mesh(panelGeo, material)
panelMesh.position.set(0, 0, 0)
panelMesh.receiveShadow = true
scene.add(panelMesh)

const poleGeo = new THREE.CylinderGeometry(0.5, 0.5, 16)
const poleMesh = new THREE.Mesh(poleGeo, material)
poleMesh.position.set(0, 8, 0)
poleMesh.castShadow = true
scene.add(poleMesh)

// Icon
const iconMat = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load('icon.svg'),
  transparent: true,
  color: WHITE_COLOR,
  side: THREE.FrontSide,
})
const iconGeo = new THREE.BoxGeometry(PANEL_RADIUS / 2, 0.1, PANEL_RADIUS / 6)
const iconMesh = new THREE.Mesh(iconGeo, iconMat)
iconMesh.receiveShadow = true
iconMesh.position.set(0, 0.5, PANEL_RADIUS / 4)
iconMesh.scale.set(2, 0.1, 2)
scene.add(iconMesh)

// Scales
for (let i = 0; i < 12; i++) {
  const scaleGeo = new THREE.BoxGeometry(0.5, 0.5, PANEL_RADIUS / 4)
  const scaleMat = new THREE.MeshStandardMaterial({
    color: SCALE_COLOR,
  })
  const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat)
  scaleMesh.scale.set(1, 0.1, 1)

  const angle = i * Math.PI / 6 // Divide circle into 12 parts
  scaleMesh.position.set(Math.cos(angle) * PANEL_RADIUS * 0.85, 0.5, Math.sin(angle) * PANEL_RADIUS * 0.85)
  scaleMesh.lookAt(0, 0, 0)

  scene.add(scaleMesh) // Add the scale to the panel mesh
}

// Lights
scene.add(new THREE.AmbientLight(AMBIENT_COLOR))

const light1 = new THREE.DirectionalLight(WHITE_COLOR, 0.1)
light1.position.set(10, 10, 10)
scene.add(light1)

const light2 = new THREE.DirectionalLight(WHITE_COLOR, 0.5)
light2.position.set(-10, -10, -10)
scene.add(light2)

const spotLight = createSpotLight(scene)

document.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  iconMesh.visible = options.showIcon
  spotLight.rotateY(clock.getDelta() * options.lightSpeed * options.rotateDirection)
  renderer.render(scene, camera)
}

animate()
