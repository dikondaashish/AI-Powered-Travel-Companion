/**
 * API Monitoring Service
 * Tracks API usage to avoid exceeding quotas and provide insights
 */

export class APIMonitor {
  constructor() {
    this.requestCounts = {
      placeDetails: 0,
      placePhotos: 0,
      total: 0
    };
    this.dailyLimits = {
      placeDetails: 100000, // Your actual limits
      placePhotos: 100000    // Your actual limits
    };
    this.lastReset = Date.now();
    
    // Try to load previous counts from localStorage
    this.loadFromStorage();
    
    // Set up daily reset
    setInterval(() => this.checkDailyReset(), 1000 * 60 * 60); // Check every hour
  }
  
  loadFromStorage() {
    try {
      const savedData = localStorage.getItem('api_monitor_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.requestCounts = data.requestCounts;
        this.lastReset = data.lastReset;
      }
    } catch (error) {
      console.error('Error loading API monitor data:', error);
    }
  }
  
  saveToStorage() {
    try {
      const data = {
        requestCounts: this.requestCounts,
        lastReset: this.lastReset
      };
      localStorage.setItem('api_monitor_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving API monitor data:', error);
    }
  }
  
  checkDailyReset() {
    const now = Date.now();
    // Reset if more than 24 hours have passed
    if (now - this.lastReset > 24 * 60 * 60 * 1000) {
      this.resetCounters();
    }
  }
  
  trackRequest(type) {
    // Check if we need to reset counters (daily)
    this.checkDailyReset();
    
    this.requestCounts[type]++;
    this.requestCounts.total++;
    
    // Log when approaching limits
    if (this.requestCounts[type] > this.dailyLimits[type] * 0.8) {
      console.warn(`Warning: ${type} API usage at ${this.requestCounts[type]} (${Math.round(this.requestCounts[type] / this.dailyLimits[type] * 100)}% of daily limit)`);
    }
    
    // Save to localStorage
    this.saveToStorage();
    
    // Return current usage
    return {
      count: this.requestCounts[type],
      limit: this.dailyLimits[type],
      percentage: Math.round(this.requestCounts[type] / this.dailyLimits[type] * 100)
    };
  }
  
  resetCounters() {
    this.requestCounts = {
      placeDetails: 0,
      placePhotos: 0,
      total: 0
    };
    this.lastReset = Date.now();
    this.saveToStorage();
  }
  
  getUsageStats() {
    return {
      placeDetails: {
        count: this.requestCounts.placeDetails,
        limit: this.dailyLimits.placeDetails,
        percentage: Math.round(this.requestCounts.placeDetails / this.dailyLimits.placeDetails * 100)
      },
      placePhotos: {
        count: this.requestCounts.placePhotos,
        limit: this.dailyLimits.placePhotos,
        percentage: Math.round(this.requestCounts.placePhotos / this.dailyLimits.placePhotos * 100)
      },
      total: this.requestCounts.total,
      lastReset: new Date(this.lastReset).toLocaleString()
    };
  }
}

// Create a singleton instance
export const apiMonitor = new APIMonitor(); 