/**
 * Presentation Controller - Handles presentation flow and state
 * Manages the overall presentation experience and coordination
 */

class PresentationController {
  constructor() {
    this.isInitialized = false;
    this.currentSection = 'chaos';
    this.sectionOrder = ['chaos', 'valet', 'manager', 'executive', 'closing'];
    this.presentationState = {
      isPlaying: false,
      isPaused: false,
      startTime: null,
      currentTime: 0,
      totalDuration: 420000 // 7 minutes in milliseconds
    };
    
    // Presentation flow
    this.flowSteps = [];
    this.currentStep = 0;
    this.autoAdvance = false;
    
    // Bind methods
    this.handleUserInteraction = this.handleUserInteraction.bind(this);
  }

  /**
   * Initialize Presentation Controller
   */
  init() {
    this.setupPresentationFlow();
    this.setupEventListeners();
    this.setupPresentationState();
    
    this.isInitialized = true;
    console.log('Presentation Controller initialized');
  }

  /**
   * Setup presentation flow
   */
  setupPresentationFlow() {
    this.flowSteps = [
      // Chaos Section
      {
        section: 'chaos',
        title: 'The Current State - Chaos',
        duration: 60000, // 1 minute
        actions: [
          { type: 'showSection', target: 'chaos' },
          { type: 'highlight3DPapers', delay: 2000 },
          { type: 'showProblemCount', delay: 4000 },
          { type: 'emphasizeCosts', delay: 6000 }
        ],
        presenterNotes: 'Introduce the current chaotic state. Point out the scattered papers representing problems. Emphasize financial impact.'
      },
      
      // Valet Section
      {
        section: 'valet',
        title: 'The Valet - Firefighter Response',
        duration: 90000, // 1.5 minutes
        actions: [
          { type: 'showSection', target: 'valet' },
          { type: 'showFirefighter', delay: 2000 },
          { type: 'demonstrateProblemSolving', delay: 4000 },
          { type: 'showTrainingSolutions', delay: 6000 },
          { type: 'animatePaperToBinder', delay: 8000 }
        ],
        presenterNotes: 'Explain the valet as a firefighter. Show how problems are addressed reactively. Introduce systematic solutions.'
      },
      
      // Manager Section
      {
        section: 'manager',
        title: 'The Manager - Watchtower Oversight',
        duration: 90000, // 1.5 minutes
        actions: [
          { type: 'showSection', target: 'manager' },
          { type: 'showWatchtower', delay: 2000 },
          { type: 'openBinder', delay: 4000 },
          { type: 'showProcesses', delay: 6000 },
          { type: 'demonstrateOversight', delay: 8000 }
        ],
        presenterNotes: 'Introduce the manager as watchtower. Show systematic oversight. Demonstrate process organization.'
      },
      
      // Executive Section
      {
        section: 'executive',
        title: 'The Executive - Strategic Overview',
        duration: 120000, // 2 minutes
        actions: [
          { type: 'showSection', target: 'executive' },
          { type: 'showPlane', delay: 2000 },
          { type: 'displayKPIs', delay: 4000 },
          { type: 'showROICalculator', delay: 6000 },
          { type: 'demonstrateROI', delay: 8000 },
          { type: 'showPredictiveAnalytics', delay: 10000 }
        ],
        presenterNotes: 'Present executive view as fire-spotter plane. Show KPIs and ROI. Demonstrate predictive capabilities.'
      },
      
      // Closing Section
      {
        section: 'closing',
        title: 'The Path Forward - Call to Action',
        duration: 60000, // 1 minute
        actions: [
          { type: 'showSection', target: 'closing' },
          { type: 'showTransformation', delay: 2000 },
          { type: 'highlightPilotProgram', delay: 4000 },
          { type: 'showNextSteps', delay: 6000 },
          { type: 'emphasizeCTA', delay: 8000 }
        ],
        presenterNotes: 'Summarize transformation. Highlight pilot program. Strong call to action.'
      }
    ];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation events
    window.addEventListener('sectionChanged', this.handleSectionChange.bind(this));
    window.addEventListener('userInteraction', this.handleUserInteraction);
    
    // Flow control events
    window.addEventListener('nextStep', this.nextStep.bind(this));
    window.addEventListener('previousStep', this.previousStep.bind(this));
    window.addEventListener('gotoStep', this.gotoStep.bind(this));
    
    // Presentation control events
    window.addEventListener('playPresentation', this.play.bind(this));
    window.addEventListener('pausePresentation', this.pause.bind(this));
    window.addEventListener('stopPresentation', this.stop.bind(this));
    window.addEventListener('resetPresentation', this.reset.bind(this));
    
    // Auto-advance events
    window.addEventListener('enableAutoAdvance', this.enableAutoAdvance.bind(this));
    window.addEventListener('disableAutoAdvance', this.disableAutoAdvance.bind(this));
  }

  /**
   * Setup presentation state
   */
  setupPresentationState() {
    this.presentationState = {
      isPlaying: false,
      isPaused: false,
      startTime: null,
      currentTime: 0,
      totalDuration: this.flowSteps.reduce((total, step) => total + step.duration, 0)
    };
  }

  /**
   * Handle section change
   * @param {Event} e - Section change event
   */
  handleSectionChange(e) {
    const { sectionId } = e.detail;
    this.currentSection = sectionId;
    
    // Find corresponding flow step
    const stepIndex = this.flowSteps.findIndex(step => step.section === sectionId);
    if (stepIndex !== -1) {
      this.currentStep = stepIndex;
      this.executeFlowStep(this.flowSteps[stepIndex]);
    }
    
    // Update presentation state
    this.updatePresentationState();
  }

  /**
   * Execute flow step
   * @param {Object} step - Flow step
   */
  executeFlowStep(step) {
    console.log(`Executing flow step: ${step.title}`);
    
    // Execute actions
    step.actions.forEach(action => {
      if (action.delay) {
        setTimeout(() => {
          this.executeAction(action);
        }, action.delay);
      } else {
        this.executeAction(action);
      }
    });
    
    // Update presenter notes
    this.updatePresenterNotes(step);
    
    // Auto-advance if enabled
    if (this.autoAdvance) {
      setTimeout(() => {
        this.nextStep();
      }, step.duration);
    }
  }

  /**
   * Execute action
   * @param {Object} action - Action to execute
   */
  executeAction(action) {
    switch (action.type) {
      case 'showSection':
        this.showSection(action.target);
        break;
      case 'highlight3DPapers':
        this.highlight3DPapers();
        break;
      case 'showProblemCount':
        this.showProblemCount();
        break;
      case 'emphasizeCosts':
        this.emphasizeCosts();
        break;
      case 'showFirefighter':
        this.showFirefighter();
        break;
      case 'demonstrateProblemSolving':
        this.demonstrateProblemSolving();
        break;
      case 'showTrainingSolutions':
        this.showTrainingSolutions();
        break;
      case 'animatePaperToBinder':
        this.animatePaperToBinder();
        break;
      case 'showWatchtower':
        this.showWatchtower();
        break;
      case 'openBinder':
        this.openBinder();
        break;
      case 'showProcesses':
        this.showProcesses();
        break;
      case 'demonstrateOversight':
        this.demonstrateOversight();
        break;
      case 'showPlane':
        this.showPlane();
        break;
      case 'displayKPIs':
        this.displayKPIs();
        break;
      case 'showROICalculator':
        this.showROICalculator();
        break;
      case 'demonstrateROI':
        this.demonstrateROI();
        break;
      case 'showPredictiveAnalytics':
        this.showPredictiveAnalytics();
        break;
      case 'showTransformation':
        this.showTransformation();
        break;
      case 'highlightPilotProgram':
        this.highlightPilotProgram();
        break;
      case 'showNextSteps':
        this.showNextSteps();
        break;
      case 'emphasizeCTA':
        this.emphasizeCTA();
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Show section
   * @param {string} sectionId - Section ID
   */
  showSection(sectionId) {
    if (window.acePresentation) {
      window.acePresentation.navigateToSection(sectionId);
    }
  }

  /**
   * Highlight 3D papers
   */
  highlight3DPapers() {
    window.dispatchEvent(new CustomEvent('highlight3DPapers', {
      detail: { highlight: true }
    }));
  }

  /**
   * Show problem count
   */
  showProblemCount() {
    const problemCount = window.dataManager.getProblems().length;
    const countElement = document.getElementById('problem-count');
    if (countElement) {
      countElement.textContent = problemCount;
      countElement.classList.add('highlighted');
    }
  }

  /**
   * Emphasize costs
   */
  emphasizeCosts() {
    const totalCost = window.dataManager.getTotalFinancialImpact();
    const costElement = document.getElementById('total-cost');
    if (costElement) {
      costElement.textContent = `$${totalCost.toLocaleString()}`;
      costElement.classList.add('emphasized');
    }
  }

  /**
   * Show firefighter
   */
  showFirefighter() {
    window.dispatchEvent(new CustomEvent('showFirefighter', {
      detail: { show: true }
    }));
  }

  /**
   * Demonstrate problem solving
   */
  demonstrateProblemSolving() {
    window.dispatchEvent(new CustomEvent('demonstrateProblemSolving', {
      detail: { demonstrate: true }
    }));
  }

  /**
   * Show training solutions
   */
  showTrainingSolutions() {
    const solutions = document.querySelectorAll('.solution-card');
    solutions.forEach((solution, index) => {
      setTimeout(() => {
        solution.classList.add('highlighted');
      }, index * 200);
    });
  }

  /**
   * Animate paper to binder
   */
  animatePaperToBinder() {
    window.dispatchEvent(new CustomEvent('animatePaperToBinder', {
      detail: { animate: true }
    }));
  }

  /**
   * Show watchtower
   */
  showWatchtower() {
    window.dispatchEvent(new CustomEvent('showWatchtower', {
      detail: { show: true }
    }));
  }

  /**
   * Open binder
   */
  openBinder() {
    const binder = document.getElementById('operations-binder');
    if (binder) {
      binder.click();
    }
  }

  /**
   * Show processes
   */
  showProcesses() {
    const processes = document.querySelectorAll('.process-item');
    processes.forEach((process, index) => {
      setTimeout(() => {
        process.classList.add('highlighted');
      }, index * 300);
    });
  }

  /**
   * Demonstrate oversight
   */
  demonstrateOversight() {
    window.dispatchEvent(new CustomEvent('demonstrateOversight', {
      detail: { demonstrate: true }
    }));
  }

  /**
   * Show plane
   */
  showPlane() {
    window.dispatchEvent(new CustomEvent('showPlane', {
      detail: { show: true }
    }));
  }

  /**
   * Display KPIs
   */
  displayKPIs() {
    const kpis = document.querySelectorAll('.kpi-card');
    kpis.forEach((kpi, index) => {
      setTimeout(() => {
        kpi.classList.add('animated');
      }, index * 250);
    });
  }

  /**
   * Show ROI calculator
   */
  showROICalculator() {
    const calculator = document.getElementById('roi-calculator');
    if (calculator) {
      calculator.classList.add('highlighted');
    }
  }

  /**
   * Demonstrate ROI
   */
  demonstrateROI() {
    const slider = document.getElementById('training-investment');
    if (slider) {
      // Animate slider to show different values
      const values = [25000, 50000, 75000, 100000];
      let currentIndex = 0;
      
      const animateSlider = () => {
        slider.value = values[currentIndex];
        slider.dispatchEvent(new Event('input'));
        
        currentIndex = (currentIndex + 1) % values.length;
        
        if (currentIndex < values.length) {
          setTimeout(animateSlider, 1000);
        }
      };
      
      animateSlider();
    }
  }

  /**
   * Show predictive analytics
   */
  showPredictiveAnalytics() {
    const analytics = document.getElementById('predictive-analytics');
    if (analytics) {
      analytics.classList.add('visible');
    }
  }

  /**
   * Show transformation
   */
  showTransformation() {
    window.dispatchEvent(new CustomEvent('showTransformation', {
      detail: { show: true }
    }));
  }

  /**
   * Highlight pilot program
   */
  highlightPilotProgram() {
    const pilotSection = document.getElementById('pilot-program');
    if (pilotSection) {
      pilotSection.classList.add('highlighted');
    }
  }

  /**
   * Show next steps
   */
  showNextSteps() {
    const steps = document.querySelectorAll('.next-step');
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('visible');
      }, index * 500);
    });
  }

  /**
   * Emphasize CTA
   */
  emphasizeCTA() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
      button.classList.add('pulse-animation');
    });
  }

  /**
   * Update presenter notes
   * @param {Object} step - Current step
   */
  updatePresenterNotes(step) {
    const notesElement = document.getElementById('presenter-notes');
    if (notesElement) {
      notesElement.textContent = step.presenterNotes;
    }
  }

  /**
   * Update presentation state
   */
  updatePresentationState() {
    const currentTime = this.presentationState.startTime ? 
      Date.now() - this.presentationState.startTime : 0;
    
    this.presentationState.currentTime = currentTime;
    
    // Update progress
    const progress = (currentTime / this.presentationState.totalDuration) * 100;
    this.updateProgressBar(progress);
    
    // Update time display
    this.updateTimeDisplay(currentTime);
  }

  /**
   * Update progress bar
   * @param {number} progress - Progress percentage
   */
  updateProgressBar(progress) {
    const progressBar = document.getElementById('presentation-progress');
    if (progressBar) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  /**
   * Update time display
   * @param {number} currentTime - Current time in milliseconds
   */
  updateTimeDisplay(currentTime) {
    const timeDisplay = document.getElementById('presentation-time');
    if (timeDisplay) {
      const minutes = Math.floor(currentTime / 60000);
      const seconds = Math.floor((currentTime % 60000) / 1000);
      timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Next step
   */
  nextStep() {
    if (this.currentStep < this.flowSteps.length - 1) {
      this.currentStep++;
      const step = this.flowSteps[this.currentStep];
      this.showSection(step.section);
    }
  }

  /**
   * Previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      const step = this.flowSteps[this.currentStep];
      this.showSection(step.section);
    }
  }

  /**
   * Go to step
   * @param {number} stepIndex - Step index
   */
  gotoStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.flowSteps.length) {
      this.currentStep = stepIndex;
      const step = this.flowSteps[stepIndex];
      this.showSection(step.section);
    }
  }

  /**
   * Play presentation
   */
  play() {
    if (!this.presentationState.isPlaying) {
      this.presentationState.isPlaying = true;
      this.presentationState.isPaused = false;
      this.presentationState.startTime = Date.now() - this.presentationState.currentTime;
      
      this.enableAutoAdvance();
      
      // Start current step
      this.executeFlowStep(this.flowSteps[this.currentStep]);
    }
  }

  /**
   * Pause presentation
   */
  pause() {
    if (this.presentationState.isPlaying) {
      this.presentationState.isPaused = true;
      this.disableAutoAdvance();
    }
  }

  /**
   * Stop presentation
   */
  stop() {
    this.presentationState.isPlaying = false;
    this.presentationState.isPaused = false;
    this.presentationState.currentTime = 0;
    this.disableAutoAdvance();
  }

  /**
   * Reset presentation
   */
  reset() {
    this.stop();
    this.currentStep = 0;
    this.showSection(this.flowSteps[0].section);
  }

  /**
   * Enable auto-advance
   */
  enableAutoAdvance() {
    this.autoAdvance = true;
  }

  /**
   * Disable auto-advance
   */
  disableAutoAdvance() {
    this.autoAdvance = false;
  }

  /**
   * Handle user interaction
   */
  handleUserInteraction() {
    // Pause auto-advance when user interacts
    if (this.autoAdvance) {
      this.pause();
    }
  }

  /**
   * Get current step
   * @returns {Object} Current step
   */
  getCurrentStep() {
    return this.flowSteps[this.currentStep];
  }

  /**
   * Get presentation state
   * @returns {Object} Presentation state
   */
  getPresentationState() {
    return { ...this.presentationState };
  }

  /**
   * Get flow steps
   * @returns {Array} Flow steps
   */
  getFlowSteps() {
    return [...this.flowSteps];
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
window.PresentationController = PresentationController;