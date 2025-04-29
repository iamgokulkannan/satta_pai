import { trackApiResponseTime } from './performance';

// Cache configuration
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of items in cache

// In-memory cache implementation
class Cache {
  constructor(maxSize = MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  // Get item from cache
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return null;
    }
    
    // Check if item is expired
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return item.value;
  }

  // Set item in cache
  set(key, value, ttl = DEFAULT_CACHE_TIME) {
    // If cache is full, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  // Remove item from cache
  remove(key) {
    return this.cache.delete(key);
  }

  // Clear entire cache
  clear() {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate.toFixed(2)}%`
    };
  }
}

// Create cache instances
const apiCache = new Cache();
const dataCache = new Cache();
const imageCache = new Cache(50); // Smaller cache for images

// Cache API responses
export const cacheApiResponse = async (key, apiCall, ttl = DEFAULT_CACHE_TIME) => {
  // Check cache first
  const cachedData = apiCache.get(key);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache, make API call
  const startTime = performance.now();
  const data = await apiCall();
  const endTime = performance.now();
  
  // Track API response time
  trackApiResponseTime(key, endTime - startTime);
  
  // Store in cache
  apiCache.set(key, data, ttl);
  
  return data;
};

// Cache data with custom key generator
export const cacheData = (keyGenerator, data, ttl = DEFAULT_CACHE_TIME) => {
  const key = typeof keyGenerator === 'function' ? keyGenerator(data) : keyGenerator;
  dataCache.set(key, data, ttl);
};

// Get cached data
export const getCachedData = (key) => {
  return dataCache.get(key);
};

// Cache image
export const cacheImage = (url, imageData) => {
  imageCache.set(url, imageData);
};

// Get cached image
export const getCachedImage = (url) => {
  return imageCache.get(url);
};

// Clear specific cache
export const clearCache = (cacheType = 'all') => {
  switch (cacheType) {
    case 'api':
      apiCache.clear();
      break;
    case 'data':
      dataCache.clear();
      break;
    case 'image':
      imageCache.clear();
      break;
    case 'all':
    default:
      apiCache.clear();
      dataCache.clear();
      imageCache.clear();
      break;
  }
};

// Get cache statistics
export const getCacheStats = () => {
  return {
    api: apiCache.getStats(),
    data: dataCache.getStats(),
    image: imageCache.getStats()
  };
};

// Cache with localStorage for persistence
export const persistentCache = {
  get: (key) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;
      
      const { value, expiry } = JSON.parse(item);
      
      if (expiry < Date.now()) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return value;
    } catch (error) {
      console.error('Error reading from persistent cache:', error);
      return null;
    }
  },
  
  set: (key, value, ttl = DEFAULT_CACHE_TIME) => {
    try {
      const item = {
        value,
        expiry: Date.now() + ttl
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error writing to persistent cache:', error);
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(`cache_${key}`);
  },
  
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
}; 