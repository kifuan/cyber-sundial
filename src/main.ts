import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const RADIUS = 15

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(10, 45, 35)

// Mouse control
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 10, 0)
controls.update()

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xCCCCCC)
scene.fog = new THREE.FogExp2(0xCCCCCC, 0.002)

// Objects
const panelGeo = new THREE.CylinderGeometry(RADIUS, RADIUS, 1, 150)
const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
const panelMesh = new THREE.Mesh(panelGeo, material)
panelMesh.position.set(0, 0, 0)
panelMesh.receiveShadow = true
scene.add(panelMesh)

const poleGeo = new THREE.CylinderGeometry(0.5, 0.5, 16)
const poleMesh = new THREE.Mesh(poleGeo, material)
poleMesh.position.set(0, 8, 0)
poleMesh.castShadow = true
scene.add(poleMesh)

// Scales
for (let i = 0; i < 12; i++) {
  const scaleGeo = new THREE.BoxGeometry(0.5, 0.5, RADIUS / 4)
  const scaleMat = new THREE.MeshStandardMaterial({ color: 0x848482 })
  const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat)

  const angle = i * Math.PI / 6 // Divide circle into 12 parts
  scaleMesh.position.set(Math.cos(angle) * RADIUS * 0.85, 0.5, Math.sin(angle) * RADIUS * 0.85)
  scaleMesh.lookAt(0, 0, 0)

  panelMesh.add(scaleMesh) // Add the scale to the panel mesh
}

// Lights
scene.add(new THREE.AmbientLight(0x222222))

const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.1)
dirLight1.position.set(10, 10, 10)
scene.add(dirLight1)

const dirLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.5)
dirLight2.position.set(-10, -10, -10)
scene.add(dirLight2)

const spotLight = new THREE.SpotLight(0xFFFFFF)
spotLight.angle = Math.PI / 5
spotLight.position.set(40, 40, 10)
spotLight.castShadow = true

const spotLightContainer = new THREE.Object3D()
spotLightContainer.add(spotLight)
scene.add(spotLightContainer)
spotLightContainer.rotateY(2 * Math.PI * Math.random())

const clock = new THREE.Clock()

document.body.appendChild(renderer.domElement)

document.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  spotLightContainer.rotateY(delta * 0.05)
  renderer.render(scene, camera)
}

animate()
