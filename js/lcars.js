/**
 * LCARS Framework - JavaScript Enhancements
 * Optional JavaScript utilities for LCARS interfaces
 */

const LCARS = {
  /**
   * Initialize LCARS sound effects (optional)
   */
  init: function() {
    console.log('LCARS Framework initialized');
    this.attachButtonSounds();
  },

  /**
   * Attach click sound effects to LCARS buttons
   */
  attachButtonSounds: function() {
    const buttons = document.querySelectorAll('.lcars-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // Placeholder for sound effect
        // You can add actual sound files here
        console.log('LCARS button clicked');
      });
    });
  },

  /**
   * Toggle blinking animation on an element
   * @param {string} elementId - ID of the element
   */
  toggleBlink: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.toggle('blink');
    }
  },

  /**
   * Change panel color dynamically
   * @param {string} elementId - ID of the element
   * @param {string} color - LCARS color name
   */
  changeColor: function(elementId, color) {
    const element = document.getElementById(elementId);
    const colors = ['orange', 'red', 'purple', 'blue', 'yellow', 'tan', 'peach', 'sky'];
    
    if (element) {
      // Remove all color classes
      colors.forEach(c => element.classList.remove(c));
      // Add new color
      if (colors.includes(color)) {
        element.classList.add(color);
      }
    }
  },

  /**
   * Create a simple LCARS notification
   * @param {string} message - Notification message
   * @param {string} color - LCARS color (default: 'red')
   */
  notify: function(message, color = 'red') {
    const notification = document.createElement('div');
    notification.className = `lcars-panel ${color} blink-fast`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '20px';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  /**
   * Get current timestamp in LCARS format (Stardate)
   * Uses a base year of 2000 for simplified stardate calculation
   * @returns {string} Formatted stardate
   */
  getStardate: function() {
    const now = new Date();
    const baseYear = 2000; // Stardate epoch base year
    const year = now.getFullYear() - baseYear;
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const fraction = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
    
    return `${year}${dayOfYear.toString().padStart(3, '0')}.${fraction.toFixed(2).substring(2)}`;
  },

  /**
   * Update element with current stardate
   * @param {string} elementId - ID of element to update
   */
  updateStardate: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = `Stardate: ${this.getStardate()}`;
    }
  },

  /**
   * Start a stardate clock that updates every second
   * @param {string} elementId - ID of element to update
   * @returns {number} Interval ID that can be used to stop the clock with clearInterval()
   */
  startStardateClock: function(elementId) {
    this.updateStardate(elementId);
    const intervalId = setInterval(() => {
      this.updateStardate(elementId);
    }, 1000);
    return intervalId;
  }
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    LCARS.init();
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LCARS;
}
