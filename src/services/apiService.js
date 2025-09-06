// API configuration
const API_CONFIG = {
  BASE_URL: 'https://educational-app-backend-poc.onrender.com/api',
  LOCAL_URL: 'http://localhost:4000/api',
  USE_LOCAL: false, // Toggle for development
  TIMEOUT: 10000,
};

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.USE_LOCAL ? API_CONFIG.LOCAL_URL : API_CONFIG.BASE_URL;
  }

  // Generic HTTP methods
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: API_CONFIG.TIMEOUT,
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Exam-specific API methods
  async getExamById(examId) {
    return this.get(`/question-groups/${examId}`);
  }

  async getExamsList() {
    return this.get('/question-groups');
  }

  // User progress API methods (for future backend integration)
  async saveExamProgress(examId, progressData) {
    return this.post(`/exams/${examId}/progress`, progressData);
  }

  async getExamProgress(examId) {
    return this.get(`/exams/${examId}/progress`);
  }

  async deleteExamProgress(examId) {
    return this.delete(`/exams/${examId}/progress`);
  }

  // Exam attempts API methods
  async saveExamAttempt(attemptData) {
    return this.post('/exams/attempts', attemptData);
  }

  async getExamAttempts(examId = null) {
    const endpoint = examId ? `/exams/${examId}/attempts` : '/exams/attempts';
    return this.get(endpoint);
  }

  async getUserAnalytics() {
    return this.get('/users/analytics');
  }

  // Bookmarks API methods
  async addBookmark(bookmarkData) {
    return this.post('/bookmarks', bookmarkData);
  }

  async removeBookmark(bookmarkId) {
    return this.delete(`/bookmarks/${bookmarkId}`);
  }

  async getBookmarks() {
    return this.get('/bookmarks');
  }

  // User settings API methods
  async updateUserSettings(settings) {
    return this.put('/users/settings', settings);
  }

  async getUserSettings() {
    return this.get('/users/settings');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;