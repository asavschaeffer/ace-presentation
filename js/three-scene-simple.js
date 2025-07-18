/**
 * Simple Three.js Scene Controller
 * Clean, professional approach with cube placeholders for easy asset swapping
 */

class ThreeSceneController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Game objects - simple placeholders
    this.gameObjects = {
      desk: null,
      papers: [],
      firefighter: null,
      watchtower: null,
      plane: null,
      binder: null
    };
    
    // Asset paths for easy swapping
    this.assetPaths = {
      firefighter: '/assets/3d/firefighter.glb',
      watchtower: '/assets/3d/watchtower.glb',
      plane: '/assets/3d/plane.glb',
      binder: '/assets/3d/binder.glb'
    };
    
    // Interaction state
    this.interactiveObjects = [];
    this.currentSection = 'chaos';
    
    // Bind methods
    this.animate = this.animate.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  /**
   * Initialize the scene
   */
  init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLights();
    this.createGameObjects();
    this.setupInteraction();
    this.startRenderLoop();
    
    console.log('Three.js scene initialized');
  }

  /**
   * Setup WebGL renderer
   */
  setupRenderer() {
    this.canvas = document.getElementById('three-canvas');
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  /**
   * Setup scene
   */
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
  }

  /**
   * Setup camera
   */
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Setup lighting
   */
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  /**
   * Create all game objects with simple placeholders
   */
  createGameObjects() {
    this.createDesk();
    this.createPapers();
    this.createCharacterPlaceholders();
  }

  /**
   * Create desk - simple plane
   */
  createDesk() {
    const geometry = new THREE.BoxGeometry(8, 0.2, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    this.gameObjects.desk = new THREE.Mesh(geometry, material);
    this.gameObjects.desk.position.y = -0.1;
    this.gameObjects.desk.receiveShadow = true;
    this.gameObjects.desk.name = 'desk';
    
    this.scene.add(this.gameObjects.desk);
  }

  /**
   * Create paper objects - simple cubes
   */
  createPapers() {
    const problems = window.dataManager?.getProblemsBySection('valet') || [];
    const paperCount = Math.min(problems.length, 12);
    
    for (let i = 0; i < paperCount; i++) {
      const paper = this.createPaper(i, problems[i]);
      this.gameObjects.papers.push(paper);
      this.scene.add(paper);
      this.interactiveObjects.push(paper);
    }
  }

  /**
   * Create single paper cube
   */
  createPaper(index, problemData) {
    const geometry = new THREE.BoxGeometry(0.8, 0.05, 0.6);
    const color = problemData?.paper_color === 'yellow' ? 0xFFD700 : 0xFF4444;
    const material = new THREE.MeshLambertMaterial({ color });
    
    const paper = new THREE.Mesh(geometry, material);
    
    // Random position on desk
    paper.position.x = (Math.random() - 0.5) * 6;
    paper.position.z = (Math.random() - 0.5) * 4;
    paper.position.y = 0.1;
    paper.rotation.y = Math.random() * Math.PI;
    
    paper.castShadow = true;
    paper.name = `paper-${index}`;
    paper.userData = { 
      type: 'paper', 
      problemData,
      index,
      originalPosition: paper.position.clone()
    };
    
    return paper;
  }

  /**
   * Create character placeholders - simple colored cubes
   */
  createCharacterPlaceholders() {
    // Firefighter - red cube
    this.gameObjects.firefighter = this.createPlaceholderCube(
      { x: -4, y: 1, z: 0 }, 
      0xFF0000, 
      'firefighter'
    );
    
    // Watchtower - gray cube
    this.gameObjects.watchtower = this.createPlaceholderCube(
      { x: 4, y: 2, z: -2 }, 
      0x808080, 
      'watchtower'
    );
    
    // Plane - blue cube
    this.gameObjects.plane = this.createPlaceholderCube(
      { x: 0, y: 6, z: -4 }, 
      0x0066FF, 
      'plane'
    );
    
    // Binder - dark blue cube
    this.gameObjects.binder = this.createPlaceholderCube(
      { x: 2, y: 0.5, z: 1 }, 
      0x2C3E50, 
      'binder'
    );
    
    // Add to interactive objects
    Object.values(this.gameObjects).forEach(obj => {
      if (obj && obj.userData?.type) {
        this.interactiveObjects.push(obj);
      }
    });
  }

  /**
   * Create placeholder cube
   */
  createPlaceholderCube(position, color, type) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.castShadow = true;
    cube.name = type;
    cube.userData = { 
      type,
      isPlaceholder: true,
      assetPath: this.assetPaths[type]
    };
    
    this.scene.add(cube);
    return cube;
  }

  /**
   * Setup interaction
   */
  setupInteraction() {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('click', this.onMouseClick);
    window.addEventListener('resize', this.onWindowResize);
  }

  /**
   * Handle mouse movement
   */
  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
    
    // Reset all hover states
    this.interactiveObjects.forEach(obj => {
      obj.scale.set(1, 1, 1);
      obj.material.emissive.setHex(0x000000);
    });
    
    // Apply hover to intersected object
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      hoveredObject.scale.set(1.1, 1.1, 1.1);
      hoveredObject.material.emissive.setHex(0x444444);
      this.canvas.style.cursor = 'pointer';
      
      // Show tooltip
      this.showTooltip(hoveredObject, event.clientX, event.clientY);
    } else {
      this.canvas.style.cursor = 'crosshair';
      this.hideTooltip();
    }
  }

  /**
   * Handle mouse click
   */
  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      this.handleObjectClick(clickedObject);
    }
  }

  /**
   * Handle object click
   */
  handleObjectClick(object) {
    const { type, problemData } = object.userData;
    
    console.log(`Clicked ${type}:`, object.name);
    
    switch (type) {
      case 'paper':
        this.handlePaperClick(object, problemData);
        break;
      case 'firefighter':
        this.handleCharacterClick('firefighter', 'The valet is ready to tackle problems!');
        break;
      case 'watchtower':
        this.handleCharacterClick('watchtower', 'The manager oversees from the watchtower!');
        break;
      case 'plane':
        this.handleCharacterClick('plane', 'The executive surveys from above!');
        break;
      case 'binder':
        this.handleCharacterClick('binder', 'The operations manual!');
        break;
    }
  }

  /**
   * Handle paper click
   */
  handlePaperClick(paper, problemData) {
    if (problemData) {
      window.dispatchEvent(new CustomEvent('paperClicked', {
        detail: { problemData, paperMesh: paper }
      }));
    }
  }

  /**
   * Handle character click
   */
  handleCharacterClick(type, message) {
    // Simple bounce animation
    const object = this.gameObjects[type];
    if (object) {
      this.animateBounce(object);
    }
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent(`${type}Clicked`, {
      detail: { type, message }
    }));
  }

  /**
   * Simple bounce animation
   */
  animateBounce(object) {
    const originalY = object.position.y;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 500, 1);
      
      object.position.y = originalY + Math.sin(progress * Math.PI) * 0.5;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        object.position.y = originalY;
      }
    };
    
    animate();
  }

  /**
   * Transition to section
   */
  transitionToSection(sectionId) {
    this.currentSection = sectionId;
    
    // Simple camera transitions
    const cameraTargets = {
      chaos: { x: 0, y: 5, z: 10 },
      valet: { x: -4, y: 4, z: 8 },
      manager: { x: 4, y: 6, z: 6 },
      executive: { x: 0, y: 8, z: 4 },
      closing: { x: 0, y: 5, z: 10 }
    };
    
    const target = cameraTargets[sectionId];
    if (target) {
      this.animateCameraTo(target);
    }
    
    // Show/hide objects based on section
    this.updateObjectVisibility(sectionId);
  }

  /**
   * Update object visibility
   */
  updateObjectVisibility(sectionId) {
    const { firefighter, watchtower, plane, binder } = this.gameObjects;
    
    switch (sectionId) {
      case 'chaos':
        firefighter.visible = false;
        watchtower.visible = false;
        plane.visible = false;
        binder.visible = false;
        break;
      case 'valet':
        firefighter.visible = true;
        watchtower.visible = false;
        plane.visible = false;
        binder.visible = false;
        break;
      case 'manager':
        firefighter.visible = true;
        watchtower.visible = true;
        plane.visible = false;
        binder.visible = true;
        break;
      case 'executive':
        firefighter.visible = true;
        watchtower.visible = true;
        plane.visible = true;
        binder.visible = true;
        break;
      case 'closing':
        firefighter.visible = true;
        watchtower.visible = true;
        plane.visible = true;
        binder.visible = true;
        break;
    }
  }

  /**
   * Animate camera to position
   */
  animateCameraTo(target) {
    const start = this.camera.position.clone();
    const end = new THREE.Vector3(target.x, target.y, target.z);
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 1000, 1);
      
      this.camera.position.lerpVectors(start, end, progress);
      this.camera.lookAt(0, 0, 0);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Start render loop
   */
  startRenderLoop() {
    this.animate();
  }

  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Replace placeholder with 3D model
   * Call this when you want to swap in actual 3D assets
   */
  async replacePlaceholder(type, modelPath) {
    const placeholder = this.gameObjects[type];
    if (!placeholder) return;
    
    try {
      // This is where you'd load your 3D model
      // const loader = new THREE.GLTFLoader();
      // const gltf = await loader.loadAsync(modelPath);
      // const model = gltf.scene;
      
      // For now, just log the swap
      console.log(`Ready to swap ${type} placeholder with model from ${modelPath}`);
      
      // Copy transform and userData
      // model.position.copy(placeholder.position);
      // model.userData = placeholder.userData;
      
      // Replace in scene
      // this.scene.remove(placeholder);
      // this.scene.add(model);
      // this.gameObjects[type] = model;
      
    } catch (error) {
      console.error(`Failed to load model for ${type}:`, error);
    }
  }

  /**
   * Get game object by type
   */
  getGameObject(type) {
    return this.gameObjects[type];
  }

  /**
   * Animate paper to binder (for main.js compatibility)
   */
  animatePaperToBinder(paperMesh, callback) {
    if (!paperMesh) return;
    
    // Simple animation to binder position
    const binder = this.gameObjects.binder;
    if (binder) {
      const startPos = paperMesh.position.clone();
      const endPos = binder.position.clone();
      endPos.y += 0.5;
      
      const startTime = Date.now();
      const duration = 1000;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        paperMesh.position.lerpVectors(startPos, endPos, progress);
        paperMesh.rotation.y += 0.1;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Hide paper and call callback
          paperMesh.visible = false;
          if (callback) callback();
        }
      };
      
      animate();
    }
  }

  /**
   * Show tooltip for hovered object
   */
  showTooltip(object, x, y) {
    const { type, problemData } = object.userData;
    
    let tooltipText = '';
    switch (type) {
      case 'paper':
        tooltipText = problemData ? problemData.title : 'Click to view problem';
        break;
      case 'firefighter':
        tooltipText = 'Valet (Firefighter) - Click to learn more';
        break;
      case 'watchtower':
        tooltipText = 'Manager (Watchtower) - Click to learn more';
        break;
      case 'plane':
        tooltipText = 'Executive (Plane) - Click to learn more';
        break;
      case 'binder':
        tooltipText = 'Operations Manual - Click to open';
        break;
      default:
        tooltipText = 'Click to interact';
    }
    
    // Create tooltip if it doesn't exist
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'scene-tooltip';
      document.body.appendChild(this.tooltip);
    }
    
    this.tooltip.textContent = tooltipText;
    this.tooltip.style.left = (x + 10) + 'px';
    this.tooltip.style.top = (y - 30) + 'px';
    this.tooltip.classList.add('show');
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.classList.remove('show');
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onMouseClick);
    window.removeEventListener('resize', this.onWindowResize);
    
    if (this.tooltip) {
      document.body.removeChild(this.tooltip);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Create global instance
window.threeScene = new ThreeSceneController();