import axios from 'axios';

// Reads the API address from our ".env.local" vault
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Creates a configured Axios instance with the base address
const api = axios.create({
  baseURL: apiUrl,
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - possibly redirect to login');
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authApi = {
  // Login a user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to login'
      };
    }
  },

  // Register a user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to register'
      };
    }
  }
};

// Export the instance to be used in other parts of the project
export default api;