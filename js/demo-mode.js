/**
 * Demo Mode Controller - Handles automated presentation flow
 * Provides a 30-second automated demo sequence
 */

class DemoController {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.stepTimeout = null;
    this.demoSequence = [];
    
    // Demo timing
    this.stepDelay = 3000; // 3 seconds between steps
    this.totalDuration = 30000; // 30 seconds total
    
    // Bind methods
    this.executeStep = this.executeStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  /**
   * Initialize demo controller
   */
  init() {
    this.setupDemoSequence();
    console.log('Demo controller initialized');
  }

  /**
   * Setup the demo sequence
   */
  setupDemoSequence() {
    this.demoSequence = [
      {
        name: 'Show chaos section',
        action: () => {
          if (window.acePresentation) {
            window.acePresentation.navigateToSection('chaos');
          }
        },
        duration: 4000
      },
      {
        name: 'Click a problem paper',
        action: () => {
          const problemPaper = document.querySelector('.chaos-paper');
          if (problemPaper) {
            problemPaper.click();
          }
        },
        duration: 3000
      },
      {
        name: 'Close modal and transition to valet',
        action: () => {
          if (window.acePresentation?.modalSystem) {
            window.acePresentation.modalSystem.hideModal();
          }
          setTimeout(() => {
            if (window.acePresentation) {
              window.acePresentation.navigateToSection('valet');
            }
          }, 500);
        },
        duration: 4000
      },
      {
        name: 'Transition to manager section',
        action: () => {
          if (window.acePresentation) {
            window.acePresentation.navigateToSection('manager');
          }
        },
        duration: 3000
      },
      {
        name: 'Open binder',
        action: () => {
          const binder = document.getElementById('operations-binder');
          if (binder) {
            binder.click();
          }
        },
        duration: 3000
      },
      {
        name: 'Transition to executive section',
        action: () => {
          if (window.acePresentation) {
            window.acePresentation.navigateToSection('executive');
          }
        },
        duration: 4000
      },
      {
        name: 'Click KPI card',
        action: () => {
          const kpiCard = document.querySelector('.kpi-card');
          if (kpiCard) {
            kpiCard.click();
          }
        },
        duration: 3000
      },
      {
        name: 'Close modal and transition to closing',
        action: () => {
          if (window.acePresentation?.modalSystem) {
            window.acePresentation.modalSystem.hideModal();
          }
          setTimeout(() => {
            if (window.acePresentation) {
              window.acePresentation.navigateToSection('closing');
            }
          }, 500);
        },
        duration: 4000
      },
      {
        name: 'Highlight launch button',
        action: () => {
          const launchBtn = document.getElementById('launch-pilot-btn');
          if (launchBtn) {
            launchBtn.classList.add('pulse-animation');
            launchBtn.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.8)';
          }
        },
        duration: 2000
      },
      {
        name: 'Reset demo',
        action: () => {
          this.reset();
        },
        duration: 0
      }
    ];
  }

  /**
   * Start the demo
   */
  start() {
    if (this.isRunning) {
      this.stop();
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.currentStep = 0;
    
    // Show demo indicator
    this.showDemoIndicator();
    
    // Start demo sequence
    this.executeStep();
    
    console.log('Demo mode started');
  }

  /**
   * Stop the demo
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    // Clear any pending timeouts
    if (this.stepTimeout) {
      clearTimeout(this.stepTimeout);
      this.stepTimeout = null;
    }
    
    // Hide demo indicator
    this.hideDemoIndicator();
    
    // Reset any demo effects
    this.resetDemoEffects();
    
    console.log('Demo mode stopped');
  }

  /**
   * Pause the demo
   */
  pause() {
    if (!this.isRunning) return;
    
    this.isPaused = true;
    
    if (this.stepTimeout) {
      clearTimeout(this.stepTimeout);
      this.stepTimeout = null;
    }
    
    console.log('Demo mode paused');
  }

  /**
   * Resume the demo
   */
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    
    this.isPaused = false;
    this.executeStep();
    
    console.log('Demo mode resumed');
  }

  /**
   * Execute current step
   */
  executeStep() {
    if (!this.isRunning || this.isPaused) return;
    
    const step = this.demoSequence[this.currentStep];
    if (!step) {
      this.stop();
      return;
    }
    
    console.log(`Demo step: ${step.name}`);
    
    // Update demo indicator
    this.updateDemoIndicator(step.name);
    
    // Execute step action
    try {
      step.action();
    } catch (error) {
      console.error('Demo step error:', error);
    }
    
    // Schedule next step
    this.stepTimeout = setTimeout(() => {
      this.nextStep();
    }, step.duration);
  }

  /**
   * Move to next step
   */
  nextStep() {
    if (!this.isRunning) return;
    
    this.currentStep++;
    
    if (this.currentStep >= this.demoSequence.length) {
      this.stop();
      return;
    }
    
    this.executeStep();
  }

  /**
   * Reset demo to beginning
   */
  reset() {
    this.currentStep = 0;
    this.resetDemoEffects();
    
    // Return to chaos section
    if (window.acePresentation) {
      window.acePresentation.navigateToSection('chaos');
    }
  }

  /**
   * Show demo indicator
   */
  showDemoIndicator() {
    // Create demo indicator if it doesn't exist
    let indicator = document.getElementById('demo-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'demo-indicator';
      indicator.className = 'demo-indicator';
      indicator.innerHTML = `
        <div class="demo-indicator-content">
          <div class="demo-indicator-icon">🎬</div>
          <div class="demo-indicator-text">
            <strong>Demo Mode</strong>
            <span id="demo-step-text">Starting...</span>
          </div>
          <button id="demo-stop-btn" class="demo-stop-btn">Stop</button>
        </div>
      `;
      document.body.appendChild(indicator);
      
      // Add stop button listener
      const stopBtn = indicator.querySelector('#demo-stop-btn');
      if (stopBtn) {
        stopBtn.addEventListener('click', () => {
          this.stop();
        });
      }
    }
    
    indicator.classList.add('active');
  }

  /**
   * Hide demo indicator
   */
  hideDemoIndicator() {
    const indicator = document.getElementById('demo-indicator');
    if (indicator) {
      indicator.classList.remove('active');
    }
  }

  /**
   * Update demo indicator text
   * @param {string} stepName - Current step name
   */
  updateDemoIndicator(stepName) {
    const stepText = document.getElementById('demo-step-text');
    if (stepText) {
      stepText.textContent = stepName;
    }
  }

  /**
   * Reset demo effects
   */
  resetDemoEffects() {
    // Remove pulse animation from launch button
    const launchBtn = document.getElementById('launch-pilot-btn');
    if (launchBtn) {
      launchBtn.classList.remove('pulse-animation');
      launchBtn.style.boxShadow = '';
    }
    
    // Close any open modals
    if (window.acePresentation?.modalSystem) {
      window.acePresentation.modalSystem.closeAll();
    }
  }

  /**
   * Skip to specific step
   * @param {number} stepIndex - Step index to skip to
   */
  skipToStep(stepIndex) {
    if (!this.isRunning || stepIndex < 0 || stepIndex >= this.demoSequence.length) {
      return;
    }
    
    // Clear current timeout
    if (this.stepTimeout) {
      clearTimeout(this.stepTimeout);
      this.stepTimeout = null;
    }
    
    this.currentStep = stepIndex;
    this.executeStep();
  }

  /**
   * Get current step info
   * @returns {Object} Current step info
   */
  getCurrentStep() {
    return {
      index: this.currentStep,
      total: this.demoSequence.length,
      step: this.demoSequence[this.currentStep] || null,
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }

  /**
   * Get demo progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    if (!this.isRunning) return 0;
    return Math.round((this.currentStep / this.demoSequence.length) * 100);
  }

  /**
   * Set demo speed
   * @param {number} speed - Speed multiplier (0.5 = slow, 1 = normal, 2 = fast)
   */
  setSpeed(speed) {
    this.stepDelay = 3000 / speed;
  }

  /**
   * Check if demo is running
   * @returns {boolean} Is running
   */
  isActive() {
    return this.isRunning;
  }

  /**
   * Check if demo is paused
   * @returns {boolean} Is paused
   */
  isPausedState() {
    return this.isPaused;
  }
}

// Add CSS for demo indicator
const demoCSS = `
  .demo-indicator {
    position: fixed;
    top: 80px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 1500;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    min-width: 280px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .demo-indicator.active {
    transform: translateX(0);
    opacity: 1;
  }
  
  .demo-indicator-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .demo-indicator-icon {
    font-size: 20px;
  }
  
  .demo-indicator-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .demo-indicator-text strong {
    font-size: 14px;
  }
  
  .demo-indicator-text span {
    font-size: 12px;
    opacity: 0.8;
  }
  
  .demo-stop-btn {
    background: #e74c3c;
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease;
  }
  
  .demo-stop-btn:hover {
    background: #c0392b;
  }
  
  @media (max-width: 768px) {
    .demo-indicator {
      right: 10px;
      top: 70px;
      min-width: 250px;
    }
    
    .demo-indicator-content {
      gap: 8px;
    }
  }
`;

// Add demo CSS to document
const demoStyle = document.createElement('style');
demoStyle.textContent = demoCSS;
document.head.appendChild(demoStyle);

// Create global instance
window.DemoController = DemoController;