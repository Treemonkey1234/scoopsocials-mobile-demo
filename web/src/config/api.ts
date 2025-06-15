// API Configuration for ScoopSocials
// Switch between development and production backends

const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api',
    frontendURL: 'http://localhost:3000'
  },
  production: {
    baseURL: 'https://your-app.railway.app/api', // Replace with your Railway URL
    frontendURL: 'https://treemonkey1234.github.io/scoopsocials-mobile-demo/'
  }
};

const environment = process.env.NODE_ENV || 'development';
const config = API_CONFIG[environment as keyof typeof API_CONFIG];

export const API_BASE_URL = config.baseURL;
export const FRONTEND_URL = config.frontendURL;

// API Helper functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
};

export default config;