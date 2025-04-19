import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import DOMPurify from 'dompurify';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window

// Rate limiting implementation
export const checkRateLimit = async (userId) => {
  const db = getFirestore();
  const rateLimitRef = doc(db, 'rateLimits', userId);
  
  try {
    const rateLimitDoc = await getDoc(rateLimitRef);
    const now = Date.now();
    
    if (!rateLimitDoc.exists()) {
      // First request
      await setDoc(rateLimitRef, {
        requests: [now],
        windowStart: now
      });
      return true;
    }
    
    const data = rateLimitDoc.data();
    const windowStart = data.windowStart;
    
    // Check if we're in a new window
    if (now - windowStart > RATE_LIMIT_WINDOW) {
      await setDoc(rateLimitRef, {
        requests: [now],
        windowStart: now
      });
      return true;
    }
    
    // Check if we've exceeded the limit
    if (data.requests.length >= MAX_REQUESTS) {
      return false;
    }
    
    // Add new request
    await setDoc(rateLimitRef, {
      requests: [...data.requests, now],
      windowStart
    });
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  return input;
};

// CSRF token generation and validation
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateCSRFToken = (token, storedToken) => {
  return token === storedToken;
};

// Session timeout configuration
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Password strength validation
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  if (password.length < minLength) errors.push('Password must be at least 8 characters long');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 