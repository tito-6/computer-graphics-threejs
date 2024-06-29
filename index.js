import * as THREE from 'three';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5; // moved the camera back to see the larger object

const scene = new THREE.Scene();

// Create a plane geometry for the background
const planeGeo = new THREE.PlaneGeometry(10, 10);

// Load the flag texture (replace with your image URL)
const flagTexture = new THREE.TextureLoader().load('https://example.com/image.png');

// Create a material for the background with the loaded flag texture
const planeMat = new THREE.MeshBasicMaterial({
  map: flagTexture,
  side: THREE.DoubleSide // Ensure the plane is visible from both sides
});

const planeMesh = new THREE.Mesh(planeGeo, planeMat);
planeMesh.position.z = -5; // move the plane to the back
scene.add(planeMesh);

const geo = new THREE.IcosahedronGeometry(1.5, 1); // decreased size to 1.5
const mat = new THREE.MeshStandardMaterial({
  color: 0xffaaff, // Adjusted color to a cool purple
  roughness: 0.7, // Added roughness for a more realistic appearance
  metalness: 0.5 // Added some metallic sheen
});

// Main center object
const meshCenter = new THREE.Mesh(geo, mat);
meshCenter.position.set(0, 0, 0); // Center
scene.add(meshCenter);

// Smaller left object
const geoLeft = new THREE.IcosahedronGeometry(1, 1);
const matLeft = new THREE.MeshStandardMaterial({
  color: 0xaaffaa, // Adjusted color to greenish
  roughness: 0.7,
  metalness: 0.5
});
const meshLeft = new THREE.Mesh(geoLeft, matLeft);
meshLeft.position.set(-3, 1.5, 0); // Left, smaller, positioned away from main object
scene.add(meshLeft);

// Smaller right object
const geoRight = new THREE.IcosahedronGeometry(1, 1);
const matRight = new THREE.MeshStandardMaterial({
  color: 0xaaaaff, // Adjusted color to bluish
  roughness: 0.7,
  metalness: 0.5
});
const meshRight = new THREE.Mesh(geoRight, matRight);
meshRight.position.set(3, -1.5, 0); // Right, smaller, positioned away from main object
scene.add(meshRight);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true
});
const wireMesh = new THREE.Mesh(geo, wireMat);
scene.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);

let rotX = 0;
let rotY = 0;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

// Handle mouse movement for rotation
document.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

document.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    let deltaX = event.clientX - mouseX;
    let deltaY = event.clientY - mouseY;
    rotY += deltaX * 0.01; // Adjust sensitivity for horizontal rotation
    rotX += deltaY * 0.01; // Adjust sensitivity for vertical rotation
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
});

// Handle mouse scroll for zooming
document.addEventListener('wheel', (event) => {
  camera.position.z += event.deltaY * 0.01; // Adjust zoom sensitivity
});

function animate() {
  requestAnimationFrame(animate);

  // Automatic rotation of main object
  meshCenter.rotation.x += 0.01;
  meshCenter.rotation.y += 0.01;

  // Rotation of left object (up and down around the main object)
  meshLeft.position.x = -3 + Math.cos(Date.now() * 0.001) * 1.5; // Adjust amplitude for left-right movement
  meshLeft.position.y = 1.5 + Math.sin(Date.now() * 0.001) * 1.5; // Adjust amplitude for up-down movement

  // Rotation of right object (right to left around the main object)
  meshRight.position.x = 3 + Math.sin(Date.now() * 0.001) * 1.5; // Adjust amplitude for left-right movement
  meshRight.position.y = -1.5 + Math.cos(Date.now() * 0.001) * 1.5; // Adjust amplitude for up-down movement

  // Rotate meshes based on mouse interaction
  meshCenter.rotation.x += 0.05 * (rotX - meshCenter.rotation.x);
  meshCenter.rotation.y += 0.05 * (rotY - meshCenter.rotation.y);

  renderer.render(scene, camera);
}

animate();
