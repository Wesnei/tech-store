import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(
  (config) => {
    console.log("🔧 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    const token = getAuthToken();
    console.log("🔑 Token status:", token ? `Found (${token.substring(0, 10)}...)` : "Not found");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Added Authorization header");
    } else {
      console.log("⚠️ No token to add to request");
      console.log("🔍 Checking localStorage directly...");
      try {
        const authStorage = localStorage.getItem('auth-storage');
        console.log("🔍 Direct localStorage check:", authStorage);
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          console.log("🔍 Direct authData:", authData);
        }
      } catch (e) {
        console.log("🔍 Error in direct check:", e);
      }
    }
    
    console.log("📋 Request headers:", config.headers);
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized access - token may be invalid or expired');
    }
    
    return Promise.reject(error);
  }
);

export const productApi = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    name?: string;
    description?: string;
    price?: number;
  }) => {
    try {
      const response = await api.get('/products', { params });
      return {
        success: true,
        data: response.data,
        message: 'Products retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to retrieve products'
      };
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = {
        ...response.data,
        image: response.data.imageUrl || response.data.image || "/placeholder.svg"
      };
      return {
        success: true,
        data: product,
        message: 'Product retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to retrieve product'
      };
    }
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    image?: File | string;
  }) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      
      if (productData.image instanceof File) {
        formData.append('image', productData.image);
      } else if (typeof productData.image === 'string') {
        formData.append('image', productData.image);
      }

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const product = {
        ...response.data,
        image: response.data.imageUrl || response.data.image || "/placeholder.svg"
      };
      
      return {
        success: true,
        data: product,
        message: 'Product created successfully'
      };
    } catch (error: any) {
      console.error("❌ Create product error:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create product'
      };
    }
  },

  updateProduct: async (id: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    image?: File | string;
  }) => {
    try {
      const formData = new FormData();
      
      if (productData.name !== undefined) {
        formData.append('name', productData.name);
      }
      
      if (productData.description !== undefined) {
        formData.append('description', productData.description);
      }
      
      if (productData.price !== undefined) {
        formData.append('price', productData.price.toString());
      }
      
      if (productData.image !== undefined) {
        if (productData.image instanceof File) {
          formData.append('image', productData.image);
        } else if (typeof productData.image === 'string') {
          formData.append('image', productData.image);
        }
      }

      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const product = {
        ...response.data,
        image: response.data.imageUrl || response.data.image || "/placeholder.svg"
      };
      
      return {
        success: true,
        data: product,
        message: 'Product updated successfully'
      };
    } catch (error: any) {
      console.error("❌ Update product error:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update product'
      };
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Product deleted successfully'
      };
    } catch (error: any) {
      console.error("❌ Delete product error:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete product'
      };
    }
  }
};

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error: any) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to login'
      };
    }
  },

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
      console.error("❌ Registration error:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to register'
      };
    }
  }
};

export default api;