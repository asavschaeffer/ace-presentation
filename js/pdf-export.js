/**
 * PDF Export Controller - Handles PDF generation and export
 * Uses jsPDF to create downloadable ROI summaries
 */

class PDFExporter {
  constructor() {
    this.jsPDF = window.jspdf?.jsPDF;
    this.isAvailable = !!this.jsPDF;
    
    if (!this.isAvailable) {
      console.warn('jsPDF not available - PDF export disabled');
    }
  }

  /**
   * Export ROI summary as PDF
   * @param {Object} roiData - ROI calculation data (optional)
   */
  exportROISummary(roiData = null) {
    if (!this.isAvailable) {
      this.showError('PDF export is not available');
      return;
    }

    try {
      // Get ROI data if not provided
      if (!roiData) {
        const investment = document.getElementById('training-investment')?.value || 50000;
        roiData = window.dataManager.calculateROI(parseInt(investment));
      }

      // Create PDF
      const doc = new this.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add content
      this.addHeader(doc);
      this.addROIOverview(doc, roiData);
      this.addSavingsBreakdown(doc, roiData);
      this.addImplementationTimeline(doc);
      this.addPilotDetails(doc);
      this.addFooter(doc);

      // Save PDF
      const fileName = `ACE_ROI_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      // Show success message
      this.showSuccess('ROI summary exported successfully');

    } catch (error) {
      console.error('PDF export error:', error);
      this.showError('Failed to export PDF');
    }
  }

  /**
   * Add header to PDF
   * @param {Object} doc - jsPDF document
   */
  addHeader(doc) {
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ACE Valet Operations Improvement', pageWidth / 2, 25, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('ROI Summary & Implementation Plan', pageWidth / 2, 35, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated: ${date}`, pageWidth / 2, 45, { align: 'center' });
    
    // Reset color
    doc.setTextColor(0);
    
    // Add line
    doc.setLineWidth(0.5);
    doc.line(20, 50, pageWidth - 20, 50);
  }

  /**
   * Add ROI overview section
   * @param {Object} doc - jsPDF document
   * @param {Object} roiData - ROI data
   */
  addROIOverview(doc, roiData) {
    let yPosition = 65;
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment Overview', 20, yPosition);
    yPosition += 10;
    
    // ROI metrics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const metrics = [
      { label: 'Total Investment:', value: `$${roiData.investment.toLocaleString()}` },
      { label: 'Total Annual Savings:', value: `$${roiData.totalSavings.toLocaleString()}` },
      { label: 'Net Annual Profit:', value: `$${roiData.netProfit.toLocaleString()}` },
      { label: 'Return on Investment:', value: `${roiData.roiPercentage}%` }
    ];
    
    metrics.forEach(metric => {
      doc.text(metric.label, 25, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.value, 120, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 8;
    });
    
    // ROI highlight box
    if (roiData.roiPercentage > 0) {
      doc.setFillColor(46, 204, 113);
      doc.roundedRect(25, yPosition + 5, 150, 15, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(`Positive ROI: ${roiData.roiPercentage}% return on investment`, 30, yPosition + 13);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'normal');
    }
  }

  /**
   * Add savings breakdown section
   * @param {Object} doc - jsPDF document
   * @param {Object} roiData - ROI data
   */
  addSavingsBreakdown(doc, roiData) {
    let yPosition = 130;
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Savings Breakdown', 20, yPosition);
    yPosition += 10;
    
    // Savings items
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const savingsItems = [
      {
        category: 'Damage Cost Reduction',
        amount: roiData.damageSavings,
        description: 'Reduced incidents through better training and standardized procedures'
      },
      {
        category: 'Employee Retention Savings',
        amount: roiData.retentionSavings,
        description: 'Lower turnover costs through improved training and career development'
      },
      {
        category: 'Revenue Increase',
        amount: roiData.revenueincrease,
        description: 'Improved billing accuracy and reduced service credits'
      }
    ];
    
    savingsItems.forEach(item => {
      // Category and amount
      doc.setFont('helvetica', 'bold');
      doc.text(item.category, 25, yPosition);
      doc.text(`$${item.amount.toLocaleString()}`, 150, yPosition);
      yPosition += 6;
      
      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(item.description, 150);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 4 + 8;
      
      doc.setFontSize(12);
    });
  }

  /**
   * Add implementation timeline section
   * @param {Object} doc - jsPDF document
   */
  addImplementationTimeline(doc) {
    let yPosition = 200;
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Implementation Timeline', 20, yPosition);
    yPosition += 10;
    
    // Timeline phases
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const phases = [
      { phase: 'Phase 1 (Months 1-6)', title: 'Foundational Systems & Data Capture' },
      { phase: 'Phase 2 (Months 6-12)', title: 'Training & Process Standardization' },
      { phase: 'Phase 3 (12+ Months)', title: 'Performance Management & Culture Enhancement' }
    ];
    
    phases.forEach(phase => {
      doc.setFont('helvetica', 'bold');
      doc.text(phase.phase, 25, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(phase.title, 25, yPosition);
      yPosition += 12;
    });
  }

  /**
   * Add pilot details section
   * @param {Object} doc - jsPDF document
   */
  addPilotDetails(doc) {
    // Check if we need a new page
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 260;
    
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Pilot Program Details', 20, yPosition);
    yPosition += 10;
    
    // Pilot info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const pilotInfo = window.dataManager.getPilotInfo();
    
    doc.text(`Location: ${pilotInfo.location}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Duration: ${pilotInfo.duration}`, 25, yPosition);
    yPosition += 12;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Expected Outcomes:', 25, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    pilotInfo.expectedOutcomes.forEach(outcome => {
      const lines = doc.splitTextToSize(`• ${outcome}`, 150);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 6;
    });
  }

  /**
   * Add footer to PDF
   * @param {Object} doc - jsPDF document
   */
  addFooter(doc) {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Footer line
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    // Footer text
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('ACE Parking - Valet Operations Improvement Proposal', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('🤖 Generated with Claude Code (https://claude.ai/code)', pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  /**
   * Export full proposal as PDF
   */
  exportFullProposal() {
    if (!this.isAvailable) {
      this.showError('PDF export is not available');
      return;
    }

    try {
      const doc = new this.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add comprehensive proposal content
      this.addProposalHeader(doc);
      this.addExecutiveSummary(doc);
      this.addProblemAnalysis(doc);
      this.addSolutionOverview(doc);
      this.addImplementationPlan(doc);
      this.addROIAnalysis(doc);
      this.addAppendices(doc);

      // Save PDF
      const fileName = `ACE_Full_Proposal_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      this.showSuccess('Full proposal exported successfully');

    } catch (error) {
      console.error('PDF export error:', error);
      this.showError('Failed to export full proposal');
    }
  }

  /**
   * Add proposal header
   * @param {Object} doc - jsPDF document
   */
  addProposalHeader(doc) {
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ACE Parking', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('Valet Operations Improvement Proposal', pageWidth / 2, 45, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('From Reactive Chaos to Proactive Excellence', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Prepared: ${new Date().toLocaleDateString()}`, pageWidth / 2, 75, { align: 'center' });
    
    doc.setTextColor(0);
  }

  /**
   * Add executive summary
   * @param {Object} doc - jsPDF document
   */
  addExecutiveSummary(doc) {
    doc.addPage();
    
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const summary = [
      'Current ACE Parking valet operations face significant systemic challenges that impact operational efficiency, contribute to costs, and affect service consistency.',
      '',
      'This proposal outlines a comprehensive, phased initiative to implement structured systems, standardized processes, and robust training, supported by a dedicated software solution.',
      '',
      'Key benefits include:',
      '• Reduced expenses from lower turnover and fewer damage claims',
      '• Enhanced revenue through improved billing accuracy',
      '• Improved operational efficiency and service consistency',
      '• Higher employee morale and retention',
      '',
      'The proposed pilot program at Marriott Marquis will validate the approach and demonstrate measurable ROI before company-wide implementation.'
    ];
    
    summary.forEach(line => {
      if (line === '') {
        yPosition += 6;
      } else {
        const lines = doc.splitTextToSize(line, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 6;
      }
    });
  }

  /**
   * Add problem analysis
   * @param {Object} doc - jsPDF document
   */
  addProblemAnalysis(doc) {
    doc.addPage();
    
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Problem Analysis', 20, yPosition);
    yPosition += 15;
    
    const problems = window.dataManager.getProblemsBySection('valet');
    const totalImpact = window.dataManager.getTotalFinancialImpact();
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Annual Financial Impact: $${totalImpact.toLocaleString()}`, 20, yPosition);
    yPosition += 15;
    
    problems.slice(0, 5).forEach(problem => {
      doc.setFont('helvetica', 'bold');
      doc.text(problem.title, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(problem.description, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 8;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });
  }

  /**
   * Add solution overview
   * @param {Object} doc - jsPDF document
   */
  addSolutionOverview(doc) {
    doc.addPage();
    
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Solution Overview', 20, yPosition);
    yPosition += 15;
    
    const solutions = window.dataManager.getSolutionsByCategory('training')
      .concat(window.dataManager.getSolutionsByCategory('processes'))
      .concat(window.dataManager.getSolutionsByCategory('accountability'));
    
    solutions.forEach(solution => {
      doc.setFont('helvetica', 'bold');
      doc.text(solution.title, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(solution.description, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 8;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });
  }

  /**
   * Add implementation plan
   * @param {Object} doc - jsPDF document
   */
  addImplementationPlan(doc) {
    doc.addPage();
    
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Implementation Plan', 20, yPosition);
    yPosition += 15;
    
    const pilotInfo = window.dataManager.getPilotInfo();
    
    pilotInfo.phases.forEach(phase => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Phase ${phase.phase}: ${phase.title}`, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Duration: ${phase.duration}`, 20, yPosition);
      yPosition += 10;
      
      if (phase.components) {
        phase.components.forEach(component => {
          doc.text(`• ${component}`, 25, yPosition);
          yPosition += 6;
        });
      }
      
      yPosition += 10;
    });
  }

  /**
   * Add ROI analysis
   * @param {Object} doc - jsPDF document
   */
  addROIAnalysis(doc) {
    const roiData = window.dataManager.calculateROI(50000);
    this.addROIOverview(doc, roiData);
    this.addSavingsBreakdown(doc, roiData);
  }

  /**
   * Add appendices
   * @param {Object} doc - jsPDF document
   */
  addAppendices(doc) {
    doc.addPage();
    
    let yPosition = 30;
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Appendices', 20, yPosition);
    yPosition += 15;
    
    // Add ACE Way values
    const aceWay = window.dataManager.getAceWay();
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('The ACE Way', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    Object.values(aceWay).forEach(value => {
      doc.setFont('helvetica', 'bold');
      doc.text(value.title, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(value.description, 20, yPosition);
      yPosition += 10;
    });
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  showNotification(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        ${message}
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
   * Check if PDF export is available
   * @returns {boolean} Is available
   */
  isExportAvailable() {
    return this.isAvailable;
  }
}

// Create global instance
window.PDFExporter = PDFExporter;