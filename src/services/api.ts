const API_URL = 'https://draft-keeper-backend.onrender.com/api';

export const api = {
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    async getGoogleAuthUrl() {
      console.log("Using Firebase authentication directly");
      return { url: "#" };
    },

    async exchangeCodeForToken(code: string) {
      console.log("Using Firebase authentication directly");
      return { user: null, token: "" };
    },

    async logout() {
      try {
        return api.fetchWithAuth('/auth/logout', {
          method: 'POST'
        });
      } catch (error) {
        console.error('Failed to logout on server:', error);
        throw error;
      }
    },

    async getCurrentUser() {
      try {
        return api.fetchWithAuth('/auth/user');
      } catch (error) {
        console.error('Failed to get current user:', error);
        throw error;
      }
    },

    async updateUserData(userData: any) {
      try {
        return api.fetchWithAuth('/auth/update-user', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
      } catch (error) {
        console.error('Failed to update user data:', error);
        return null;
      }
    }
  },

  // Draft endpoints
  drafts: {
    async getAllDrafts() {
      return api.fetchWithAuth('/drafts');
    },
    async getDraft(id: string) {
      return api.fetchWithAuth(`/drafts/${id}`);
    },
    async createDraft(draft: any) {
      return api.fetchWithAuth('/drafts', {
        method: 'POST',
        body: JSON.stringify(draft)
      });
    },
    async updateDraft(id: string, data: any) {
      return api.fetchWithAuth(`/drafts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    async deleteDraft(id: string) {
      return api.fetchWithAuth(`/drafts/${id}`, {
        method: 'DELETE'
      });
    },
    async saveToDrive(id: string) {
      return api.fetchWithAuth(`/drafts/${id}/save-to-drive`, {
        method: 'POST'
      });
    },
    async getDraftsFromDrive() {
      return api.fetchWithAuth(`/drafts/google-drive`);
    },
    async openDraftInDrive(webViewLink: string) {
      window.open(webViewLink, '_blank');
      return true;
    }
  }
};
