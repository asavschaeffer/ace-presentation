/**
 * Main Application Controller
 * Initializes and coordinates all presentation components
 */

class ACEPresentation {
  constructor() {
    this.isInitialized = false;
    this.currentSection = 'chaos';
    this.presentationTimer = null;
    this.startTime = null;
    this.demoMode = false;
    this.presenterMode = false;
    
    // Component instances
    this.dataManager = window.dataManager;
    this.threeScene = window.threeScene;
    this.uiController = null;
    this.modalSystem = null;
    this.animationController = null;
    this.demoController = null;
    this.pdfExporter = null;
    this.presentationController = null;
    
    // DOM elements
    this.loadingScreen = null;
    this.app = null;
    this.presentationTimer = null;
    this.presenterOverlay = null;
    this.skipMenu = null;
    this.sections = {};
    
    // Bind methods
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePaperClick = this.handlePaperClick.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing ACE Presentation...');
      
      // Show loading screen
      this.loadingScreen = document.getElementById('loading-screen');
      this.app = document.getElementById('app');
      
      // Load data first
      await this.loadData();
      
      // Initialize components
      await this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Setup DOM references
      this.setupDOMReferences();
      
      // Hide loading screen and show app
      this.hideLoadingScreen();
      
      // Start presentation
      this.startPresentation();
      
      this.isInitialized = true;
      console.log('ACE Presentation initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize ACE Presentation:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Load presentation data
   */
  async loadData() {
    try {
      await this.dataManager.loadData();
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
      // Continue with fallback data
    }
  }

  /**
   * Initialize all components
   */
  async initializeComponents() {
    // Initialize Three.js scene
    if (this.threeScene) {
      this.threeScene.init();
    }
    
    // Initialize other components when they're available
    if (window.UIController) {
      this.uiController = new window.UIController();
      this.uiController.init();
    }
    
    if (window.ModalSystem) {
      this.modalSystem = new window.ModalSystem();
      this.modalSystem.init();
    }
    
    if (window.AnimationController) {
      this.animationController = new window.AnimationController();
      this.animationController.init();
    }
    
    if (window.DemoController) {
      this.demoController = new window.DemoController();
      this.demoController.init();
    }
    
    if (window.PDFExporter) {
      this.pdfExporter = new window.PDFExporter();
    }
    
    if (window.PresentationController) {
      this.presentationController = new window.PresentationController();
      this.presentationController.init();
    }
    
    console.log('Components initialized');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard);
    
    // Visibility change (for pausing animations)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Custom events
    window.addEventListener('paperClicked', this.handlePaperClick);
    window.addEventListener('sectionChanged', this.handleSectionChange);
    window.addEventListener('modalClosed', this.handleModalClosed.bind(this));
    window.addEventListener('solutionImplemented', this.handleSolutionImplemented.bind(this));
    
    // Navigation buttons
    this.setupNavigationListeners();
    
    // Window events
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    console.log('Event listeners setup');
  }

  /**
   * Setup navigation button listeners
   */
  setupNavigationListeners() {
    const skipMenuBtn = document.getElementById('skip-menu-btn');
    const demoModeBtn = document.getElementById('demo-mode-btn');
    const presenterModeBtn = document.getElementById('presenter-mode-btn');
    
    if (skipMenuBtn) {
      skipMenuBtn.addEventListener('click', this.toggleSkipMenu.bind(this));
    }
    
    if (demoModeBtn) {
      demoModeBtn.addEventListener('click', this.toggleDemoMode.bind(this));
    }
    
    if (presenterModeBtn) {
      presenterModeBtn.addEventListener('click', this.togglePresenterMode.bind(this));
    }
    
    // Skip menu items
    const skipItems = document.querySelectorAll('.skip-item');
    skipItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        if (section) {
          this.navigateToSection(section);
          this.hideSkipMenu();
        }
      });
    });
    
    // CTA buttons
    const launchPilotBtn = document.getElementById('launch-pilot-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    if (launchPilotBtn) {
      launchPilotBtn.addEventListener('click', this.handleLaunchPilot.bind(this));
    }
    
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', this.handleExportPdf.bind(this));
    }
    
    // ACE Way overlay
    const aceWayClose = document.getElementById('ace-way-close');
    if (aceWayClose) {
      aceWayClose.addEventListener('click', this.hideAceWayOverlay.bind(this));
    }
    
    // Feedback form
    const feedbackForm = document.getElementById('feedback-form-element');
    const feedbackCancel = document.getElementById('feedback-cancel');
    
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', this.handleFeedbackSubmit.bind(this));
    }
    
    if (feedbackCancel) {
      feedbackCancel.addEventListener('click', this.hideFeedbackForm.bind(this));
    }
  }

  /**
   * Setup DOM references
   */
  setupDOMReferences() {
    this.presenterOverlay = document.getElementById('presenter-overlay');
    this.skipMenu = document.getElementById('skip-menu');
    this.presentationTimer = document.getElementById('presentation-timer');
    
    // Section elements
    this.sections = {
      chaos: document.getElementById('section-chaos'),
      valet: document.getElementById('section-valet'),
      manager: document.getElementById('section-manager'),
      executive: document.getElementById('section-executive'),
      closing: document.getElementById('section-closing')
    };
    
    console.log('DOM references setup');
  }

  /**
   * Hide loading screen and show app
   */
  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
        if (this.app) {
          this.app.style.display = 'block';
          // Fade in app
          setTimeout(() => {
            this.app.style.opacity = '1';
          }, 100);
        }
      }, 300);
    }
  }

  /**
   * Start the presentation
   */
  startPresentation() {
    this.startTime = Date.now();
    this.updatePresentationTimer();
    
    // Show initial section
    this.showSection('chaos');
    
    // Initialize section-specific content
    this.initializeSectionContent();
    
    // Start timer update
    this.startTimerUpdate();
    
    console.log('Presentation started');
  }

  /**
   * Initialize content for each section
   */
  initializeSectionContent() {
    // Initialize chaos section with problems
    this.initializeChaosSection();
    
    // Initialize valet section with solutions
    this.initializeValetSection();
    
    // Initialize manager section with binder
    this.initializeManagerSection();
    
    // Initialize executive section with dashboard
    this.initializeExecutiveSection();
    
    // Initialize closing section with CTA
    this.initializeClosingSection();
  }

  /**
   * Initialize chaos section
   */
  initializeChaosSection() {
    const container = document.querySelector('.chaos-papers-container');
    if (!container) return;
    
    const problems = this.dataManager.getProblemsBySection('valet');
    container.innerHTML = '';
    
    problems.forEach(problem => {
      const paperElement = this.createPaperElement(problem);
      container.appendChild(paperElement);
    });
  }

  /**
   * Initialize valet section
   */
  initializeValetSection() {
    const container = document.querySelector('.valet-solutions-container');
    if (!container) return;
    
    const solutions = this.dataManager.getSolutionsByCategory('training')
      .concat(this.dataManager.getSolutionsByCategory('processes'));
    
    container.innerHTML = '';
    
    solutions.forEach(solution => {
      const solutionElement = this.createSolutionElement(solution);
      container.appendChild(solutionElement);
    });
  }

  /**
   * Initialize manager section
   */
  initializeManagerSection() {
    const binderPages = document.querySelector('.binder-pages');
    if (!binderPages) return;
    
    const binder = document.getElementById('operations-binder');
    if (binder) {
      binder.addEventListener('click', this.handleBinderClick.bind(this));
    }
    
    // Setup binder tabs
    const tabs = document.querySelectorAll('.binder-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabId = e.target.dataset.tab;
        this.showBinderTab(tabId);
      });
    });
    
    // Show default tab
    this.showBinderTab('training');
  }

  /**
   * Initialize executive section
   */
  initializeExecutiveSection() {
    const kpisContainer = document.querySelector('.dashboard-kpis');
    if (!kpisContainer) return;
    
    const kpis = this.dataManager.getExecutiveKPIs();
    kpisContainer.innerHTML = '';
    
    kpis.forEach(kpi => {
      const kpiElement = this.createKPIElement(kpi);
      kpisContainer.appendChild(kpiElement);
    });
    
    // Setup ROI simulator
    this.setupROISimulator();
  }

  /**
   * Initialize closing section
   */
  initializeClosingSection() {
    // Content is mostly static, just ensure CTA buttons are working
    const launchBtn = document.getElementById('launch-pilot-btn');
    const exportBtn = document.getElementById('export-pdf-btn');
    
    if (launchBtn) {
      launchBtn.classList.add('pulse-animation');
    }
  }

  /**
   * Create paper element for problems
   * @param {Object} problem - Problem data
   * @returns {HTMLElement} Paper element
   */
  createPaperElement(problem) {
    const paper = document.createElement('div');
    paper.className = 'chaos-paper';
    paper.style.backgroundColor = problem.paper_color === 'yellow' ? '#f39c12' : '#e74c3c';
    paper.dataset.problemId = problem.id;
    
    paper.innerHTML = `
      <h3>${problem.title}</h3>
      <p>${problem.description.substring(0, 100)}...</p>
    `;
    
    paper.addEventListener('click', () => {
      this.showProblemModal(problem);
    });
    
    return paper;
  }

  /**
   * Create solution element
   * @param {Object} solution - Solution data
   * @returns {HTMLElement} Solution element
   */
  createSolutionElement(solution) {
    const solutionEl = document.createElement('div');
    solutionEl.className = 'solution-card';
    
    solutionEl.innerHTML = `
      <h3>${solution.title}</h3>
      <p>${solution.description}</p>
      <div class="solution-benefit">
        <strong>Benefit:</strong> ${solution.benefit}
      </div>
    `;
    
    return solutionEl;
  }

  /**
   * Create KPI element
   * @param {Object} kpi - KPI data
   * @returns {HTMLElement} KPI element
   */
  createKPIElement(kpi) {
    const kpiEl = document.createElement('div');
    kpiEl.className = 'kpi-card';
    kpiEl.dataset.kpiId = kpi.id;
    
    const trendClass = kpi.trend === 'positive' ? 'positive' : 'negative';
    const trendSymbol = kpi.trend === 'positive' ? '↑' : '↓';
    
    kpiEl.innerHTML = `
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-label">${kpi.title}</div>
      <div class="kpi-trend ${trendClass}">${trendSymbol} ${kpi.trend_value}</div>
    `;
    
    kpiEl.addEventListener('click', () => {
      this.showKPIDetails(kpi);
    });
    
    return kpiEl;
  }

  /**
   * Setup ROI simulator
   */
  setupROISimulator() {
    const slider = document.getElementById('training-investment');
    const valueDisplay = document.getElementById('training-value');
    
    if (!slider || !valueDisplay) return;
    
    slider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      valueDisplay.textContent = value.toLocaleString();
      
      // Update ROI calculations
      this.updateROICalculations(value);
    });
    
    // Initialize with default value
    this.updateROICalculations(slider.value);
  }

  /**
   * Update ROI calculations
   * @param {number} investment - Investment amount
   */
  updateROICalculations(investment) {
    const roiData = this.dataManager.calculateROI(investment);
    const chartContainer = document.querySelector('.roi-chart');
    
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="roi-summary">
          <div class="roi-item">
            <strong>Total Savings:</strong> $${roiData.totalSavings.toLocaleString()}
          </div>
          <div class="roi-item">
            <strong>ROI:</strong> ${roiData.roiPercentage}%
          </div>
          <div class="roi-item">
            <strong>Employees Trained:</strong> ${roiData.employeesTrained}
          </div>
        </div>
      `;
    }
  }

  /**
   * Handle keyboard navigation
   * @param {Event} e - Keyboard event
   */
  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return; // Don't handle if user is typing
    }
    
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        this.nextSection();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSection();
        break;
      case 'Escape':
        e.preventDefault();
        this.closeAllModals();
        break;
      case 'p':
      case 'P':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.togglePresenterMode();
        }
        break;
      case 'd':
      case 'D':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.toggleDemoMode();
        }
        break;
    }
  }

  /**
   * Handle visibility change (tab switching)
   * @param {Event} e - Visibility change event
   */
  handleVisibilityChange(e) {
    if (document.hidden) {
      // Pause animations when tab is hidden
      if (this.demoController) {
        this.demoController.pause();
      }
    } else {
      // Resume animations when tab is visible
      if (this.demoController) {
        this.demoController.resume();
      }
    }
  }

  /**
   * Handle paper click from Three.js scene
   * @param {Event} e - Paper click event
   */
  handlePaperClick(e) {
    const { problemData } = e.detail;
    if (problemData) {
      this.showProblemModal(problemData);
    }
  }

  /**
   * Handle section change
   * @param {Event} e - Section change event
   */
  handleSectionChange(e) {
    const { sectionId } = e.detail;
    this.navigateToSection(sectionId);
  }

  /**
   * Handle modal closed
   */
  handleModalClosed() {
    // Re-enable interactions
    document.body.classList.remove('no-scroll');
  }

  /**
   * Handle solution implemented
   * @param {Event} e - Solution implemented event
   */
  handleSolutionImplemented(e) {
    const { problemData, paperMesh } = e.detail;
    
    // Animate paper to binder in 3D scene
    if (this.threeScene && paperMesh) {
      this.threeScene.animatePaperToBinder(paperMesh, () => {
        // Remove paper from UI
        const paperElement = document.querySelector(`[data-problem-id="${problemData.id}"]`);
        if (paperElement) {
          paperElement.style.opacity = '0';
          setTimeout(() => {
            paperElement.remove();
          }, 300);
        }
      });
    }
  }

  /**
   * Show problem modal
   * @param {Object} problemData - Problem data
   */
  showProblemModal(problemData) {
    if (this.modalSystem) {
      this.modalSystem.showProblemModal(problemData);
    }
  }

  /**
   * Show KPI details
   * @param {Object} kpi - KPI data
   */
  showKPIDetails(kpi) {
    if (this.modalSystem) {
      this.modalSystem.showKPIModal(kpi);
    }
  }

  /**
   * Navigate to section
   * @param {string} sectionId - Section ID
   */
  navigateToSection(sectionId) {
    if (this.currentSection === sectionId) return;
    
    this.currentSection = sectionId;
    this.showSection(sectionId);
    
    // Update 3D scene
    if (this.threeScene) {
      this.threeScene.transitionToSection(sectionId);
    }
    
    // Update presenter notes
    this.updatePresenterNotes(sectionId);
    
    // Dispatch event
    const event = new CustomEvent('sectionChanged', {
      detail: { sectionId, previousSection: this.currentSection }
    });
    window.dispatchEvent(event);
  }

  /**
   * Show section
   * @param {string} sectionId - Section ID
   */
  showSection(sectionId) {
    // Hide all sections
    Object.values(this.sections).forEach(section => {
      if (section) {
        section.classList.remove('active');
      }
    });
    
    // Show target section
    if (this.sections[sectionId]) {
      this.sections[sectionId].classList.add('active');
      
      // Animate in solution cards for valet section
      if (sectionId === 'valet') {
        this.animateInSolutionCards();
      }
    }
  }

  /**
   * Animate in solution cards
   */
  animateInSolutionCards() {
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 200);
    });
  }

  /**
   * Next section
   */
  nextSection() {
    const sections = ['chaos', 'valet', 'manager', 'executive', 'closing'];
    const currentIndex = sections.indexOf(this.currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    this.navigateToSection(sections[nextIndex]);
  }

  /**
   * Previous section
   */
  previousSection() {
    const sections = ['chaos', 'valet', 'manager', 'executive', 'closing'];
    const currentIndex = sections.indexOf(this.currentSection);
    const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
    this.navigateToSection(sections[prevIndex]);
  }

  /**
   * Toggle skip menu
   */
  toggleSkipMenu() {
    if (this.skipMenu) {
      this.skipMenu.classList.toggle('active');
    }
  }

  /**
   * Hide skip menu
   */
  hideSkipMenu() {
    if (this.skipMenu) {
      this.skipMenu.classList.remove('active');
    }
  }

  /**
   * Toggle demo mode
   */
  toggleDemoMode() {
    this.demoMode = !this.demoMode;
    
    if (this.demoMode) {
      if (this.demoController) {
        this.demoController.start();
      }
    } else {
      if (this.demoController) {
        this.demoController.stop();
      }
    }
    
    // Update button text
    const btn = document.getElementById('demo-mode-btn');
    if (btn) {
      btn.textContent = this.demoMode ? 'Stop Demo' : 'Auto Demo';
    }
  }

  /**
   * Toggle presenter mode
   */
  togglePresenterMode() {
    this.presenterMode = !this.presenterMode;
    
    if (this.presenterOverlay) {
      this.presenterOverlay.classList.toggle('active', this.presenterMode);
      this.presenterOverlay.setAttribute('aria-hidden', !this.presenterMode);
    }
    
    // Update button text
    const btn = document.getElementById('presenter-mode-btn');
    if (btn) {
      btn.textContent = this.presenterMode ? 'Exit Presenter' : 'Presenter Mode';
    }
  }

  /**
   * Update presenter notes
   * @param {string} sectionId - Section ID
   */
  updatePresenterNotes(sectionId) {
    const sectionNameEl = document.getElementById('current-section-name');
    const presenterCueEl = document.getElementById('presenter-cue');
    
    const section = this.dataManager.getSection(sectionId);
    if (section && sectionNameEl && presenterCueEl) {
      sectionNameEl.textContent = section.title;
      presenterCueEl.textContent = section.presenterCue || 'Continue with the presentation';
    }
  }

  /**
   * Handle binder click
   */
  handleBinderClick() {
    const binder = document.getElementById('operations-binder');
    const binderContent = binder.querySelector('.binder-content');
    
    if (binderContent) {
      binderContent.classList.add('open');
      binder.querySelector('.binder-cover').style.display = 'none';
    }
  }

  /**
   * Show binder tab
   * @param {string} tabId - Tab ID
   */
  showBinderTab(tabId) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.binder-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Update content
    const pages = document.querySelector('.binder-pages');
    if (pages) {
      const initiative = this.dataManager.getManagerInitiative(tabId + '-tab');
      if (initiative) {
        pages.innerHTML = `
          <h4>${initiative.title}</h4>
          <p>${initiative.description}</p>
          <ul>
            ${initiative.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      }
    }
  }

  /**
   * Handle launch pilot button
   */
  handleLaunchPilot() {
    const pilotInfo = this.dataManager.getPilotInfo();
    
    if (this.modalSystem) {
      this.modalSystem.showPilotModal(pilotInfo);
    }
  }

  /**
   * Handle export PDF button
   */
  handleExportPdf() {
    if (this.pdfExporter) {
      this.pdfExporter.exportROISummary();
    }
  }

  /**
   * Hide ACE Way overlay
   */
  hideAceWayOverlay() {
    const overlay = document.getElementById('ace-way-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Handle feedback form submission
   * @param {Event} e - Form event
   */
  handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const feedback = {
      name: formData.get('name'),
      role: formData.get('role'),
      comments: formData.get('comments'),
      timestamp: new Date().toISOString()
    };
    
    // Store feedback locally
    this.storeFeedback(feedback);
    
    // Show success message
    this.showFeedbackSuccess();
    
    // Hide form
    this.hideFeedbackForm();
  }

  /**
   * Hide feedback form
   */
  hideFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (form) {
      form.classList.remove('active');
      form.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Store feedback locally
   * @param {Object} feedback - Feedback data
   */
  storeFeedback(feedback) {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('ace-presentation-feedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('ace-presentation-feedback', JSON.stringify(existingFeedback));
    } catch (error) {
      console.warn('Failed to store feedback:', error);
    }
  }

  /**
   * Show feedback success message
   */
  showFeedbackSuccess() {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-content">
        <strong>Thank you!</strong> Your feedback has been recorded.
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Close all modals
   */
  closeAllModals() {
    if (this.modalSystem) {
      this.modalSystem.closeAll();
    }
    
    this.hideSkipMenu();
    this.hideAceWayOverlay();
    this.hideFeedbackForm();
  }

  /**
   * Start timer update
   */
  startTimerUpdate() {
    setInterval(() => {
      this.updatePresentationTimer();
    }, 1000);
  }

  /**
   * Update presentation timer
   */
  updatePresentationTimer() {
    if (!this.startTime || !this.presentationTimer) return;
    
    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    this.presentationTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Handle initialization error
   * @param {Error} error - Error object
   */
  handleInitializationError(error) {
    console.error('Initialization error:', error);
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <div class="error-content">
        <h2>Initialization Error</h2>
        <p>Failed to initialize the presentation. Please refresh the page and try again.</p>
        <button onclick="location.reload()">Refresh Page</button>
      </div>
    `;
    
    document.body.appendChild(errorMessage);
    
    // Hide loading screen
    if (this.loadingScreen) {
      this.loadingScreen.style.display = 'none';
    }
  }

  /**
   * Handle before unload
   */
  handleBeforeUnload() {
    // Cleanup resources
    if (this.threeScene) {
      this.threeScene.cleanup();
    }
    
    if (this.demoController) {
      this.demoController.stop();
    }
  }

  /**
   * Get current section
   * @returns {string} Current section ID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Check if initialized
   * @returns {boolean} Is initialized
   */
  isReady() {
    return this.isInitialized;
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.acePresentation = new ACEPresentation();
  window.acePresentation.init();
});

// Add CSS for toast notifications
const toastCSS = `
  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2ecc71;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .toast-notification.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toast-content {
    font-size: 14px;
  }
  
  .error-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .error-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    max-width: 400px;
  }
  
  .error-content h2 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  .error-content button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Add toast CSS to document
const style = document.createElement('style');
style.textContent = toastCSS;
document.head.appendChild(style);