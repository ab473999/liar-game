// API service for database operations
import API_BASE_URL from '@/config/api';

class DatabaseAPI {
  // Theme operations
  static async getThemes() {
    const response = await fetch(`${API_BASE_URL}/themes`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch themes');
    }
    
    return result.data;
  }

  static async createTheme(themeData) {
    // Transform to match new API structure
    const apiData = {
      type: themeData.type,
      name: themeData.nameEn || themeData.name
    };
    
    const response = await fetch(`${API_BASE_URL}/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create theme');
    }
    
    return result.data;
  }

  static async updateTheme(id, updateData) {
    // Transform to match new API structure
    const apiData = {
      name: updateData.nameEn || updateData.name
    };
    
    const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update theme');
    }
    
    return result.data;
  }

  // Word operations
  static async getWordsByTheme(theme) {
    const params = new URLSearchParams({
      theme
    });
    
    const response = await fetch(`${API_BASE_URL}/words?${params}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch words');
    }
    
    return result.data;
  }

  static async createWord(wordData) {
    // Transform to match new API structure
    const apiData = {
      themeId: wordData.themeId,
      word: wordData.wordEn || wordData.word
    };
    
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create word');
    }
    
    return result.data;
  }

  static async updateWord(id, updateData) {
    // Transform to match new API structure
    const apiData = {
      word: updateData.wordEn || updateData.word
    };
    
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update word');
    }
    
    return result.data;
  }

  static async deleteWord(id) {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete word');
    }
    
    return result;
  }
}

export default DatabaseAPI;
