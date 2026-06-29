import api from './api';

export interface SessionData {
  uid: string;
  email: string;
}

export const sessionService = {
  async setSession(uid: string, email: string): Promise<void> {
    try {
      await api.post('/session/set', { uid, email }, { withCredentials: true });
    } catch (error) {
      console.error('[SESSION] Failed to set session:', error);
      throw error;
    }
  },

  async verifySession(): Promise<SessionData | null> {
    try {
      const response = await api.get('/session/verify', { withCredentials: true });
      if (response.data.valid) {
        return {
          uid: response.data.uid,
          email: response.data.email,
        };
      }
      return null;
    } catch (error) {
      console.error('[SESSION] Failed to verify session:', error);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      await api.post('/session/clear', {}, { withCredentials: true });
    } catch (error) {
      console.error('[SESSION] Failed to clear session:', error);
      throw error;
    }
  },
};
