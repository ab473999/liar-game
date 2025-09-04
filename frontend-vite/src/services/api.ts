import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiResponse, Theme, Word } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { IS_AUTH_ENABLED } from '@/config/authConfig';
import { logger } from '@/utils/logger';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth header for write operations
    this.client.interceptors.request.use(
      (config) => {
        // Only add auth header if authentication is enabled
        if (IS_AUTH_ENABLED) {
          // Add auth header for write operations (POST, PUT, DELETE)
          if (config.method && ['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
            const authStore = useAuthStore.getState();
            const password = authStore.getPassword();
            
            if (password) {
              config.headers['Authorization'] = `Bearer ${password}`;
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        logger.error('API Error:', error);
        
        // Only handle auth errors if authentication is enabled
        if (IS_AUTH_ENABLED) {
          // Handle 401 Unauthorized - clear auth and return special error
          if (error.response?.status === 401) {
            const authStore = useAuthStore.getState();
            authStore.clearPassword();
            return Promise.reject(new Error('Authentication required'));
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error
      // Only treat 401/403 as auth errors if auth is enabled
      if (IS_AUTH_ENABLED) {
        if (error.response.status === 401) {
          return 'Authentication required';
        }
        if (error.response.status === 403) {
          return 'Invalid password';
        }
      }
      return `Server error: ${error.response.status}`;
    } else if (error.request) {
      // No response received
      return 'No response from server';
    } else {
      // Request setup error
      return error.message || 'Request failed';
    }
  }

  // Theme endpoints
  async getThemes(): Promise<Theme[]> {
    try {
      const response = await this.client.get<ApiResponse<Theme[]>>('/themes');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch themes');
    } catch (error) {
      logger.error('Error fetching themes:', error);
      throw error;
    }
  }

  async createTheme(theme: { name: string; type: string }): Promise<Theme> {
    try {
      const response = await this.client.post<ApiResponse<Theme>>('/themes', theme);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create theme');
    } catch (error: any) {
      logger.error('Error creating theme:', error);
      // Check for 409 Conflict (duplicate theme)
      if (error.response?.status === 409) {
        throw new Error('Theme already exists');
      }
      // Re-throw the error with proper message
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  // Word endpoints
  async getWordsByTheme(theme: string): Promise<Word[]> {
    try {
      const response = await this.client.get<ApiResponse<Word[]>>('/words', {
        params: { theme }
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch words');
    } catch (error) {
      logger.error('Error fetching words:', error);
      throw error;
    }
  }

  async createWord(wordData: { word: string; themeId: number }): Promise<Word> {
    try {
      const response = await this.client.post<ApiResponse<Word>>('/words', wordData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create word');
    } catch (error) {
      logger.error('Error creating word:', error);
      throw error;
    }
  }

  async updateWord(id: number, updateData: { word: string }): Promise<Word> {
    try {
      const response = await this.client.put<ApiResponse<Word>>(`/words/${id}`, updateData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to update word');
    } catch (error) {
      logger.error('Error updating word:', error);
      throw error;
    }
  }

  async deleteWord(id: number): Promise<boolean> {
    try {
      const response = await this.client.delete<ApiResponse<void>>(`/words/${id}`);
      return response.data.success;
    } catch (error) {
      logger.error('Error deleting word:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
