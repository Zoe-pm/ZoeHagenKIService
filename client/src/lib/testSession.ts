/**
 * Test Session Manager
 * Handles test session lifecycle - persist across navigation, close only on page/tab close
 */

const TEST_SESSION_KEY = 'testSessionToken';

class TestSessionManager {
  private token: string | null = null;
  private initialized = false;

  /**
   * Initialize the test session manager
   * Should be called once when the app starts
   */
  init() {
    if (this.initialized) return;
    
    // Get token from sessionStorage (persists across navigation, clears on tab close)
    this.token = sessionStorage.getItem(TEST_SESSION_KEY);
    
    // Register beforeunload handler to close session when page/tab closes
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    
    this.initialized = true;
    console.log('Test session manager initialized, token:', this.token ? 'PRESENT' : 'NONE');
  }

  /**
   * Set active test session token
   */
  setToken(token: string) {
    this.token = token;
    sessionStorage.setItem(TEST_SESSION_KEY, token);
    console.log('Test session token set');
  }

  /**
   * Get current test session token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear test session token
   */
  clearToken() {
    this.token = null;
    sessionStorage.removeItem(TEST_SESSION_KEY);
    console.log('Test session token cleared');
  }

  /**
   * Handle page/tab close - send beacon to close session
   */
  private handleBeforeUnload = () => {
    if (this.token) {
      // Use sendBeacon for reliable request during page unload
      try {
        navigator.sendBeacon('/api/test-session/close', JSON.stringify({ token: this.token }));
        console.log('Test session close beacon sent');
      } catch (error) {
        console.warn('Failed to send test session close beacon:', error);
      }
    }
  }

  /**
   * Manually close test session (e.g., logout)
   */
  async closeSession() {
    if (!this.token) return;

    try {
      await fetch('/api/test-session/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: this.token })
      });
      console.log('Test session manually closed');
    } catch (error) {
      console.warn('Failed to close test session:', error);
    } finally {
      this.clearToken();
    }
  }

  /**
   * Cleanup - remove event listeners
   */
  destroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.initialized = false;
  }
}

// Export singleton instance
export const testSessionManager = new TestSessionManager();