
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { api } from '../services/api';

// Types for our authentication context
interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleAuthCallback: (code: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  handleAuthCallback: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          // Get token for backend authentication
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('auth_token', token);
          
          // Set user data from Firebase user object
          const userData: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            picture: firebaseUser.photoURL || '',
            accessToken: token
          };
          
          setUser(userData);
          
          // Update user data in the backend
          await api.auth.updateUserData(userData);
          
        } catch (error) {
          console.error("Failed to process auth state change:", error);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        // User is signed out
        localStorage.removeItem('auth_token');
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      
      // Add scopes for Google Drive if needed
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      
      // Sign in with popup
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Failed to sign in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    // This function is no longer needed with Firebase but kept for compatibility
    console.log("Auth callback received, but using Firebase auth directly");
    navigate('/');
    return Promise.resolve();
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('auth_token');
      toast.success("Successfully signed out");
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Failed to sign out: ${error.message}`);
      // Still remove token on client side even if Firebase signOut fails
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        logout,
        handleAuthCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
