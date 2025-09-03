import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiResponse, Theme, Word } from '@/types';

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

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error
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
      console.error('Error fetching themes:', error);
      throw error;
    }
  }

  async createTheme(theme: { nameEn: string; type: string }): Promise<Theme> {
    try {
      const response = await this.client.post<ApiResponse<Theme>>('/themes', theme);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create theme');
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  }

  // Word endpoints
  async getWordsByTheme(theme: string): Promise<Word[]> {
    try {
      const response = await this.client.get<ApiResponse<Word[]>>('/words', {
        params: { theme, lang: 'en' }
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch words');
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  }

  async createWord(wordData: { word: string; theme: string }): Promise<Word> {
    try {
      const response = await this.client.post<ApiResponse<Word>>('/words', wordData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create word');
    } catch (error) {
      console.error('Error creating word:', error);
      throw error;
    }
  }

  async updateWord(id: number, word: string): Promise<Word> {
    try {
      const response = await this.client.put<ApiResponse<Word>>(`/words/${id}`, { word });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to update word');
    } catch (error) {
      console.error('Error updating word:', error);
      throw error;
    }
  }

  async deleteWord(id: number): Promise<boolean> {
    try {
      const response = await this.client.delete<ApiResponse<void>>(`/words/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
