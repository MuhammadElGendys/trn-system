/**
 * Configuration File - IP & URL Settings
 * 
 * IMPORTANT: Update the URLs below to match your network configuration
 * 
 * HOW TO FIND YOUR IP ADDRESS:
 * ============================
 * Windows:
 *   1. Open Command Prompt (cmd)
 *   2. Type: ipconfig
 *   3. Look for "IPv4 Address" (e.g., 192.168.1.100)
 * 
 * Mac/Linux:
 *   1. Open Terminal
 *   2. Type: ifconfig
 *   3. Look for "inet" address (e.g., 192.168.1.100)
 * 
 * WHICH IP FOR WHICH MACHINE:
 * ============================
 * BACKEND_URL:
 *   - Use the IP of the machine running Node.js backend (server.js)
 *   - Default port: 3000
 *   - Example: http://192.168.1.100:3000
 * 
 * NODE_RED_URL (in server.js):
 *   - Use the IP of the machine running Node-RED
 *   - Default port: 1880
 *   - Example: http://192.168.1.100:1880/api/control
 *
 * If everything runs on the same PC: use localhost or 127.0.0.1
 *   Example: http://localhost:3000
 */

const CONFIG = {
  // Backend URL - Where Node.js Express server is running
  // Update this to match your backend server IP and port
  BACKEND_URL: "http://localhost:3000",

  // Node-RED URL - Where Node-RED is running (for direct data/control)
  // Update this to match your Node-RED server IP and port
  NODE_RED_URL: "http://localhost:1880",

  // Add other configuration variables as needed
  // Example:
  // POLLING_INTERVAL: 1000,  // milliseconds
  // DEBUG_MODE: false
};

// Optional: Log warning if using default IPs (helps with debugging)
window.addEventListener('DOMContentLoaded', () => {
  if (CONFIG.BACKEND_URL.includes('192.168.178.187')) {
    console.warn(
      '%c⚠️  CONFIG WARNING',
      'color: orange; font-weight: bold;',
      '\nYou are using the default backend IP (192.168.178.187:3000).',
      '\nIf this is not your machine IP, update it in: frontend/js/config.js',
      '\nTo find your IP, see the instructions in config.js'
    );
  }
});
