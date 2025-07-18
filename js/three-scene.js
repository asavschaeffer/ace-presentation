/**
 * Three.js Scene Controller - Manages 3D desk environment and animations
 * Creates the chaotic desk with papers, watchtower, and plane elements
 */

class ThreeSceneController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.desk = null;
    this.papers = [];
    this.watchtower = null;
    this.plane = null;
    this.binder = null;
    this.dashboard = null;
    this.currentSection = 'chaos';
    this.isAnimating = false;
    
    // Animation settings
    this.animationDuration = 2000; // ms
    this.paperAnimationDelay = 100; // ms between paper animations
    
    // Scene parameters
    this.sceneParams = {
      paperCount: 30,
      deskSize: { width: 8, height: 0.2, depth: 6 },
      paperSize: { width: 0.8, height: 0.01, depth: 0.6 },
      cameraDistance: 12,
      lightIntensity: 0.8
    };
    
    // Bind methods
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    
    // Mouse interaction
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.hoveredPaper = null;
  }

  /**
   * Initialize the Three.js scene
   */
  init() {
    this.canvas = document.getElementById('three-canvas');
    if (!this.canvas) {
      console.error('Three.js canvas not found');
      return;
    }

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, this.sceneParams.cameraDistance);
    this.camera.lookAt(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add lights
    this.setupLights();

    // Create desk
    this.createDesk();

    // Create chaotic papers
    this.createChaoticPapers();

    // Create background elements
    this.createBackgroundElements();

    // Add event listeners
    this.setupEventListeners();

    // Start animation loop
    this.animate();

    console.log('Three.js scene initialized');
  }

  /**
   * Set up lighting for the scene
   */
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, this.sceneParams.lightIntensity);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Additional fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 8, -5);
    this.scene.add(fillLight);
  }

  /**
   * Create the desk surface
   */
  createDesk() {
    const geometry = new THREE.BoxGeometry(
      this.sceneParams.deskSize.width,
      this.sceneParams.deskSize.height,
      this.sceneParams.deskSize.depth
    );
    const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    this.desk = new THREE.Mesh(geometry, material);
    this.desk.position.y = -this.sceneParams.deskSize.height / 2;
    this.desk.receiveShadow = true;
    this.scene.add(this.desk);
  }

  /**
   * Create chaotic papers scattered on the desk
   */
  createChaoticPapers() {
    const problems = window.dataManager?.getProblemsBySection('valet') || [];
    
    for (let i = 0; i < this.sceneParams.paperCount; i++) {
      const paper = this.createPaper(i, problems[i % problems.length]);
      this.papers.push(paper);
      this.scene.add(paper);
    }
  }

  /**
   * Create a single paper with problem data
   * @param {number} index - Paper index
   * @param {Object} problemData - Problem data from JSON
   * @returns {THREE.Group} Paper group
   */
  createPaper(index, problemData) {
    const paperGroup = new THREE.Group();
    
    // Create paper geometry
    const geometry = new THREE.BoxGeometry(
      this.sceneParams.paperSize.width,
      this.sceneParams.paperSize.height,
      this.sceneParams.paperSize.depth
    );
    
    // Choose color based on problem data or default
    let color = 0xe74c3c; // Default red
    if (problemData) {
      switch (problemData.paper_color) {
        case 'red':
          color = 0xe74c3c;
          break;
        case 'yellow':
          color = 0xf39c12;
          break;
        case 'blue':
          color = 0x3498db;
          break;
        case 'green':
          color = 0x2ecc71;
          break;
      }
    }
    
    const material = new THREE.MeshLambertMaterial({ color });
    const paperMesh = new THREE.Mesh(geometry, material);
    
    // Position paper randomly on desk
    const deskBounds = {
      x: this.sceneParams.deskSize.width / 2 - 0.5,
      z: this.sceneParams.deskSize.depth / 2 - 0.5
    };
    
    paperMesh.position.x = (Math.random() - 0.5) * deskBounds.x * 2;
    paperMesh.position.z = (Math.random() - 0.5) * deskBounds.z * 2;
    paperMesh.position.y = this.sceneParams.paperSize.height / 2 + 0.01;
    
    // Add random rotation
    paperMesh.rotation.y = Math.random() * Math.PI * 2;
    paperMesh.rotation.z = (Math.random() - 0.5) * 0.3;
    
    // Add shadow
    paperMesh.castShadow = true;
    paperMesh.receiveShadow = true;
    
    // Store problem data
    paperMesh.userData = {
      problemData: problemData,
      originalPosition: paperMesh.position.clone(),
      originalRotation: paperMesh.rotation.clone(),
      index: index,
      isClickable: true
    };
    
    paperGroup.add(paperMesh);
    
    // Add hover effect materials
    paperMesh.material.userData = {
      originalColor: color,
      hoverColor: this.lightenColor(color, 0.3)
    };
    
    return paperGroup;
  }

  /**
   * Create background elements (watchtower, plane, etc.)
   */
  createBackgroundElements() {
    // Create firefighter (valet character)
    this.createFirefighter();
    
    // Create watchtower
    this.createWatchtower();
    
    // Create plane
    this.createPlane();
    
    // Create binder (initially hidden)
    this.createBinder();
  }

  /**
   * Create the firefighter (valet character)
   */
  createFirefighter() {
    this.firefighter = new THREE.Group();
    
    // Body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    
    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.25);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBB3 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.75;
    head.castShadow = true;
    
    // Helmet
    const helmetGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.2);
    const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.y = 1.9;
    helmet.castShadow = true;
    
    // Fire hose (simple cylinder)
    const hoseGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2);
    const hoseMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const hose = new THREE.Mesh(hoseGeometry, hoseMaterial);
    hose.position.set(0.5, 0.6, 0);
    hose.rotation.z = Math.PI / 4;
    
    // Fire axe (handle + blade)
    const axeHandleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
    const axeHandleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const axeHandle = new THREE.Mesh(axeHandleGeometry, axeHandleMaterial);
    axeHandle.position.set(-0.5, 0.4, 0);
    axeHandle.rotation.z = -Math.PI / 6;
    
    const axeBladeGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.05);
    const axeBladeMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
    const axeBlade = new THREE.Mesh(axeBladeGeometry, axeBladeMaterial);
    axeBlade.position.set(-0.7, 0.7, 0);
    
    this.firefighter.add(body);
    this.firefighter.add(head);
    this.firefighter.add(helmet);
    this.firefighter.add(hose);
    this.firefighter.add(axeHandle);
    this.firefighter.add(axeBlade);
    
    // Position firefighter
    this.firefighter.position.set(-5, 0, 0);
    this.firefighter.scale.set(0.8, 0.8, 0.8);
    this.firefighter.userData = {
      type: 'firefighter',
      isInteractable: true,
      isVisible: false
    };
    this.firefighter.name = 'firefighter';
    this.firefighter.visible = false; // Initially hidden
    
    this.scene.add(this.firefighter);
  }

  /**
   * Create the watchtower for manager layer
   */
  createWatchtower() {
    this.watchtower = new THREE.Group();
    
    // Tower base
    const baseGeometry = new THREE.CylinderGeometry(0.8, 1.2, 0.5, 8);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    
    // Tower body
    const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 3, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x95a5a6 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2;
    body.castShadow = true;
    
    // Tower top
    const topGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.5, 8);
    const topMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 3.75;
    top.castShadow = true;
    
    this.watchtower.add(base);
    this.watchtower.add(body);
    this.watchtower.add(top);
    
    // Position watchtower in background
    this.watchtower.position.set(-6, 0, -4);
    this.watchtower.scale.set(0.5, 0.5, 0.5);
    this.watchtower.visible = false; // Initially hidden
    
    this.scene.add(this.watchtower);
  }

  /**
   * Create the plane for executive layer
   */
  createPlane() {
    this.plane = new THREE.Group();
    
    // Plane body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.3, 0.8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.1, 0.05, 3);
    const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.5, 0, 0);
    leftWing.castShadow = true;
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.5, 0, 0);
    rightWing.castShadow = true;
    
    this.plane.add(body);
    this.plane.add(leftWing);
    this.plane.add(rightWing);
    
    // Position plane in background
    this.plane.position.set(0, 8, -8);
    this.plane.scale.set(0.3, 0.3, 0.3);
    this.plane.visible = false; // Initially hidden
    
    this.scene.add(this.plane);
  }

  /**
   * Create the binder for organized papers
   */
  createBinder() {
    this.binder = new THREE.Group();
    
    // Binder cover
    const coverGeometry = new THREE.BoxGeometry(2.5, 0.1, 3);
    const coverMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
    cover.castShadow = true;
    
    // Binder spine
    const spineGeometry = new THREE.BoxGeometry(0.2, 0.1, 3);
    const spineMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.x = -1.35;
    spine.castShadow = true;
    
    this.binder.add(cover);
    this.binder.add(spine);
    
    // Position binder off-screen initially
    this.binder.position.set(8, 0.5, 0);
    this.binder.visible = false;
    
    this.scene.add(this.binder);
  }

  /**
   * Set up event listeners for interaction
   */
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleClick);
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouch.bind(this));
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (!this.camera || !this.renderer) return;
    
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  /**
   * Handle mouse movement for hover effects
   * @param {Event} event - Mouse event
   */
  handleMouseMove(event) {
    if (!this.camera || !this.renderer) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for paper intersections
    const paperMeshes = this.papers.map(paper => paper.children[0]).filter(mesh => mesh && mesh.userData.isClickable);
    const intersects = this.raycaster.intersectObjects(paperMeshes);
    
    // Handle hover effects
    if (intersects.length > 0) {
      const hoveredMesh = intersects[0].object;
      if (this.hoveredPaper !== hoveredMesh) {
        // Reset previous hover
        if (this.hoveredPaper) {
          this.resetPaperHover(this.hoveredPaper);
        }
        
        // Set new hover
        this.hoveredPaper = hoveredMesh;
        this.setPaperHover(hoveredMesh);
      }
      
      // Change cursor
      this.canvas.style.cursor = 'pointer';
    } else {
      // Reset hover
      if (this.hoveredPaper) {
        this.resetPaperHover(this.hoveredPaper);
        this.hoveredPaper = null;
      }
      
      // Reset cursor
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * Handle click events
   * @param {Event} event - Click event
   */
  handleClick(event) {
    if (!this.camera || !this.renderer) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for paper intersections
    const paperMeshes = this.papers.map(paper => paper.children[0]).filter(mesh => mesh && mesh.userData.isClickable);
    let intersects = this.raycaster.intersectObjects(paperMeshes);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const problemData = clickedMesh.userData.problemData;
      
      if (problemData) {
        // Dispatch custom event for paper click
        const paperClickEvent = new CustomEvent('paperClicked', {
          detail: { problemData, paperMesh: clickedMesh }
        });
        window.dispatchEvent(paperClickEvent);
        return;
      }
    }
    
    // Check for interactive object intersections (firefighter, watchtower, plane, binder)
    const interactiveObjects = [];
    if (this.firefighter && this.firefighter.visible) {
      interactiveObjects.push(...this.firefighter.children);
    }
    if (this.watchtower && this.watchtower.visible) {
      interactiveObjects.push(...this.watchtower.children);
    }
    if (this.plane && this.plane.visible) {
      interactiveObjects.push(...this.plane.children);
    }
    if (this.binder && this.binder.visible) {
      interactiveObjects.push(...this.binder.children);
    }
    
    intersects = this.raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const parentGroup = clickedMesh.parent;
      
      if (parentGroup === this.firefighter) {
        this.onFirefighterClick();
      } else if (parentGroup === this.watchtower) {
        this.onWatchtowerClick();
      } else if (parentGroup === this.plane) {
        this.onPlaneClick();
      } else if (parentGroup === this.binder) {
        this.onBinderClick();
      }
    }
  }

  /**
   * Handle touch events for mobile
   * @param {Event} event - Touch event
   */
  handleTouch(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
      };
      
      if (event.type === 'touchstart') {
        this.handleMouseMove(fakeEvent);
      } else if (event.type === 'touchend') {
        this.handleClick(fakeEvent);
      }
    }
  }

  /**
   * Set paper hover effect
   * @param {THREE.Mesh} paperMesh - Paper mesh
   */
  setPaperHover(paperMesh) {
    if (!paperMesh.material.userData) return;
    
    // Scale up slightly
    paperMesh.scale.set(1.05, 1.05, 1.05);
    
    // Brighten color
    paperMesh.material.color.setHex(paperMesh.material.userData.hoverColor);
    
    // Add slight glow effect
    paperMesh.material.emissive.setHex(0x222222);
  }

  /**
   * Reset paper hover effect
   * @param {THREE.Mesh} paperMesh - Paper mesh
   */
  resetPaperHover(paperMesh) {
    if (!paperMesh.material.userData) return;
    
    // Reset scale
    paperMesh.scale.set(1, 1, 1);
    
    // Reset color
    paperMesh.material.color.setHex(paperMesh.material.userData.originalColor);
    
    // Remove glow
    paperMesh.material.emissive.setHex(0x000000);
  }

  /**
   * Transition to a specific section
   * @param {string} sectionId - Section ID
   */
  transitionToSection(sectionId) {
    if (this.currentSection === sectionId || this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentSection = sectionId;
    
    switch (sectionId) {
      case 'chaos':
        this.transitionToChaos();
        break;
      case 'valet':
        this.transitionToValet();
        break;
      case 'manager':
        this.transitionToManager();
        break;
      case 'executive':
        this.transitionToExecutive();
        break;
      case 'closing':
        this.transitionToClosing();
        break;
    }
    
    // Update camera position
    this.animateCamera(sectionId);
  }

  /**
   * Transition to chaos section
   */
  transitionToChaos() {
    // Show chaotic papers
    this.papers.forEach((paper, index) => {
      const paperMesh = paper.children[0];
      if (paperMesh) {
        paperMesh.visible = true;
        paperMesh.userData.isClickable = true;
        
        // Animate papers back to chaotic positions
        this.animatePaperToPosition(
          paperMesh,
          paperMesh.userData.originalPosition,
          paperMesh.userData.originalRotation,
          index * this.paperAnimationDelay
        );
      }
    });
    
    // Hide other elements
    this.watchtower.visible = false;
    this.plane.visible = false;
    this.binder.visible = false;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Transition to valet section
   */
  transitionToValet() {
    // Keep papers visible but ready for animation
    this.papers.forEach(paper => {
      const paperMesh = paper.children[0];
      if (paperMesh) {
        paperMesh.visible = true;
        paperMesh.userData.isClickable = true;
      }
    });
    
    // Show firefighter
    this.firefighter.visible = true;
    this.firefighter.userData.isVisible = true;
    
    // Show background elements subtly
    this.watchtower.visible = true;
    this.watchtower.traverse(child => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.3;
      }
    });
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Transition to manager section
   */
  transitionToManager() {
    // Make watchtower prominent
    this.watchtower.visible = true;
    this.watchtower.traverse(child => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
      }
    });
    
    // Animate some papers to binder
    this.showBinder();
    
    // Show plane subtly
    this.plane.visible = true;
    this.plane.traverse(child => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.3;
      }
    });
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Transition to executive section
   */
  transitionToExecutive() {
    // Make plane prominent
    this.plane.visible = true;
    this.plane.traverse(child => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
      }
    });
    
    // Start plane animation
    this.startPlaneAnimation();
    
    // Keep binder visible
    this.binder.visible = true;
    
    // Fade out chaotic papers
    this.papers.forEach(paper => {
      const paperMesh = paper.children[0];
      if (paperMesh) {
        paperMesh.material.transparent = true;
        paperMesh.material.opacity = 0.3;
        paperMesh.userData.isClickable = false;
      }
    });
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Transition to closing section
   */
  transitionToClosing() {
    // Clean up the desk - hide chaotic papers
    this.papers.forEach(paper => {
      const paperMesh = paper.children[0];
      if (paperMesh) {
        paperMesh.visible = false;
        paperMesh.userData.isClickable = false;
      }
    });
    
    // Show organized elements
    this.binder.visible = true;
    this.binder.position.set(0, 0.5, 0);
    
    // Create tablet for dashboard
    this.createTablet();
    
    // Show all background elements aligned
    this.watchtower.visible = true;
    this.plane.visible = true;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Show the binder with animation
   */
  showBinder() {
    this.binder.visible = true;
    
    // Animate binder sliding in
    const startPosition = { x: 8, y: 0.5, z: 0 };
    const endPosition = { x: 2, y: 0.5, z: 0 };
    
    this.animateObjectToPosition(this.binder, startPosition, endPosition, 1000);
  }

  /**
   * Create tablet for dashboard display
   */
  createTablet() {
    if (this.tablet) return;
    
    this.tablet = new THREE.Group();
    
    // Tablet body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.05, 1);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    
    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1.3, 0.8);
    const screenMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x000000,
      emissive: 0x001122
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 0.026;
    screen.rotation.x = -Math.PI / 2;
    
    this.tablet.add(body);
    this.tablet.add(screen);
    
    // Position tablet on desk
    this.tablet.position.set(-1.5, 0.15, 0);
    this.tablet.rotation.x = -0.1;
    
    this.scene.add(this.tablet);
  }

  /**
   * Start plane animation (circular motion)
   */
  startPlaneAnimation() {
    if (this.planeAnimation) return;
    
    const radius = 6;
    const centerX = 0;
    const centerZ = -8;
    const centerY = 8;
    let angle = 0;
    
    this.planeAnimation = setInterval(() => {
      angle += 0.02;
      
      this.plane.position.x = centerX + Math.cos(angle) * radius;
      this.plane.position.z = centerZ + Math.sin(angle) * radius;
      this.plane.position.y = centerY;
      
      // Make plane face forward in its motion
      this.plane.lookAt(
        centerX + Math.cos(angle + 0.1) * radius,
        centerY,
        centerZ + Math.sin(angle + 0.1) * radius
      );
    }, 16); // ~60fps
  }

  /**
   * Stop plane animation
   */
  stopPlaneAnimation() {
    if (this.planeAnimation) {
      clearInterval(this.planeAnimation);
      this.planeAnimation = null;
    }
  }

  /**
   * Animate paper to binder
   * @param {THREE.Mesh} paperMesh - Paper mesh to animate
   * @param {Function} callback - Callback when animation completes
   */
  animatePaperToBinder(paperMesh, callback) {
    if (!paperMesh || !this.binder) return;
    
    // Change paper color to blue (solution color)
    paperMesh.material.color.setHex(0x3498db);
    
    // Animate to binder position
    const binderPosition = this.binder.position.clone();
    binderPosition.y += 0.2;
    
    this.animatePaperToPosition(
      paperMesh,
      binderPosition,
      { x: 0, y: 0, z: 0 },
      0,
      () => {
        // Hide paper after animation
        paperMesh.visible = false;
        paperMesh.userData.isClickable = false;
        
        if (callback) callback();
      }
    );
  }

  /**
   * Animate paper to specific position
   * @param {THREE.Mesh} paperMesh - Paper mesh
   * @param {THREE.Vector3} targetPosition - Target position
   * @param {THREE.Euler} targetRotation - Target rotation
   * @param {number} delay - Animation delay
   * @param {Function} callback - Callback when animation completes
   */
  animatePaperToPosition(paperMesh, targetPosition, targetRotation, delay = 0, callback) {
    setTimeout(() => {
      const startPosition = paperMesh.position.clone();
      const startRotation = paperMesh.rotation.clone();
      const duration = 1000;
      const startTime = Date.now();
      
      const animateStep = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeOutCubic(progress);
        
        // Interpolate position
        paperMesh.position.lerpVectors(startPosition, targetPosition, easeProgress);
        
        // Interpolate rotation
        paperMesh.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easeProgress;
        paperMesh.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeProgress;
        paperMesh.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * easeProgress;
        
        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else if (callback) {
          callback();
        }
      };
      
      animateStep();
    }, delay);
  }

  /**
   * Animate object to position
   * @param {THREE.Object3D} object - Object to animate
   * @param {Object} startPos - Start position
   * @param {Object} endPos - End position
   * @param {number} duration - Animation duration
   */
  animateObjectToPosition(object, startPos, endPos, duration) {
    const startTime = Date.now();
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutCubic(progress);
      
      object.position.x = startPos.x + (endPos.x - startPos.x) * easeProgress;
      object.position.y = startPos.y + (endPos.y - startPos.y) * easeProgress;
      object.position.z = startPos.z + (endPos.z - startPos.z) * easeProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
    
    animateStep();
  }

  /**
   * Animate camera for section transition
   * @param {string} sectionId - Section ID
   */
  animateCamera(sectionId) {
    const targetPositions = {
      chaos: { x: 0, y: 8, z: 12 },
      valet: { x: 0, y: 6, z: 10 },
      manager: { x: -3, y: 7, z: 8 },
      executive: { x: 0, y: 12, z: 6 },
      closing: { x: 0, y: 8, z: 12 }
    };
    
    const targetPosition = targetPositions[sectionId];
    if (!targetPosition) return;
    
    const startPosition = this.camera.position.clone();
    const endPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    const duration = 2000;
    const startTime = Date.now();
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutCubic(progress);
      
      this.camera.position.lerpVectors(startPosition, endPosition, easeProgress);
      this.camera.lookAt(0, 0, 0);
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
    
    animateStep();
  }

  /**
   * Ease out cubic function
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value
   */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Lighten a color
   * @param {number} color - Original color hex
   * @param {number} amount - Amount to lighten (0-1)
   * @returns {number} Lightened color hex
   */
  lightenColor(color, amount) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
    
    return (newR << 16) | (newG << 8) | newB;
  }

  /**
   * Main animation loop
   */
  animate() {
    requestAnimationFrame(this.animate);
    
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stopPlaneAnimation();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('click', this.handleClick);
    }
    
    console.log('Three.js scene cleaned up');
  }

  /**
   * Get current section
   * @returns {string} Current section ID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Check if scene is animating
   * @returns {boolean} Is animating
   */
  getIsAnimating() {
    return this.isAnimating;
  }

  /**
   * Handle firefighter click
   */
  onFirefighterClick() {
    console.log('Firefighter clicked!');
    
    // Animate firefighter action
    this.animateFirefighterAction();
    
    // Dispatch event
    const firefighterClickEvent = new CustomEvent('firefighterClicked', {
      detail: { 
        character: 'firefighter',
        message: 'The valet is ready to tackle problems as they arise!'
      }
    });
    window.dispatchEvent(firefighterClickEvent);
  }

  /**
   * Handle watchtower click
   */
  onWatchtowerClick() {
    console.log('Watchtower clicked!');
    
    // Animate watchtower action
    this.animateWatchtowerAction();
    
    // Dispatch event
    const watchtowerClickEvent = new CustomEvent('watchtowerClicked', {
      detail: { 
        character: 'watchtower',
        message: 'The manager oversees operations from the watchtower!'
      }
    });
    window.dispatchEvent(watchtowerClickEvent);
  }

  /**
   * Handle plane click
   */
  onPlaneClick() {
    console.log('Plane clicked!');
    
    // Animate plane action
    this.animatePlaneAction();
    
    // Dispatch event
    const planeClickEvent = new CustomEvent('planeClicked', {
      detail: { 
        character: 'plane',
        message: 'The executive surveys the big picture from above!'
      }
    });
    window.dispatchEvent(planeClickEvent);
  }

  /**
   * Handle binder click
   */
  onBinderClick() {
    console.log('Binder clicked!');
    
    // Animate binder opening
    this.animateBinderOpening();
    
    // Dispatch event
    const binderClickEvent = new CustomEvent('binderClicked', {
      detail: { 
        object: 'binder',
        message: 'The operations manual contains all systematic procedures!'
      }
    });
    window.dispatchEvent(binderClickEvent);
  }

  /**
   * Animate firefighter action
   */
  animateFirefighterAction() {
    const originalY = this.firefighter.position.y;
    const startTime = Date.now();
    const duration = 1000;
    
    // Create water spray effect
    this.createWaterSprayEffect();
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const bounce = Math.sin(progress * Math.PI * 4) * 0.2;
      this.firefighter.position.y = originalY + bounce;
      
      // Rotate the hose
      const hose = this.firefighter.children.find(child => child.material && child.material.color.getHex() === 0x333333);
      if (hose) {
        hose.rotation.y = Math.sin(progress * Math.PI * 8) * 0.3;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.firefighter.position.y = originalY;
        if (hose) hose.rotation.y = 0;
      }
    };
    
    animateStep();
  }

  /**
   * Animate watchtower action
   */
  animateWatchtowerAction() {
    const originalRotation = this.watchtower.rotation.y;
    const startTime = Date.now();
    const duration = 2000;
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.watchtower.rotation.y = originalRotation + progress * Math.PI * 2;
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.watchtower.rotation.y = originalRotation;
      }
    };
    
    animateStep();
  }

  /**
   * Animate plane action
   */
  animatePlaneAction() {
    const originalPosition = this.plane.position.clone();
    const startTime = Date.now();
    const duration = 3000;
    const radius = 8;
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const angle = progress * Math.PI * 2;
      this.plane.position.x = originalPosition.x + Math.cos(angle) * radius;
      this.plane.position.z = originalPosition.z + Math.sin(angle) * radius;
      this.plane.rotation.y = angle + Math.PI / 2;
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.plane.position.copy(originalPosition);
        this.plane.rotation.y = 0;
      }
    };
    
    animateStep();
  }

  /**
   * Animate binder opening
   */
  animateBinderOpening() {
    const coverMesh = this.binder.children[0];
    if (!coverMesh) return;
    
    const startTime = Date.now();
    const duration = 1000;
    
    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const openAngle = progress * Math.PI / 2;
      coverMesh.rotation.z = openAngle;
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
    
    animateStep();
  }

  /**
   * Create water spray effect
   */
  createWaterSprayEffect() {
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.02),
        new THREE.MeshLambertMaterial({ color: 0x87CEEB })
      );
      
      particle.position.set(
        this.firefighter.position.x + 0.5,
        this.firefighter.position.y + 1,
        this.firefighter.position.z
      );
      
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.2,
        (Math.random() - 0.5) * 0.1
      );
      
      particles.push(particle);
      this.scene.add(particle);
    }
    
    // Animate particles
    const animateParticles = () => {
      particles.forEach(particle => {
        particle.position.add(particle.velocity);
        particle.velocity.y -= 0.01; // Gravity
        particle.material.opacity -= 0.02;
        
        if (particle.material.opacity <= 0) {
          this.scene.remove(particle);
        }
      });
      
      if (particles.some(p => p.material.opacity > 0)) {
        requestAnimationFrame(animateParticles);
      }
    };
    
    animateParticles();
  }
}

// Create global instance
window.threeScene = new ThreeSceneController();