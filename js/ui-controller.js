/**
 * UI Controller - Handles all user interface interactions
 * Manages UI state, animations, and user interactions
 */

class UIController {
  constructor() {
    this.isInitialized = false;
    this.activeSection = 'chaos';
    this.animations = new Map();
    
    // UI Elements
    this.navigationElements = {};
    this.sectionElements = {};
    this.interactiveElements = {};
    
    // Bind methods
    this.handleUIClick = this.handleUIClick.bind(this);
    this.handleUIHover = this.handleUIHover.bind(this);
    this.handleUIKeyboard = this.handleUIKeyboard.bind(this);
  }

  /**
   * Initialize UI Controller
   */
  init() {
    this.setupUIElements();
    this.setupEventListeners();
    this.initializeAnimations();
    
    this.isInitialized = true;
    console.log('UI Controller initialized');
  }

  /**
   * Setup UI element references
   */
  setupUIElements() {
    // Navigation elements
    this.navigationElements = {
      skipMenu: document.getElementById('skip-menu'),
      skipMenuBtn: document.getElementById('skip-menu-btn'),
      demoBtn: document.getElementById('demo-mode-btn'),
      presenterBtn: document.getElementById('presenter-mode-btn')
    };

    // Section elements
    this.sectionElements = {
      chaos: document.getElementById('section-chaos'),
      valet: document.getElementById('section-valet'),
      manager: document.getElementById('section-manager'),
      executive: document.getElementById('section-executive'),
      closing: document.getElementById('section-closing')
    };

    // Interactive elements
    this.interactiveElements = {
      papers: document.querySelectorAll('.chaos-paper'),
      solutions: document.querySelectorAll('.solution-card'),
      kpis: document.querySelectorAll('.kpi-card'),
      binder: document.getElementById('operations-binder'),
      roiSlider: document.getElementById('training-investment')
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Click handlers
    document.addEventListener('click', this.handleUIClick);
    
    // Hover handlers
    document.addEventListener('mouseover', this.handleUIHover);
    document.addEventListener('mouseout', this.handleUIHover);
    
    // Keyboard handlers
    document.addEventListener('keydown', this.handleUIKeyboard);
    
    // Custom events
    window.addEventListener('sectionChanged', this.handleSectionChange.bind(this));
    window.addEventListener('threeSceneReady', this.handleThreeSceneReady.bind(this));
  }

  /**
   * Initialize UI animations
   */
  initializeAnimations() {
    // Fade in animations for sections
    this.animations.set('fadeIn', {
      duration: 500,
      easing: 'ease-out'
    });

    // Slide animations for navigation
    this.animations.set('slideIn', {
      duration: 300,
      easing: 'ease-in-out'
    });

    // Pulse animations for interactive elements
    this.animations.set('pulse', {
      duration: 1000,
      easing: 'ease-in-out',
      iteration: 'infinite'
    });
  }

  /**
   * Handle UI clicks
   * @param {Event} e - Click event
   */
  handleUIClick(e) {
    const target = e.target;
    
    // Handle navigation clicks
    if (target.classList.contains('skip-item')) {
      const section = target.dataset.section;
      this.navigateToSection(section);
      return;
    }

    // Handle paper clicks
    if (target.classList.contains('chaos-paper')) {
      const problemId = target.dataset.problemId;
      this.handlePaperClick(problemId);
      return;
    }

    // Handle solution clicks
    if (target.classList.contains('solution-card')) {
      const solutionId = target.dataset.solutionId;
      this.handleSolutionClick(solutionId);
      return;
    }

    // Handle KPI clicks
    if (target.classList.contains('kpi-card')) {
      const kpiId = target.dataset.kpiId;
      this.handleKPIClick(kpiId);
      return;
    }

    // Handle binder clicks
    if (target.id === 'operations-binder' || target.closest('#operations-binder')) {
      this.handleBinderClick();
      return;
    }
  }

  /**
   * Handle UI hover events
   * @param {Event} e - Mouse event
   */
  handleUIHover(e) {
    const target = e.target;
    const isHovering = e.type === 'mouseover';

    // Handle paper hover effects
    if (target.classList.contains('chaos-paper')) {
      this.handlePaperHover(target, isHovering);
      return;
    }

    // Handle solution hover effects
    if (target.classList.contains('solution-card')) {
      this.handleSolutionHover(target, isHovering);
      return;
    }

    // Handle KPI hover effects
    if (target.classList.contains('kpi-card')) {
      this.handleKPIHover(target, isHovering);
      return;
    }
  }

  /**
   * Handle UI keyboard events
   * @param {Event} e - Keyboard event
   */
  handleUIKeyboard(e) {
    // Skip if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key) {
      case 'Tab':
        this.handleTabNavigation(e);
        break;
      case 'Enter':
        this.handleEnterKey(e);
        break;
      case ' ':
        this.handleSpaceKey(e);
        break;
    }
  }

  /**
   * Handle paper click
   * @param {string} problemId - Problem ID
   */
  handlePaperClick(problemId) {
    const problemData = window.dataManager.getProblemById(problemId);
    if (problemData) {
      // Dispatch event for 3D scene
      window.dispatchEvent(new CustomEvent('paperClicked', {
        detail: { problemData, problemId }
      }));
    }
  }

  /**
   * Handle solution click
   * @param {string} solutionId - Solution ID
   */
  handleSolutionClick(solutionId) {
    const solutionData = window.dataManager.getSolutionById(solutionId);
    if (solutionData) {
      // Show solution details
      window.dispatchEvent(new CustomEvent('solutionClicked', {
        detail: { solutionData, solutionId }
      }));
    }
  }

  /**
   * Handle KPI click
   * @param {string} kpiId - KPI ID
   */
  handleKPIClick(kpiId) {
    const kpiData = window.dataManager.getKPIById(kpiId);
    if (kpiData) {
      // Show KPI details
      window.dispatchEvent(new CustomEvent('kpiClicked', {
        detail: { kpiData, kpiId }
      }));
    }
  }

  /**
   * Handle binder click
   */
  handleBinderClick() {
    // Open binder animation
    window.dispatchEvent(new CustomEvent('binderClicked', {
      detail: { action: 'open' }
    }));
  }

  /**
   * Handle paper hover
   * @param {Element} element - Paper element
   * @param {boolean} isHovering - Is hovering
   */
  handlePaperHover(element, isHovering) {
    if (isHovering) {
      element.classList.add('hovered');
      // Notify 3D scene
      window.dispatchEvent(new CustomEvent('paperHovered', {
        detail: { 
          problemId: element.dataset.problemId,
          isHovering: true
        }
      }));
    } else {
      element.classList.remove('hovered');
      window.dispatchEvent(new CustomEvent('paperHovered', {
        detail: { 
          problemId: element.dataset.problemId,
          isHovering: false
        }
      }));
    }
  }

  /**
   * Handle solution hover
   * @param {Element} element - Solution element
   * @param {boolean} isHovering - Is hovering
   */
  handleSolutionHover(element, isHovering) {
    if (isHovering) {
      element.classList.add('hovered');
      this.animateElement(element, 'pulse');
    } else {
      element.classList.remove('hovered');
      this.stopAnimation(element);
    }
  }

  /**
   * Handle KPI hover
   * @param {Element} element - KPI element
   * @param {boolean} isHovering - Is hovering
   */
  handleKPIHover(element, isHovering) {
    if (isHovering) {
      element.classList.add('hovered');
      // Show additional info
      this.showKPIPreview(element);
    } else {
      element.classList.remove('hovered');
      this.hideKPIPreview(element);
    }
  }

  /**
   * Show KPI preview
   * @param {Element} element - KPI element
   */
  showKPIPreview(element) {
    const preview = element.querySelector('.kpi-preview');
    if (preview) {
      preview.classList.add('visible');
    }
  }

  /**
   * Hide KPI preview
   * @param {Element} element - KPI element
   */
  hideKPIPreview(element) {
    const preview = element.querySelector('.kpi-preview');
    if (preview) {
      preview.classList.remove('visible');
    }
  }

  /**
   * Handle section change
   * @param {Event} e - Section change event
   */
  handleSectionChange(e) {
    const { sectionId } = e.detail;
    this.activeSection = sectionId;
    this.updateUIForSection(sectionId);
  }

  /**
   * Handle Three.js scene ready
   */
  handleThreeSceneReady() {
    // Enable 3D-related UI elements
    this.enableThreeSceneInteractions();
  }

  /**
   * Update UI for section
   * @param {string} sectionId - Section ID
   */
  updateUIForSection(sectionId) {
    // Update navigation state
    this.updateNavigationState(sectionId);
    
    // Update section-specific UI
    this.updateSectionUI(sectionId);
    
    // Update interactive elements
    this.updateInteractiveElements(sectionId);
  }

  /**
   * Update navigation state
   * @param {string} sectionId - Section ID
   */
  updateNavigationState(sectionId) {
    const skipItems = document.querySelectorAll('.skip-item');
    skipItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });
  }

  /**
   * Update section UI
   * @param {string} sectionId - Section ID
   */
  updateSectionUI(sectionId) {
    // Section-specific UI updates
    switch (sectionId) {
      case 'chaos':
        this.updateChaosUI();
        break;
      case 'valet':
        this.updateValetUI();
        break;
      case 'manager':
        this.updateManagerUI();
        break;
      case 'executive':
        this.updateExecutiveUI();
        break;
      case 'closing':
        this.updateClosingUI();
        break;
    }
  }

  /**
   * Update chaos section UI
   */
  updateChaosUI() {
    const papers = document.querySelectorAll('.chaos-paper');
    papers.forEach((paper, index) => {
      setTimeout(() => {
        paper.classList.add('visible');
      }, index * 100);
    });
  }

  /**
   * Update valet section UI
   */
  updateValetUI() {
    const solutions = document.querySelectorAll('.solution-card');
    solutions.forEach((solution, index) => {
      setTimeout(() => {
        solution.classList.add('visible');
      }, index * 150);
    });
  }

  /**
   * Update manager section UI
   */
  updateManagerUI() {
    const binder = document.getElementById('operations-binder');
    if (binder) {
      binder.classList.add('highlighted');
    }
  }

  /**
   * Update executive section UI
   */
  updateExecutiveUI() {
    const kpis = document.querySelectorAll('.kpi-card');
    kpis.forEach((kpi, index) => {
      setTimeout(() => {
        kpi.classList.add('visible');
      }, index * 200);
    });
  }

  /**
   * Update closing section UI
   */
  updateClosingUI() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
      button.classList.add('pulse-animation');
    });
  }

  /**
   * Update interactive elements
   * @param {string} sectionId - Section ID
   */
  updateInteractiveElements(sectionId) {
    const allInteractive = document.querySelectorAll('.interactive-element');
    allInteractive.forEach(element => {
      element.classList.remove('active');
    });

    const sectionInteractive = document.querySelectorAll(`#section-${sectionId} .interactive-element`);
    sectionInteractive.forEach(element => {
      element.classList.add('active');
    });
  }

  /**
   * Enable Three.js scene interactions
   */
  enableThreeSceneInteractions() {
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      canvas.classList.add('interactive');
      
      // Enable click detection
      canvas.addEventListener('click', this.handleCanvasClick.bind(this));
      canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
    }
  }

  /**
   * Handle canvas click
   * @param {Event} e - Click event
   */
  handleCanvasClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Dispatch event for 3D scene
    window.dispatchEvent(new CustomEvent('canvasClicked', {
      detail: { x, y, event: e }
    }));
  }

  /**
   * Handle canvas mouse move
   * @param {Event} e - Mouse move event
   */
  handleCanvasMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Dispatch event for 3D scene
    window.dispatchEvent(new CustomEvent('canvasMouseMove', {
      detail: { x, y, event: e }
    }));
  }

  /**
   * Navigate to section
   * @param {string} sectionId - Section ID
   */
  navigateToSection(sectionId) {
    if (window.acePresentation) {
      window.acePresentation.navigateToSection(sectionId);
    }
  }

  /**
   * Animate element
   * @param {Element} element - Element to animate
   * @param {string} animationType - Animation type
   */
  animateElement(element, animationType) {
    const animation = this.animations.get(animationType);
    if (animation) {
      element.style.animation = `${animationType} ${animation.duration}ms ${animation.easing}`;
      if (animation.iteration) {
        element.style.animationIterationCount = animation.iteration;
      }
    }
  }

  /**
   * Stop animation
   * @param {Element} element - Element to stop animating
   */
  stopAnimation(element) {
    element.style.animation = '';
    element.style.animationIterationCount = '';
  }

  /**
   * Get active section
   * @returns {string} Active section ID
   */
  getActiveSection() {
    return this.activeSection;
  }

  /**
   * Check if initialized
   * @returns {boolean} Is initialized
   */
  isReady() {
    return this.isInitialized;
  }
}

// Create global instance
window.UIController = UIController;