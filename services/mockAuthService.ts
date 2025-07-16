// Mock Authentication Service - bypasses Firebase for development
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  photoURL?: string;
}

export interface MockUserCredential {
  user: MockUser;
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private authStateListeners: ((user: MockUser | null) => void)[] = [];

  // Mock sign in with email and password
  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<MockUserCredential> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user exists in localStorage
    const storedUsers = this.getStoredUsers();
    const user = storedUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("auth/user-not-found");
    }

    const mockUser: MockUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: true,
      photoURL: user.photoURL,
    };

    this.currentUser = mockUser;
    this.notifyAuthStateListeners(mockUser);

    return { user: mockUser };
  }

  // Mock create user with email and password
  async createUserWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<MockUserCredential> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const storedUsers = this.getStoredUsers();
    if (storedUsers.find((u) => u.email === email)) {
      throw new Error("auth/email-already-in-use");
    }

    const uid = `mock-user-${Date.now()}`;
    const displayName = email.split("@")[0];

    const newUser = {
      uid,
      email,
      password, // In real app, this would be hashed
      displayName,
      photoURL: undefined,
    };

    // Store user
    storedUsers.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(storedUsers));

    const mockUser: MockUser = {
      uid,
      email,
      displayName,
      emailVerified: true,
      photoURL: undefined,
    };

    this.currentUser = mockUser;
    this.notifyAuthStateListeners(mockUser);

    return { user: mockUser };
  }

  // Mock update profile
  async updateProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    if (!this.currentUser) {
      throw new Error("auth/no-current-user");
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (updates.displayName !== undefined) {
      this.currentUser.displayName = updates.displayName;
    }
    if (updates.photoURL !== undefined) {
      this.currentUser.photoURL = updates.photoURL;
    }

    // Update stored user data
    const storedUsers = this.getStoredUsers();
    const userIndex = storedUsers.findIndex(
      (u) => u.uid === this.currentUser!.uid,
    );
    if (userIndex > -1) {
      if (updates.displayName !== undefined) {
        storedUsers[userIndex].displayName = updates.displayName;
      }
      if (updates.photoURL !== undefined) {
        storedUsers[userIndex].photoURL = updates.photoURL;
      }
      localStorage.setItem("mockUsers", JSON.stringify(storedUsers));
    }

    this.notifyAuthStateListeners(this.currentUser);
  }

  // Mock sign out
  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.currentUser = null;
    this.notifyAuthStateListeners(null);
  }

  // Mock auth state observer
  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.authStateListeners.push(callback);

    // Immediately call with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Get current user
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  // Initialize with any existing session
  initialize(): void {
    // Initialize with demo users if none exist
    const storedUsers = this.getStoredUsers();
    if (storedUsers.length === 0) {
      const demoUsers = [
        {
          uid: "admin-user-123",
          email: "walkerchristopherr549@gmail.com",
          password: "admin@giit",
          displayName: "Chris R Walker",
          photoURL: undefined,
        },
        {
          uid: "regular-user-456",
          email: "user@example.com",
          password: "user123",
          displayName: "Demo User",
          photoURL: undefined,
        },
        {
          uid: "instructor-user-789",
          email: "instructor@example.com",
          password: "instructor123",
          displayName: "Instructor User",
          photoURL: undefined,
        },
      ];
      localStorage.setItem("mockUsers", JSON.stringify(demoUsers));
    }

    // Check if there's a stored session
    const sessionUser = localStorage.getItem("mockAuthSession");
    if (sessionUser) {
      try {
        this.currentUser = JSON.parse(sessionUser);
      } catch (e) {
        localStorage.removeItem("mockAuthSession");
      }
    }
  }

  private getStoredUsers(): any[] {
    const stored = localStorage.getItem("mockUsers");
    return stored ? JSON.parse(stored) : [];
  }

  private notifyAuthStateListeners(user: MockUser | null): void {
    // Store session
    if (user) {
      localStorage.setItem("mockAuthSession", JSON.stringify(user));
    } else {
      localStorage.removeItem("mockAuthSession");
    }

    // Notify all listeners
    this.authStateListeners.forEach((callback) => callback(user));
  }
}

// Create singleton instance
export const mockAuth = new MockAuthService();

// Initialize on import
mockAuth.initialize();

// Export mock auth functions with same interface as Firebase
export const signInWithEmailAndPassword = (email: string, password: string) =>
  mockAuth.signInWithEmailAndPassword(email, password);

export const createUserWithEmailAndPassword = (
  email: string,
  password: string,
) => mockAuth.createUserWithEmailAndPassword(email, password);

export const updateProfile = (
  user: MockUser,
  updates: { displayName?: string; photoURL?: string },
) => mockAuth.updateProfile(updates);

export const onAuthStateChanged = (callback: (user: MockUser | null) => void) =>
  mockAuth.onAuthStateChanged(callback);

export const signOut = () => mockAuth.signOut();

export { mockAuth as auth };
