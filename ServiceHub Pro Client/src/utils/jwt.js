// JWT Utility functions for token management

// Decode JWT token (without verification)
export const decodeJWT = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if token expires in the next 5 minutes (300 seconds)
  const now = Math.floor(Date.now() / 1000);
  const buffer = 300; // 5 minutes buffer
  
  return decoded.exp < (now + buffer);
};

// Get token expiration date
export const getTokenExpiration = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

// Check if token is valid (not expired and properly formatted)
export const isValidToken = (token) => {
  if (!token) return false;
  
  // Check format (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if not expired
  return !isTokenExpired(token);
};

// Extract user info from JWT token
export const getUserInfoFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    uid: decoded.uid,
    email: decoded.email,
    displayName: decoded.displayName,
    photoURL: decoded.photoURL,
    emailVerified: decoded.emailVerified,
    exp: decoded.exp,
    iat: decoded.iat
  };
};

// Format time until token expiration
export const getTimeUntilExpiration = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = decoded.exp - now;
  
  if (timeLeft <= 0) return 'Expired';
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// JWT Storage keys
export const JWT_STORAGE_KEY = 'jwt_token';
export const JWT_REFRESH_KEY = 'jwt_refresh_token';

// Token storage functions
export const storeToken = (token, refreshToken = null) => {
  if (token) {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  }
  if (refreshToken) {
    localStorage.setItem(JWT_REFRESH_KEY, refreshToken);
  }
};

export const getStoredToken = () => {
  return localStorage.getItem(JWT_STORAGE_KEY);
};

export const getStoredRefreshToken = () => {
  return localStorage.getItem(JWT_REFRESH_KEY);
};

export const clearStoredTokens = () => {
  localStorage.removeItem(JWT_STORAGE_KEY);
  localStorage.removeItem(JWT_REFRESH_KEY);
};

// Check if user has any valid authentication
export const hasValidAuthentication = () => {
  const token = getStoredToken();
  return isValidToken(token);
};

export default {
  decodeJWT,
  isTokenExpired,
  getTokenExpiration,
  isValidToken,
  getUserInfoFromToken,
  getTimeUntilExpiration,
  storeToken,
  getStoredToken,
  getStoredRefreshToken,
  clearStoredTokens,
  hasValidAuthentication
};
