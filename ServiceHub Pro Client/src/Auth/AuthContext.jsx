import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    getIdToken
} from 'firebase/auth';
import { auth } from '../Firebase/Firebase.config';
import { api } from '../utils/api';
// JWT utilities are used indirectly through the api module

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState(null);

    // Google Auth Provider
    const googleProvider = new GoogleAuthProvider();

    // Initialize auth state and JWT token on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for existing JWT token
                const existingToken = localStorage.getItem('servicehub_auth_token');
                if (existingToken) {
                    try {
                        // Verify JWT token with server
                        await api.auth.verify();
                        setJwtToken(existingToken);
                    } catch {
                        api.clearAuth();
                    }
                }
            } catch {
                // Auth initialization failed
            }
        };

        initializeAuth();

        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setUser(firebaseUser);
                } else {
                    setUser(null);
                    setJwtToken(null);
                    api.clearAuth();
                }
            } catch (error) {
                console.error('Auth state change error:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Register with email and password
    const register = async (email, password, displayName) => {
        try {
            setLoading(true);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update profile with display name
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }
            
            return result;
        } finally {
            setLoading(false);
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            setLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const googleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            return result;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            setLoading(true);
            
            // Logout from server (invalidate JWT)
            if (jwtToken) {
                try {
                    await api.auth.logout();
                } catch {
                    // Server logout failed
                }
            }
            
            // Firebase logout
            await signOut(auth);
            
            // Clear local state
            setUser(null);
            setJwtToken(null);
            api.clearAuth();
        } finally {
            setLoading(false);
        }
    };

    // Get current JWT token
    const getJWTToken = async () => {
        if (jwtToken) return jwtToken;
        
        // If no JWT token, get Firebase token
        try {
            if (user) {
                return await getIdToken(user);
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return null;
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user;
    };

    // Refresh JWT token if needed
    const refreshJWTToken = async () => {
        if (user) {
            try {
                const firebaseIdToken = await getIdToken(user, true); // Force refresh
                const response = await api.auth.firebaseLogin({
                    idToken: firebaseIdToken,
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                });
                
                setJwtToken(response.token);
                api.setAuthToken(response.token);
                return response.token;
            } catch {
                throw new Error('JWT refresh failed');
            }
        }
        return null;
    };

    // Update user profile
    const updateUserProfile = async (profileData) => {
        if (!user) {
            throw new Error('No user logged in');
        }

        try {
            setLoading(true);
            
            // Update Firebase profile
            await updateProfile(user, profileData);
            
            // Refresh the user state to reflect changes
            const updatedUser = auth.currentUser;
            setUser(updatedUser);
            
            return updatedUser;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        // Firebase Auth
        user,
        loading,
        register,
        login,
        googleSignIn,
        logout,
        updateProfile: updateUserProfile,
        
        // JWT Auth
        jwtToken,
        getJWTToken,
        isAuthenticated,
        refreshJWTToken,
        
        // Utility functions
        isLoggedIn: !!user,
        userEmail: user?.email,
        userName: user?.displayName,
        userPhoto: user?.photoURL
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
