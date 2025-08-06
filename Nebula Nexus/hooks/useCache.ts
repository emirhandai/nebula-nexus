import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds (5 minutes)
  maxSize?: number; // Maximum number of items in cache
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove expired items first
    this.cleanup();

    // If cache is full, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  keys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }
}

// Global cache instance
const globalCache = new Cache();

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
} {
  const { ttl = 5 * 60 * 1000, maxSize } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize cache with custom maxSize if provided
  if (maxSize && globalCache.size() === 0) {
    // This is a bit hacky but works for our use case
    (globalCache as any).maxSize = maxSize;
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = globalCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }

      // Fetch fresh data
      const freshData = await fetcher();
      
      // Cache the data
      globalCache.set(key, freshData, ttl);
      
      setData(freshData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Cache fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  const refetch = useCallback(async () => {
    // Clear cache for this key and refetch
    globalCache.delete(key);
    await fetchData();
  }, [key, fetchData]);

  const clearCache = useCallback(() => {
    globalCache.delete(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

// Cache utilities
export const cacheUtils = {
  clearAll: () => globalCache.clear(),
  getSize: () => globalCache.size(),
  getKeys: () => globalCache.keys(),
  has: (key: string) => globalCache.has(key),
  delete: (key: string) => globalCache.delete(key),
  set: <T>(key: string, data: T, ttl?: number) => globalCache.set(key, data, ttl),
  get: <T>(key: string) => globalCache.get<T>(key)
};

// Cache keys for common data
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_STATS: (userId: string) => `user:stats:${userId}`,
  TEST_HISTORY: (userId: string) => `user:test-history:${userId}`,
  CHAT_HISTORY: (userId: string) => `user:chat-history:${userId}`,
  CAREER_RECOMMENDATIONS: (userId: string) => `user:career-recommendations:${userId}`,
  ADMIN_STATS: 'admin:stats',
  ADMIN_ACTIVITY: 'admin:recent-activity',
  ADMIN_METRICS: 'admin:system-metrics',
  SEARCH_RESULTS: (query: string, filters: string) => `search:${query}:${filters}`,
  OCEAN_QUESTIONS: 'ocean:questions',
  CAREER_ROADMAPS: 'career:roadmaps'
} as const; 