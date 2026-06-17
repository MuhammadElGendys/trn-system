/**
 * Main Application Module
 * Orchestrates all components and manages initialization and data polling
 */
class App {
  constructor(apiUrl = CONFIG.BACKEND_URL) {
    // Initialize all modules
    this.apiClient = new ApiClient(apiUrl);
    this.chartManager = new ChartManager();
    this.calendar = new Calendar();
    this.ui = new UIManager(this.chartManager);
    this.controls = new ControlPanel(this.apiClient);

    // Polling configuration
    this.pollingInterval = 1000; // 1 second
    this.pollTimer = null;
  }

  /**
   * Main initialization function
   * Called when DOM is fully loaded
   * Sets up all event listeners and starts data polling
   */
  async init() {
    console.log('Initializing TRN Dashboard...');

    // Set up tab switching functionality between Dashboard, Live Data, Control, etc.
    this.ui.initTabs();

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => this.calendar.previousWeek());
    }
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => this.calendar.nextWeek());
    }

    // Set up event listeners for all control toggles (Robot Arm, Belt, Sensors)
    this.controls.initToggles();

    // Fetch initial data from backend immediately
    await this.loadData();

    // Set up data polling: fetch new data every interval for real-time updates
    this.startPolling();

    console.log('TRN Dashboard initialized successfully');
  }

  /**
   * Load latest data from API and update all UI elements
   * Called automatically every 1 second via polling
   */
  async loadData() {
    try {
      const data = await this.apiClient.fetchLatest();

      if (data) {
        // Update UI display with new data
        this.ui.updateDisplay(data);

        // Add data point to chart history
        this.chartManager.addDataPoint(data);

        // Update charts if they're already initialized
        if (Object.keys(this.chartManager.charts).length > 0) {
          this.chartManager.updateCharts();
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }

  /**
   * Start polling for new data at configured interval
   */
  startPolling() {
    this.pollTimer = setInterval(() => this.loadData(), this.pollingInterval);
    console.log(`Data polling started: every ${this.pollingInterval}ms`);
  }

  /**
   * Stop polling for new data
   * Useful for cleanup or temporarily pausing updates
   */
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
      console.log('Data polling stopped');
    }
  }

  /**
   * Change the polling interval
   * 
   * @param {number} interval - Interval in milliseconds
   */
  setPollingInterval(interval) {
    this.pollingInterval = interval;
    this.stopPolling();
    this.startPolling();
    console.log(`Polling interval changed to: ${interval}ms`);
  }

  /**
   * Get all module instances for external access if needed
   * Returns object containing all initialized modules
   * 
   * @returns {Object} Object with all module references
   */
  getModules() {
    return {
      apiClient: this.apiClient,
      chartManager: this.chartManager,
      ui: this.ui,
      controls: this.controls
    };
  }
}

// ===== INITIALIZATION =====
// Initialize the app when DOM is ready
let app = null;

if (document.readyState === 'loading') {
  // Page is still loading: wait for DOMContentLoaded event before initializing
  document.addEventListener('DOMContentLoaded', async () => {
    app = new App();
    await app.init();
  });
} else {
  // Page already loaded: initialize immediately
  app = new App();
  app.init();
}
