import apiService from './apiService';
import storageService from './storageService';
import { mockData } from '../data/mockData';

// Configuration to switch between data sources
const DATA_CONFIG = {
  USE_BACKEND: false, // Set to true when backend is ready
  USE_MOCK_DATA: true, // Set to true for development with mock data
  ENABLE_OFFLINE_FALLBACK: true,
};

class DataService {
  constructor() {
    this.useBackend = DATA_CONFIG.USE_BACKEND;
    this.useMockData = DATA_CONFIG.USE_MOCK_DATA;
    this.enableOfflineFallback = DATA_CONFIG.ENABLE_OFFLINE_FALLBACK;
  }

  // Switch data source methods
  enableBackend() {
    this.useBackend = true;
    this.useMockData = false;
    console.log('✅ Switched to backend mode');
  }

  enableLocalStorage() {
    this.useBackend = false;
    this.useMockData = false;
    console.log('✅ Switched to localStorage mode');
  }

  enableMockData() {
    this.useBackend = false;
    this.useMockData = true;
    console.log('✅ Switched to mock data mode');
  }

  // Generic error handler with offline fallback
  async handleRequest(backendCall, localStorageCall, mockDataCall) {
    try {
      if (this.useMockData && mockDataCall) {
        console.log('📊 Using mock data');
        return await mockDataCall();
      }

      if (this.useBackend && backendCall) {
        console.log('🌐 Using backend API');
        return await backendCall();
      }

      if (localStorageCall) {
        console.log('💾 Using localStorage');
        return await localStorageCall();
      }

      throw new Error('No data source available');
    } catch (error) {
      console.error('Data service error:', error);

      // Offline fallback - try localStorage if backend fails
      if (this.enableOfflineFallback && this.useBackend && localStorageCall) {
        console.log('🔄 Falling back to localStorage');
        try {
          return await localStorageCall();
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }

      throw error;
    }
  }

  // Exam data methods
  async getExamById(examId) {
    return this.handleRequest(
      () => apiService.getExamById(examId),
      null, // No localStorage equivalent for fetching exam structure
      () => Promise.resolve(mockData.examData)
    );
  }

  async getExamsList() {
    return this.handleRequest(
      () => apiService.getExamsList(),
      null, // Could implement localStorage caching later
      () => Promise.resolve([mockData.examData])
    );
  }

  // Exam progress methods
  async saveExamProgress(examId, progressData) {
    return this.handleRequest(
      () => apiService.saveExamProgress(examId, progressData),
      () => Promise.resolve(storageService.saveExamProgress(examId, progressData)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  async getExamProgress(examId) {
    return this.handleRequest(
      () => apiService.getExamProgress(examId),
      () => Promise.resolve(storageService.loadExamProgress(examId)),
      () => Promise.resolve(mockData.userProgress)
    );
  }

  async deleteExamProgress(examId) {
    return this.handleRequest(
      () => apiService.deleteExamProgress(examId),
      () => Promise.resolve(storageService.clearExamProgress(examId)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  // Exam attempts methods
  async saveExamAttempt(attemptData) {
    return this.handleRequest(
      () => apiService.saveExamAttempt(attemptData),
      () => Promise.resolve(storageService.saveAttempt(attemptData)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  async getExamAttempts(examId = null) {
    return this.handleRequest(
      () => apiService.getExamAttempts(examId),
      () => {
        const attempts = storageService.getAttemptHistory();
        return Promise.resolve(examId ? attempts.filter(a => a.examId === examId) : attempts);
      },
      () => Promise.resolve(mockData.attemptHistory)
    );
  }

  // User analytics methods
  async getUserAnalytics() {
    return this.handleRequest(
      () => apiService.getUserAnalytics(),
      () => Promise.resolve(storageService.getPerformanceStats()),
      () => Promise.resolve(mockData.analytics)
    );
  }

  // Bookmarks methods
  async addBookmark(questionId, examId, questionData, notes = '') {
    const bookmarkData = { questionId, examId, questionData, notes };
    
    return this.handleRequest(
      () => apiService.addBookmark(bookmarkData),
      () => Promise.resolve(storageService.addBookmark(questionId, examId, questionData, notes)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  async removeBookmark(questionId, examId) {
    // For backend, we might need to find bookmark ID first
    const bookmarkId = `${examId}_${questionId}`;
    
    return this.handleRequest(
      () => apiService.removeBookmark(bookmarkId),
      () => Promise.resolve(storageService.removeBookmark(questionId, examId)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  async getBookmarks() {
    return this.handleRequest(
      () => apiService.getBookmarks(),
      () => Promise.resolve(storageService.getBookmarks()),
      () => Promise.resolve([]) // Mock returns empty bookmarks
    );
  }

  async isBookmarked(questionId, examId) {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmarkId = `${examId}_${questionId}`;
      return Array.isArray(bookmarks) ? bookmarks.some(b => b.id === bookmarkId) : false;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }

  // User settings methods
  async updateUserSettings(settings) {
    return this.handleRequest(
      () => apiService.updateUserSettings(settings),
      () => Promise.resolve(storageService.saveUserSettings(settings)),
      () => Promise.resolve(true) // Mock always succeeds
    );
  }

  async getUserSettings() {
    return this.handleRequest(
      () => apiService.getUserSettings(),
      () => Promise.resolve(storageService.getUserSettings()),
      () => Promise.resolve(storageService.getUserSettings()) // Use localStorage defaults
    );
  }

  // Utility methods
  async exportUserData() {
    if (this.useBackend) {
      // For backend, we'd need to fetch all user data
      const [attempts, bookmarks, settings, analytics] = await Promise.all([
        this.getExamAttempts(),
        this.getBookmarks(),
        this.getUserSettings(),
        this.getUserAnalytics(),
      ]);
      
      return JSON.stringify({
        attempts,
        bookmarks,
        settings,
        analytics,
        exportedAt: new Date().toISOString()
      }, null, 2);
    } else {
      return storageService.exportData();
    }
  }

  async importUserData(jsonData) {
    if (this.useBackend) {
      // For backend, we'd need to send data to appropriate endpoints
      const data = JSON.parse(jsonData);
      
      // This would require multiple API calls
      console.warn('Backend import not implemented yet');
      return false;
    } else {
      return storageService.importData(jsonData);
    }
  }

  async clearAllUserData() {
    if (this.useBackend) {
      // For backend, we'd need to call delete endpoints
      console.warn('Backend clear all not implemented yet');
      return false;
    } else {
      return storageService.clearAllData();
    }
  }

  // Health check method
  async healthCheck() {
    try {
      if (this.useBackend) {
        // Try a simple API call
        await apiService.get('/health');
        return { status: 'online', source: 'backend' };
      } else if (this.useMockData) {
        return { status: 'online', source: 'mock' };
      } else {
        // Test localStorage
        const testKey = 'health_check_test';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return { status: 'online', source: 'localStorage' };
      }
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }
}

// Create and export singleton instance
const dataService = new DataService();

// Development helpers - remove in production
if (process.env.NODE_ENV === 'development') {
  window.dataService = dataService; // For debugging
  console.log('🔧 DataService available in window.dataService for debugging');
}

export default dataService;