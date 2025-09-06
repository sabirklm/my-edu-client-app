import dataService from '../services/dataService';

// Data source configuration utility
export const DataSourceConfig = {
  // Switch to backend API
  useBackend() {
    dataService.enableBackend();
    console.log('✅ Now using backend API');
    console.log('🔗 Backend URL:', dataService.useBackend ? 'ENABLED' : 'DISABLED');
  },

  // Switch to localStorage
  useLocalStorage() {
    dataService.enableLocalStorage();
    console.log('✅ Now using localStorage');
  },

  // Switch to mock data (for development)
  useMockData() {
    dataService.enableMockData();
    console.log('✅ Now using mock data');
  },

  // Get current data source status
  getStatus() {
    const status = {
      useBackend: dataService.useBackend,
      useMockData: dataService.useMockData,
      enableOfflineFallback: dataService.enableOfflineFallback
    };
    
    console.log('📊 Current data source configuration:', status);
    return status;
  },

  // Test connectivity
  async testConnection() {
    try {
      const health = await dataService.healthCheck();
      console.log('🔍 Connection test result:', health);
      return health;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { status: 'error', error: error.message };
    }
  }
};

// Development helpers - expose to window in dev mode
if (process.env.NODE_ENV === 'development') {
  window.DataSourceConfig = DataSourceConfig;
  console.log('🔧 DataSourceConfig available in window.DataSourceConfig');
  console.log('💡 Try: DataSourceConfig.useMockData() or DataSourceConfig.useBackend()');
}

export default DataSourceConfig;