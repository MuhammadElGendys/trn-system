/**
 * UI Manager Module
 * Handles tab switching and dynamic DOM updates
 */
class UIManager {
  constructor(chartManager) {
    this.chartManager = chartManager;
  }

  /**
   * Initialize tab switching functionality
   * Handles switching between different pages: Dashboard, Live Data, Control, Alarms, Settings
   * Initializes charts only when Live Data tab is opened (performance optimization)
   */
  initTabs() {
    // Get all tab buttons and their corresponding content sections from DOM
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Attach click event listener to each tab button
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Get the tab name from the button's data-tab attribute
        const tabName = btn.dataset.tab;

        // Remove active class from all buttons and contents to deselect everything
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        // Add active class to clicked button and its corresponding content section
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Special case: only initialize charts when Live Data tab is opened
        // This optimizes performance by not creating charts until they're needed
        if (tabName === 'live-data') {
          this.chartManager.initCharts();
        }
      });
    });
  }

  /**
   * Update all display elements with latest data from API
   * Called every time new data is fetched from backend
   * 
   * Data Mapping (Backend to Frontend):
   * - motorRun → Status circle color (green if running, red if idle) + Val1
   * - temperature → Val2
   * - speedRPM → Val3
   * - pressure → Val4
   * 
   * @param {Object} data - Latest data from API
   */
  updateDisplay(data) {
    if (!data) return;

    // ===== UPDATE STATUS CIRCLE =====
    // Update the status circle color based on motorRun status from database
    const statusCircle = document.getElementById('statusCircle');
    const statusText = document.getElementById('statusText');

    if (statusCircle) {
      if (data.motorRun) {
        // System is running: add active class to show green circle
        statusCircle.classList.add('active');
        if (statusText) statusText.textContent = 'System Running';
      } else {
        // System is not running: remove active class to show red circle (default)
        statusCircle.classList.remove('active');
        if (statusText) statusText.textContent = 'System Stopped';
      }
    }

    // ===== UPDATE SYSTEM ACTIVATION TOGGLE =====
    // Sync the toggle button with the actual motorRun status from database
    const systemActivationControl = document.getElementById('systemActivationControl');
    if (systemActivationControl) {
      // Set checkbox checked state to match motorRun status
      systemActivationControl.checked = !!data.motorRun;
    }

    // ===== UPDATE PLACEHOLDER VALUES =====
    // Val1: Motor Run Status (1 = running, 0 = stopped)
    // Get the Val1 element from DOM and update it with motorRun status
    const val1 = document.getElementById('val1');
    if (val1) {
      // Display "1" if motor is running, "0" if stopped
      val1.textContent = data.motorRun ? '1' : '0';
    }

    // Val2: Temperature
    // Get the Val2 element from DOM and update it with temperature value from backend
    const val2 = document.getElementById('val2');
    if (val2) {
      // Display temperature or "--" if data is not available
      val2.textContent = data.temperature ?? '--';
    }

    // Val3: Speed/RPM
    // Get the Val3 element from DOM and update it with speed/RPM value from backend
    const val3 = document.getElementById('val3');
    if (val3) {
      // Display speedRPM or "--" if data is not available
      val3.textContent = data.speedRPM ?? '--';
    }

    // Val4: Pressure/Voltage
    // Get the Val4 element from DOM and update it with pressure/voltage value from backend
    const val4 = document.getElementById('val4');
    if (val4) {
      // Display pressure or "--" if data is not available
      val4.textContent = data.pressure ?? '--';
    }

    // TODO: Alarm status - placeholder for TIA-Portal alarms integration
    const alarmStatus = document.getElementById('alarmStatus');
    if (alarmStatus) {
      alarmStatus.textContent = data.alarmActive ? 'ACTIVE' : 'NORMAL';
    }
  }

  /**
   * Show a notification or alert to the user
   * Can be extended to show toast notifications, modals, etc.
   * 
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('success', 'error', 'warning', 'info')
   */
  notify(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Implement toast notifications or better UX feedback
  }
}
