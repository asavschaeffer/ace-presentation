/**
 * Animation Controller - Handles all animations and transitions
 * Coordinates between UI animations and 3D scene animations
 */

class AnimationController {
  constructor() {
    this.isInitialized = false;
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    
    // Animation presets
    this.presets = {
      paperFly: {
        duration: 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        properties: ['transform', 'opacity']
      },
      fadeIn: {
        duration: 500,
        easing: 'ease-out',
        properties: ['opacity']
      },
      slideIn: {
        duration: 300,
        easing: 'ease-in-out',
        properties: ['transform', 'opacity']
      },
      pulse: {
        duration: 1000,
        easing: 'ease-in-out',
        properties: ['transform'],
        iterations: 'infinite'
      },
      bounce: {
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        properties: ['transform']
      }
    };
    
    // Bind methods (removed undefined method)
  }

  /**
   * Initialize Animation Controller
   */
  init() {
    this.setupAnimationStyles();
    this.setupEventListeners();
    
    this.isInitialized = true;
    console.log('Animation Controller initialized');
  }

  /**
   * Setup animation CSS styles
   */
  setupAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Animation classes */
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .animate-slide-in {
        animation: slideIn 0.3s ease-in-out forwards;
      }
      
      .animate-pulse {
        animation: pulse 1s ease-in-out infinite;
      }
      
      .animate-bounce {
        animation: bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      .animate-paper-fly {
        animation: paperFly 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      
      /* Paper flying animation */
      @keyframes paperFly {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: translateY(-100px) rotate(180deg);
          opacity: 0.7;
        }
        100% {
          transform: translateY(-200px) rotate(360deg);
          opacity: 0;
        }
      }
      
      /* Fade in animation */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      /* Slide in animation */
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      /* Pulse animation */
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      /* Bounce animation */
      @keyframes bounce {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0);
        }
      }
      
      /* 3D scene transitions */
      .scene-transition {
        transition: all 0.8s ease-in-out;
      }
      
      /* Interactive element states */
      .interactive-element {
        transition: all 0.2s ease;
      }
      
      .interactive-element:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      /* Section transitions */
      .presentation-section {
        transition: opacity 0.5s ease-in-out;
      }
      
      .presentation-section:not(.active) {
        opacity: 0;
        pointer-events: none;
      }
      
      .presentation-section.active {
        opacity: 1;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for animation requests
    window.addEventListener('animationRequested', this.handleAnimationRequest.bind(this));
    
    // Listen for section changes
    window.addEventListener('sectionChanged', this.handleSectionChange.bind(this));
    
    // Listen for paper implementations
    window.addEventListener('solutionImplemented', this.handleSolutionImplemented.bind(this));
    
    // Listen for 3D scene events
    window.addEventListener('threeSceneReady', this.handleThreeSceneReady.bind(this));
  }

  /**
   * Handle animation request
   * @param {Event} e - Animation request event
   */
  handleAnimationRequest(e) {
    const { element, animationType, options } = e.detail;
    this.animateElement(element, animationType, options);
  }

  /**
   * Handle section change
   * @param {Event} e - Section change event
   */
  handleSectionChange(e) {
    const { sectionId, previousSection } = e.detail;
    this.animateSectionTransition(previousSection, sectionId);
  }

  /**
   * Handle solution implemented
   * @param {Event} e - Solution implemented event
   */
  handleSolutionImplemented(e) {
    const { problemData, paperMesh } = e.detail;
    this.animatePaperToSolution(problemData, paperMesh);
  }

  /**
   * Handle Three.js scene ready
   */
  handleThreeSceneReady() {
    // Enable 3D animations
    this.enable3DAnimations();
  }

  /**
   * Animate element
   * @param {Element} element - Element to animate
   * @param {string} animationType - Animation type
   * @param {Object} options - Animation options
   */
  animateElement(element, animationType, options = {}) {
    if (!element) return;

    const animationId = `${element.id || 'element'}-${Date.now()}`;
    const preset = this.presets[animationType];
    
    if (!preset) {
      console.warn(`Animation type '${animationType}' not found`);
      return;
    }

    // Apply animation class
    element.classList.add(`animate-${animationType}`);
    
    // Store animation reference
    this.activeAnimations.set(animationId, {
      element,
      animationType,
      startTime: Date.now(),
      duration: options.duration || preset.duration,
      callback: options.callback
    });

    // Set up completion handler
    const handleComplete = () => {
      this.completeAnimation(animationId);
    };

    // Use animation event or timeout
    if (preset.iterations !== 'infinite') {
      element.addEventListener('animationend', handleComplete, { once: true });
      
      // Fallback timeout
      setTimeout(handleComplete, preset.duration + 100);
    }

    return animationId;
  }

  /**
   * Complete animation
   * @param {string} animationId - Animation ID
   */
  completeAnimation(animationId) {
    const animation = this.activeAnimations.get(animationId);
    if (!animation) return;

    const { element, animationType, callback } = animation;
    
    // Remove animation class
    element.classList.remove(`animate-${animationType}`);
    
    // Execute callback
    if (callback) {
      callback();
    }
    
    // Remove from active animations
    this.activeAnimations.delete(animationId);
    
    // Process next animation in queue
    this.processAnimationQueue();
  }

  /**
   * Stop animation
   * @param {string} animationId - Animation ID
   */
  stopAnimation(animationId) {
    const animation = this.activeAnimations.get(animationId);
    if (!animation) return;

    const { element, animationType } = animation;
    element.classList.remove(`animate-${animationType}`);
    this.activeAnimations.delete(animationId);
  }

  /**
   * Queue animation
   * @param {Element} element - Element to animate
   * @param {string} animationType - Animation type
   * @param {Object} options - Animation options
   */
  queueAnimation(element, animationType, options = {}) {
    this.animationQueue.push({
      element,
      animationType,
      options
    });
    
    if (!this.isAnimating) {
      this.processAnimationQueue();
    }
  }

  /**
   * Process animation queue
   */
  processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const nextAnimation = this.animationQueue.shift();
    
    this.animateElement(
      nextAnimation.element,
      nextAnimation.animationType,
      {
        ...nextAnimation.options,
        callback: () => {
          if (nextAnimation.options.callback) {
            nextAnimation.options.callback();
          }
          this.processAnimationQueue();
        }
      }
    );
  }

  /**
   * Animate section transition
   * @param {string} fromSection - Previous section
   * @param {string} toSection - New section
   */
  animateSectionTransition(fromSection, toSection) {
    const fromElement = document.getElementById(`section-${fromSection}`);
    const toElement = document.getElementById(`section-${toSection}`);
    
    if (!fromElement || !toElement) return;

    // Fade out previous section
    if (fromSection) {
      this.animateElement(fromElement, 'fadeOut', {
        callback: () => {
          fromElement.classList.remove('active');
        }
      });
    }

    // Fade in new section
    setTimeout(() => {
      toElement.classList.add('active');
      this.animateElement(toElement, 'fadeIn');
      
      // Animate section-specific elements
      this.animateSectionElements(toSection);
    }, 200);
  }

  /**
   * Animate section elements
   * @param {string} sectionId - Section ID
   */
  animateSectionElements(sectionId) {
    const section = document.getElementById(`section-${sectionId}`);
    if (!section) return;

    const elements = section.querySelectorAll('.animate-on-enter');
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, 'slideIn');
      }, index * 100);
    });
  }

  /**
   * Animate paper to solution
   * @param {Object} problemData - Problem data
   * @param {Object} paperMesh - Paper mesh (Three.js)
   */
  animatePaperToSolution(problemData, paperMesh) {
    // Find corresponding UI paper
    const paperElement = document.querySelector(`[data-problem-id="${problemData.id}"]`);
    if (!paperElement) return;

    // Animate UI paper flying away
    this.animateElement(paperElement, 'paperFly', {
      callback: () => {
        paperElement.remove();
      }
    });

    // Notify 3D scene to animate
    window.dispatchEvent(new CustomEvent('animatePaperToSolution', {
      detail: { problemData, paperMesh }
    }));
  }

  /**
   * Enable 3D animations
   */
  enable3DAnimations() {
    // Add 3D scene transition class
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
      sceneContainer.classList.add('scene-transition');
    }
  }

  /**
   * Animate paper hover
   * @param {string} problemId - Problem ID
   * @param {boolean} isHovering - Is hovering
   */
  animatePaperHover(problemId, isHovering) {
    const paperElement = document.querySelector(`[data-problem-id="${problemId}"]`);
    if (!paperElement) return;

    if (isHovering) {
      paperElement.classList.add('hovered');
      this.animateElement(paperElement, 'bounce');
    } else {
      paperElement.classList.remove('hovered');
    }

    // Notify 3D scene
    window.dispatchEvent(new CustomEvent('animatePaperHover3D', {
      detail: { problemId, isHovering }
    }));
  }

  /**
   * Animate KPI update
   * @param {string} kpiId - KPI ID
   * @param {number} oldValue - Old value
   * @param {number} newValue - New value
   */
  animateKPIUpdate(kpiId, oldValue, newValue) {
    const kpiElement = document.querySelector(`[data-kpi-id="${kpiId}"]`);
    if (!kpiElement) return;

    const valueElement = kpiElement.querySelector('.kpi-value');
    if (!valueElement) return;

    // Animate value change
    this.animateElement(valueElement, 'pulse', {
      callback: () => {
        valueElement.textContent = newValue;
      }
    });
  }

  /**
   * Animate ROI calculation
   * @param {Object} roiData - ROI data
   */
  animateROICalculation(roiData) {
    const roiElements = document.querySelectorAll('.roi-item');
    roiElements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element, 'slideIn');
      }, index * 150);
    });
  }

  /**
   * Animate binder opening
   */
  animateBinderOpening() {
    const binder = document.getElementById('operations-binder');
    if (!binder) return;

    const cover = binder.querySelector('.binder-cover');
    const content = binder.querySelector('.binder-content');

    if (cover && content) {
      // Animate cover opening
      this.animateElement(cover, 'slideOut', {
        callback: () => {
          cover.style.display = 'none';
          content.classList.add('open');
          this.animateElement(content, 'fadeIn');
        }
      });
    }
  }

  /**
   * Create custom animation
   * @param {string} name - Animation name
   * @param {Object} keyframes - CSS keyframes
   * @param {Object} options - Animation options
   */
  createCustomAnimation(name, keyframes, options = {}) {
    const style = document.createElement('style');
    
    let keyframesCSS = `@keyframes ${name} {`;
    for (const [percent, styles] of Object.entries(keyframes)) {
      keyframesCSS += `${percent} {`;
      for (const [property, value] of Object.entries(styles)) {
        keyframesCSS += `${property}: ${value};`;
      }
      keyframesCSS += '}';
    }
    keyframesCSS += '}';
    
    const animationCSS = `
      .animate-${name} {
        animation: ${name} ${options.duration || 1000}ms ${options.easing || 'ease'} ${options.iterations || 1};
      }
    `;
    
    style.textContent = keyframesCSS + animationCSS;
    document.head.appendChild(style);
    
    // Store preset
    this.presets[name] = {
      duration: options.duration || 1000,
      easing: options.easing || 'ease',
      properties: options.properties || ['transform'],
      iterations: options.iterations || 1
    };
  }

  /**
   * Get active animations
   * @returns {Array} Active animations
   */
  getActiveAnimations() {
    return Array.from(this.activeAnimations.values());
  }

  /**
   * Clear all animations
   */
  clearAllAnimations() {
    this.activeAnimations.forEach((animation, id) => {
      this.stopAnimation(id);
    });
    this.animationQueue = [];
    this.isAnimating = false;
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
window.AnimationController = AnimationController;