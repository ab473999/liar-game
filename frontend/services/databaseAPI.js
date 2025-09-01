// API service for database operations
const API_BASE_URL = 'http://localhost:3001/api';

class DatabaseAPI {
  // Theme operations
  static async getThemes(easterEgg = null) {
    const params = new URLSearchParams();
    if (easterEgg !== null) {
      params.append('easterEgg', easterEgg);
    }
    
    const response = await fetch(`${API_BASE_URL}/themes?${params}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch themes');
    }
    
    return result.data;
  }

  static async createTheme(themeData) {
    const response = await fetch(`${API_BASE_URL}/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(themeData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create theme');
    }
    
    return result.data;
  }

  static async updateTheme(id, updateData) {
    const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update theme');
    }
    
    return result.data;
  }

  // Word operations
  static async getWordsByTheme(theme, lang = 'en') {
    const params = new URLSearchParams({
      theme,
      lang,
    });
    
    const response = await fetch(`${API_BASE_URL}/words?${params}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch words');
    }
    
    return result.data;
  }

  static async createWord(wordData) {
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create word');
    }
    
    return result.data;
  }

  static async updateWord(id, updateData) {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
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
