/**
 * Data Manager - Handles loading and caching of presentation data
 * Implements offline-first architecture with localStorage caching
 */

class DataManager {
  constructor() {
    this.data = null;
    this.cacheKey = 'ace-presentation-data';
    this.cacheVersion = '1.0';
    this.cacheVersionKey = 'ace-presentation-version';
  }

  /**
   * Load presentation data with offline-first approach
   * @returns {Promise<Object>} Presentation data
   */
  async loadData() {
    try {
      // Check if we have cached data and if it's current version
      const cachedVersion = localStorage.getItem(this.cacheVersionKey);
      if (cachedVersion === this.cacheVersion) {
        const cachedData = localStorage.getItem(this.cacheKey);
        if (cachedData) {
          this.data = JSON.parse(cachedData);
          console.log('Loaded data from cache');
          return this.data;
        }
      }

      // Fetch fresh data
      const response = await fetch('data/presentation-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.data = await response.json();
      
      // Cache the data
      this.cacheData();
      
      console.log('Loaded fresh data and cached it');
      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Try to fall back to cached data even if it's old
      const cachedData = localStorage.getItem(this.cacheKey);
      if (cachedData) {
        this.data = JSON.parse(cachedData);
        console.log('Fell back to cached data');
        return this.data;
      }
      
      // If no cached data, return minimal fallback
      return this.getFallbackData();
    }
  }

  /**
   * Cache data to localStorage
   */
  cacheData() {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.data));
      localStorage.setItem(this.cacheVersionKey, this.cacheVersion);
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  /**
   * Get problems by section
   * @param {string} section - Section ID
   * @returns {Array} Array of problems
   */
  getProblemsBySection(section) {
    if (!this.data || !this.data.problems) return [];
    return this.data.problems.filter(problem => problem.section === section);
  }

  /**
   * Get solutions by category
   * @param {string} category - Category name
   * @returns {Array} Array of solutions
   */
  getSolutionsByCategory(category) {
    if (!this.data || !this.data.solutions) return [];
    return this.data.solutions.filter(solution => solution.category === category);
  }

  /**
   * Get manager initiative by ID
   * @param {string} id - Initiative ID
   * @returns {Object|null} Manager initiative
   */
  getManagerInitiative(id) {
    if (!this.data || !this.data.managerInitiatives) return null;
    return this.data.managerInitiatives.find(initiative => initiative.id === id);
  }

  /**
   * Get executive KPIs
   * @returns {Array} Array of KPIs
   */
  getExecutiveKPIs() {
    if (!this.data || !this.data.executiveKPIs) return [];
    return this.data.executiveKPIs;
  }

  /**
   * Get ROI simulator configuration
   * @returns {Object} ROI simulator config
   */
  getROISimulator() {
    if (!this.data || !this.data.roiSimulator) return this.getDefaultROISimulator();
    return this.data.roiSimulator;
  }

  /**
   * Get pilot program information
   * @returns {Object} Pilot program details
   */
  getPilotInfo() {
    if (!this.data || !this.data.pilot) return this.getDefaultPilotInfo();
    return this.data.pilot;
  }

  /**
   * Get ACE Way values
   * @returns {Object} ACE Way values
   */
  getAceWay() {
    if (!this.data || !this.data.aceWay) return this.getDefaultAceWay();
    return this.data.aceWay;
  }

  /**
   * Get section information
   * @param {string} sectionId - Section ID
   * @returns {Object|null} Section information
   */
  getSection(sectionId) {
    if (!this.data || !this.data.presentation || !this.data.presentation.sections) return null;
    return this.data.presentation.sections.find(section => section.id === sectionId);
  }

  /**
   * Calculate ROI based on investment amount
   * @param {number} investment - Investment amount
   * @returns {Object} ROI calculations
   */
  calculateROI(investment) {
    const config = this.getROISimulator();
    const calc = config.calculations;
    
    // Calculate number of employees that can be trained
    const employeesTrained = Math.floor(investment / calc.trainingCostPerEmployee);
    
    // Calculate annual savings
    const damageSavings = calc.damageReductionRate * 25000; // Assuming $25k annual damage costs
    const retentionSavings = calc.retentionImprovementRate * employeesTrained * calc.averageEmployeeSalary * calc.turnoverCostMultiplier;
    const revenueincrease = calc.revenueIncreaseRate * 2555 * 365; // Daily revenue increase
    
    const totalSavings = damageSavings + retentionSavings + revenueincrease;
    const roiPercentage = ((totalSavings - investment) / investment) * 100;
    
    return {
      investment,
      employeesTrained,
      damageSavings: Math.round(damageSavings),
      retentionSavings: Math.round(retentionSavings),
      revenueincrease: Math.round(revenueincrease),
      totalSavings: Math.round(totalSavings),
      netProfit: Math.round(totalSavings - investment),
      roiPercentage: Math.round(roiPercentage)
    };
  }

  /**
   * Get fallback data when remote data fails to load
   * @returns {Object} Minimal fallback data
   */
  getFallbackData() {
    return {
      presentation: {
        title: "ACE Valet Operations Improvement Proposal",
        subtitle: "From Reactive Chaos to Proactive Excellence",
        sections: [
          { id: "chaos", title: "The Chaotic Desk", subtitle: "Current Reality" },
          { id: "valet", title: "The Firefighter Solution", subtitle: "Valet Layer" },
          { id: "manager", title: "The Watchtower Perspective", subtitle: "Manager Layer" },
          { id: "executive", title: "The Strategic Altitude", subtitle: "Executive Layer" },
          { id: "closing", title: "The Transformation", subtitle: "Call to Action" }
        ]
      },
      problems: [],
      solutions: [],
      managerInitiatives: [],
      executiveKPIs: [],
      roiSimulator: this.getDefaultROISimulator(),
      pilot: this.getDefaultPilotInfo(),
      aceWay: this.getDefaultAceWay()
    };
  }

  /**
   * Get default ROI simulator configuration
   * @returns {Object} Default ROI simulator
   */
  getDefaultROISimulator() {
    return {
      baseInvestment: 50000,
      minInvestment: 10000,
      maxInvestment: 100000,
      step: 5000,
      calculations: {
        trainingCostPerEmployee: 200,
        damageReductionRate: 0.6,
        revenueIncreaseRate: 0.15,
        retentionImprovementRate: 0.35,
        averageEmployeeSalary: 35000,
        turnoverCostMultiplier: 1.5
      }
    };
  }

  /**
   * Get default pilot information
   * @returns {Object} Default pilot info
   */
  getDefaultPilotInfo() {
    return {
      location: "Marriott Marquis San Diego Marina",
      duration: "6 months",
      phases: [
        {
          phase: 1,
          title: "Foundational Systems & Data Capture",
          duration: "3-6 months"
        }
      ],
      expectedOutcomes: [
        "Significant cost reductions in turnover, damages, and bonuses",
        "Enhanced revenue through improved billing accuracy"
      ]
    };
  }

  /**
   * Get default ACE Way values
   * @returns {Object} Default ACE Way
   */
  getDefaultAceWay() {
    return {
      vision: {
        title: "VISION",
        description: "Situational awareness, career path"
      },
      values: {
        title: "VALUES", 
        description: "Employees are valued"
      },
      team: {
        title: "TEAM",
        description: "Collaboration is essential"
      }
    };
  }

  /**
   * Search problems by text
   * @param {string} searchTerm - Search term
   * @returns {Array} Matching problems
   */
  searchProblems(searchTerm) {
    if (!this.data || !this.data.problems) return [];
    const term = searchTerm.toLowerCase();
    return this.data.problems.filter(problem => 
      problem.title.toLowerCase().includes(term) ||
      problem.description.toLowerCase().includes(term) ||
      problem.impact.toLowerCase().includes(term)
    );
  }

  /**
   * Get problem by ID
   * @param {string} id - Problem ID
   * @returns {Object|null} Problem object
   */
  getProblem(id) {
    if (!this.data || !this.data.problems) return null;
    return this.data.problems.find(problem => problem.id === id);
  }

  /**
   * Get solution by ID
   * @param {string} id - Solution ID
   * @returns {Object|null} Solution object
   */
  getSolution(id) {
    if (!this.data || !this.data.solutions) return null;
    return this.data.solutions.find(solution => solution.id === id);
  }

  /**
   * Get total financial impact of all problems
   * @returns {number} Total financial impact
   */
  getTotalFinancialImpact() {
    if (!this.data || !this.data.problems) return 0;
    return this.data.problems.reduce((total, problem) => total + (problem.financial_impact || 0), 0);
  }

  /**
   * Get problems grouped by category
   * @returns {Object} Problems grouped by category
   */
  getProblemsByCategory() {
    if (!this.data || !this.data.problems) return {};
    return this.data.problems.reduce((groups, problem) => {
      const category = problem.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(problem);
      return groups;
    }, {});
  }

  /**
   * Export data as JSON string
   * @returns {string} JSON string of current data
   */
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Clear cached data
   */
  clearCache() {
    localStorage.removeItem(this.cacheKey);
    localStorage.removeItem(this.cacheVersionKey);
  }
}

// Create global instance
window.dataManager = new DataManager();