/**
 * Modal System - Handles all modal dialogs and overlays
 * Provides accessible modal functionality with keyboard navigation
 */

class ModalSystem {
  constructor() {
    this.currentModal = null;
    this.modalStack = [];
    this.previousFocus = null;
    
    // DOM elements
    this.overlay = null;
    this.modal = null;
    this.modalTitle = null;
    this.modalBody = null;
    this.modalFooter = null;
    this.closeButton = null;
    this.primaryButton = null;
    this.secondaryButton = null;
    
    // Bind methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handlePrimaryClick = this.handlePrimaryClick.bind(this);
    this.handleSecondaryClick = this.handleSecondaryClick.bind(this);
  }

  /**
   * Initialize the modal system
   */
  init() {
    this.setupDOMReferences();
    this.setupEventListeners();
    console.log('Modal system initialized');
  }

  /**
   * Setup DOM references
   */
  setupDOMReferences() {
    this.overlay = document.getElementById('modal-overlay');
    this.modal = document.querySelector('.modal-content');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.querySelector('.modal-body');
    this.modalFooter = document.querySelector('.modal-footer');
    this.closeButton = document.getElementById('modal-close');
    this.primaryButton = document.getElementById('modal-implement');
    this.secondaryButton = document.getElementById('modal-cancel');
    
    // Problem modal specific elements
    this.problemSection = document.getElementById('modal-problem');
    this.problemText = document.getElementById('modal-problem-text');
    this.impactSection = document.getElementById('modal-impact');
    this.impactText = document.getElementById('modal-impact-text');
    this.solutionSection = document.getElementById('modal-solution');
    this.solutionText = document.getElementById('modal-solution-text');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (this.overlay) {
      this.overlay.addEventListener('click', this.handleOverlayClick);
    }
    
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.handleCloseClick);
    }
    
    if (this.primaryButton) {
      this.primaryButton.addEventListener('click', this.handlePrimaryClick);
    }
    
    if (this.secondaryButton) {
      this.secondaryButton.addEventListener('click', this.handleSecondaryClick);
    }
    
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Show problem modal
   * @param {Object} problemData - Problem data
   */
  showProblemModal(problemData) {
    this.currentModal = {
      type: 'problem',
      data: problemData
    };
    
    if (this.modalTitle) {
      this.modalTitle.textContent = problemData.title;
    }
    
    if (this.problemText) {
      this.problemText.textContent = problemData.description;
    }
    
    if (this.impactText) {
      this.impactText.textContent = problemData.impact;
    }
    
    if (this.solutionText) {
      this.solutionText.textContent = problemData.solution;
    }
    
    // Show relevant sections
    if (this.problemSection) this.problemSection.style.display = 'block';
    if (this.impactSection) this.impactSection.style.display = 'block';
    if (this.solutionSection) this.solutionSection.style.display = 'block';
    
    // Update buttons
    if (this.primaryButton) {
      this.primaryButton.textContent = 'Implement Solution';
      this.primaryButton.style.display = 'inline-block';
    }
    
    if (this.secondaryButton) {
      this.secondaryButton.textContent = 'Cancel';
      this.secondaryButton.style.display = 'inline-block';
    }
    
    this.showModal();
  }

  /**
   * Show KPI modal
   * @param {Object} kpiData - KPI data
   */
  showKPIModal(kpiData) {
    this.currentModal = {
      type: 'kpi',
      data: kpiData
    };
    
    if (this.modalTitle) {
      this.modalTitle.textContent = kpiData.title;
    }
    
    // Create KPI details content
    const kpiContent = `
      <div class="kpi-details">
        <div class="kpi-metric">
          <h4>Current Metric</h4>
          <div class="metric-value">${kpiData.value} ${kpiData.unit}</div>
          <div class="metric-trend ${kpiData.trend}">
            ${kpiData.trend === 'positive' ? '↑' : '↓'} ${kpiData.trend_value}
          </div>
        </div>
        
        <div class="kpi-description">
          <h4>Description</h4>
          <p>${kpiData.description}</p>
        </div>
        
        <div class="kpi-details-section">
          <h4>Details</h4>
          <p>${kpiData.details}</p>
        </div>
        
        <div class="kpi-targets">
          <h4>Performance Targets</h4>
          <div class="target-comparison">
            <div class="target-item">
              <span>Current:</span>
              <span class="target-value">${kpiData.current?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="target-item">
              <span>Target:</span>
              <span class="target-value">${kpiData.target?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    if (this.modalBody) {
      this.modalBody.innerHTML = kpiContent;
    }
    
    // Hide problem-specific sections
    if (this.problemSection) this.problemSection.style.display = 'none';
    if (this.impactSection) this.impactSection.style.display = 'none';
    if (this.solutionSection) this.solutionSection.style.display = 'none';
    
    // Update buttons
    if (this.primaryButton) {
      this.primaryButton.textContent = 'View Full Report';
      this.primaryButton.style.display = 'inline-block';
    }
    
    if (this.secondaryButton) {
      this.secondaryButton.textContent = 'Close';
      this.secondaryButton.style.display = 'inline-block';
    }
    
    this.showModal();
  }

  /**
   * Show pilot modal
   * @param {Object} pilotData - Pilot program data
   */
  showPilotModal(pilotData) {
    this.currentModal = {
      type: 'pilot',
      data: pilotData
    };
    
    if (this.modalTitle) {
      this.modalTitle.textContent = 'Launch Pilot Program';
    }
    
    const pilotContent = `
      <div class="pilot-details">
        <div class="pilot-overview">
          <h4>Pilot Location</h4>
          <p><strong>${pilotData.location}</strong></p>
          <p>Duration: ${pilotData.duration}</p>
        </div>
        
        <div class="pilot-phases">
          <h4>Implementation Phases</h4>
          ${pilotData.phases.map(phase => `
            <div class="phase-item">
              <div class="phase-header">
                <h5>Phase ${phase.phase}: ${phase.title}</h5>
                <span class="phase-duration">${phase.duration}</span>
              </div>
              <ul class="phase-components">
                ${phase.components ? phase.components.map(component => `
                  <li>${component}</li>
                `).join('') : ''}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <div class="pilot-outcomes">
          <h4>Expected Outcomes</h4>
          <ul>
            ${pilotData.expectedOutcomes.map(outcome => `
              <li>${outcome}</li>
            `).join('')}
          </ul>
        </div>
        
        <div class="pilot-timeline">
          <h4>Next Steps</h4>
          <ol>
            <li>Secure leadership approval and resource allocation</li>
            <li>Conduct stakeholder alignment meetings</li>
            <li>Begin Phase 1 implementation at ${pilotData.location}</li>
            <li>Establish baseline metrics and data collection</li>
            <li>Weekly progress reviews and adjustments</li>
          </ol>
        </div>
      </div>
    `;
    
    if (this.modalBody) {
      this.modalBody.innerHTML = pilotContent;
    }
    
    // Hide problem-specific sections
    if (this.problemSection) this.problemSection.style.display = 'none';
    if (this.impactSection) this.impactSection.style.display = 'none';
    if (this.solutionSection) this.solutionSection.style.display = 'none';
    
    // Update buttons
    if (this.primaryButton) {
      this.primaryButton.textContent = 'Approve Pilot';
      this.primaryButton.style.display = 'inline-block';
    }
    
    if (this.secondaryButton) {
      this.secondaryButton.textContent = 'Schedule Discussion';
      this.secondaryButton.style.display = 'inline-block';
    }
    
    this.showModal();
  }

  /**
   * Show ROI summary modal
   * @param {Object} roiData - ROI calculation data
   */
  showROISummaryModal(roiData) {
    this.currentModal = {
      type: 'roi',
      data: roiData
    };
    
    if (this.modalTitle) {
      this.modalTitle.textContent = 'ROI Summary';
    }
    
    const roiContent = `
      <div class="roi-summary-details">
        <div class="roi-overview">
          <h4>Investment Summary</h4>
          <div class="roi-metrics">
            <div class="roi-metric">
              <span class="metric-label">Total Investment:</span>
              <span class="metric-value">$${roiData.investment.toLocaleString()}</span>
            </div>
            <div class="roi-metric">
              <span class="metric-label">Total Savings:</span>
              <span class="metric-value">$${roiData.totalSavings.toLocaleString()}</span>
            </div>
            <div class="roi-metric">
              <span class="metric-label">Net Profit:</span>
              <span class="metric-value">$${roiData.netProfit.toLocaleString()}</span>
            </div>
            <div class="roi-metric highlight">
              <span class="metric-label">ROI:</span>
              <span class="metric-value">${roiData.roiPercentage}%</span>
            </div>
          </div>
        </div>
        
        <div class="roi-breakdown">
          <h4>Savings Breakdown</h4>
          <div class="savings-items">
            <div class="savings-item">
              <span>Damage Cost Reduction:</span>
              <span>$${roiData.damageSavings.toLocaleString()}</span>
            </div>
            <div class="savings-item">
              <span>Employee Retention Savings:</span>
              <span>$${roiData.retentionSavings.toLocaleString()}</span>
            </div>
            <div class="savings-item">
              <span>Revenue Increase:</span>
              <span>$${roiData.revenueincrease.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="roi-timeline">
          <h4>Expected Timeline</h4>
          <ul>
            <li><strong>Month 1-3:</strong> Initial setup and training (${roiData.employeesTrained} employees)</li>
            <li><strong>Month 4-6:</strong> Process implementation and optimization</li>
            <li><strong>Month 7-12:</strong> Full benefits realization</li>
            <li><strong>Year 2+:</strong> Compound benefits and system expansion</li>
          </ul>
        </div>
      </div>
    `;
    
    if (this.modalBody) {
      this.modalBody.innerHTML = roiContent;
    }
    
    // Hide problem-specific sections
    if (this.problemSection) this.problemSection.style.display = 'none';
    if (this.impactSection) this.impactSection.style.display = 'none';
    if (this.solutionSection) this.solutionSection.style.display = 'none';
    
    // Update buttons
    if (this.primaryButton) {
      this.primaryButton.textContent = 'Export PDF';
      this.primaryButton.style.display = 'inline-block';
    }
    
    if (this.secondaryButton) {
      this.secondaryButton.textContent = 'Close';
      this.secondaryButton.style.display = 'inline-block';
    }
    
    this.showModal();
  }

  /**
   * Show generic modal
   * @param {Object} options - Modal options
   */
  showModal(options = {}) {
    if (!this.overlay) return;
    
    // Store previous focus
    this.previousFocus = document.activeElement;
    
    // Show overlay
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    document.body.classList.add('no-scroll');
    
    // Focus on modal
    if (this.modal) {
      this.modal.focus();
    }
    
    // Add to modal stack
    this.modalStack.push(this.currentModal);
    
    // Dispatch event
    const event = new CustomEvent('modalOpened', {
      detail: { modal: this.currentModal }
    });
    window.dispatchEvent(event);
  }

  /**
   * Hide modal
   */
  hideModal() {
    if (!this.overlay) return;
    
    // Hide overlay
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.classList.remove('no-scroll');
    
    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
    
    // Remove from modal stack
    this.modalStack.pop();
    
    // Dispatch event
    const event = new CustomEvent('modalClosed', {
      detail: { modal: this.currentModal }
    });
    window.dispatchEvent(event);
    
    // Clear current modal
    this.currentModal = null;
  }

  /**
   * Close all modals
   */
  closeAll() {
    while (this.modalStack.length > 0) {
      this.hideModal();
    }
  }

  /**
   * Handle overlay click
   * @param {Event} e - Click event
   */
  handleOverlayClick(e) {
    if (e.target === this.overlay) {
      this.hideModal();
    }
  }

  /**
   * Handle close button click
   */
  handleCloseClick() {
    this.hideModal();
  }

  /**
   * Handle primary button click
   */
  handlePrimaryClick() {
    if (!this.currentModal) return;
    
    switch (this.currentModal.type) {
      case 'problem':
        this.handleImplementSolution();
        break;
      case 'kpi':
        this.handleViewReport();
        break;
      case 'pilot':
        this.handleApprovePilot();
        break;
      case 'roi':
        this.handleExportPDF();
        break;
    }
  }

  /**
   * Handle secondary button click
   */
  handleSecondaryClick() {
    if (!this.currentModal) return;
    
    switch (this.currentModal.type) {
      case 'problem':
        this.hideModal();
        break;
      case 'kpi':
        this.hideModal();
        break;
      case 'pilot':
        this.handleScheduleDiscussion();
        break;
      case 'roi':
        this.hideModal();
        break;
    }
  }

  /**
   * Handle implement solution
   */
  handleImplementSolution() {
    const problemData = this.currentModal.data;
    
    // Dispatch event for solution implementation
    const event = new CustomEvent('solutionImplemented', {
      detail: { 
        problemData,
        paperMesh: this.currentModal.paperMesh
      }
    });
    window.dispatchEvent(event);
    
    // Show success message
    this.showImplementationSuccess(problemData);
    
    // Hide modal
    this.hideModal();
  }

  /**
   * Handle view report
   */
  handleViewReport() {
    const kpiData = this.currentModal.data;
    
    // Create detailed report content
    const reportContent = `
      <div class="kpi-report">
        <h3>${kpiData.title} - Detailed Report</h3>
        <div class="report-section">
          <h4>Current Performance</h4>
          <p>Current value: ${kpiData.value} ${kpiData.unit}</p>
          <p>Trend: ${kpiData.trend_value} ${kpiData.trend}</p>
        </div>
        
        <div class="report-section">
          <h4>Analysis</h4>
          <p>${kpiData.details}</p>
        </div>
        
        <div class="report-section">
          <h4>Recommendations</h4>
          <ul>
            <li>Continue monitoring weekly trends</li>
            <li>Implement additional training where needed</li>
            <li>Review and adjust targets quarterly</li>
          </ul>
        </div>
      </div>
    `;
    
    if (this.modalBody) {
      this.modalBody.innerHTML = reportContent;
    }
    
    // Update buttons
    if (this.primaryButton) {
      this.primaryButton.textContent = 'Export Report';
    }
  }

  /**
   * Handle approve pilot
   */
  handleApprovePilot() {
    // Show approval confirmation
    this.showPilotApprovalConfirmation();
    this.hideModal();
  }

  /**
   * Handle schedule discussion
   */
  handleScheduleDiscussion() {
    // Show scheduling interface
    this.showSchedulingInterface();
    this.hideModal();
  }

  /**
   * Handle export PDF
   */
  handleExportPDF() {
    if (window.pdfExporter) {
      window.pdfExporter.exportROISummary(this.currentModal.data);
    }
    this.hideModal();
  }

  /**
   * Show implementation success message
   * @param {Object} problemData - Problem data
   */
  showImplementationSuccess(problemData) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.innerHTML = `
      <div class="toast-content">
        <strong>Solution Implemented!</strong><br>
        ${problemData.title} has been added to the implementation queue.
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Show pilot approval confirmation
   */
  showPilotApprovalConfirmation() {
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.innerHTML = `
      <div class="toast-content">
        <strong>Pilot Approved!</strong><br>
        Implementation will begin at Marriott Marquis within 2 weeks.
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Show scheduling interface
   */
  showSchedulingInterface() {
    const toast = document.createElement('div');
    toast.className = 'toast-notification info';
    toast.innerHTML = `
      <div class="toast-content">
        <strong>Discussion Scheduled!</strong><br>
        A follow-up meeting has been added to your calendar.
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Handle keyboard events
   * @param {Event} e - Keyboard event
   */
  handleKeyDown(e) {
    if (!this.currentModal) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.hideModal();
        break;
      case 'Tab':
        this.handleTabNavigation(e);
        break;
      case 'Enter':
        if (e.target === this.primaryButton) {
          e.preventDefault();
          this.handlePrimaryClick();
        } else if (e.target === this.secondaryButton) {
          e.preventDefault();
          this.handleSecondaryClick();
        }
        break;
    }
  }

  /**
   * Handle tab navigation within modal
   * @param {Event} e - Keyboard event
   */
  handleTabNavigation(e) {
    if (!this.modal) return;
    
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Get current modal
   * @returns {Object|null} Current modal
   */
  getCurrentModal() {
    return this.currentModal;
  }

  /**
   * Check if modal is open
   * @returns {boolean} Is modal open
   */
  isOpen() {
    return this.currentModal !== null;
  }
}

// Create global instance
window.ModalSystem = ModalSystem;