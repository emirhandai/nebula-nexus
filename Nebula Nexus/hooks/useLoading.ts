import { useState, useEffect, useCallback, useRef } from 'react';

interface LoadingState {
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

interface LoadingOptions {
  delay?: number; // Minimum loading time in milliseconds
  retryCount?: number; // Maximum number of retries
  retryDelay?: number; // Delay between retries in milliseconds
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export function useLoading<T>(
  asyncFunction: () => Promise<T>,
  options: LoadingOptions = {}
): [LoadingState, T | null] {
  const {
    delay = 500,
    retryCount = 3,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStartTime(Date.now());

      const result = await asyncFunction();
      
      // Ensure minimum loading time
      const elapsed = Date.now() - startTime!;
      if (elapsed < delay) {
        await new Promise(resolve => setTimeout(resolve, delay - elapsed));
      }

      setData(result);
      setRetryAttempts(0);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      console.error('Loading error:', error);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, delay, startTime, onSuccess, onError]);

  const retry = useCallback(() => {
    if (retryAttempts < retryCount) {
      setRetryAttempts(prev => prev + 1);
      setTimeout(() => {
        execute();
      }, retryDelay);
    }
  }, [retryAttempts, retryCount, retryDelay, execute]);

  useEffect(() => {
    execute();
  }, [execute]);

  return [
    { loading, error, retry },
    data
  ];
}

// Loading state manager for multiple operations
export function useLoadingManager() {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const addLoading = useCallback((key: string, asyncFunction: () => Promise<any>, options: LoadingOptions = {}) => {
    const [state, data] = useLoading(asyncFunction, options);
    
    setLoadingStates(prev => ({
      ...prev,
      [key]: state
    }));

    return { state, data };
  }, []);

  const removeLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key]?.loading || false;
    }
    return Object.values(loadingStates).some(state => state.loading);
  }, [loadingStates]);

  const hasError = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key]?.error || null;
    }
    return Object.values(loadingStates).find(state => state.error)?.error || null;
  }, [loadingStates]);

  const retry = useCallback((key: string) => {
    loadingStates[key]?.retry();
  }, [loadingStates]);

  return {
    loadingStates,
    addLoading,
    removeLoading,
    isLoading,
    hasError,
    retry
  };
}

// Skeleton loading hook
export function useSkeletonLoading(delay: number = 1000) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showSkeleton;
}

// Progressive loading hook
export function useProgressiveLoading<T>(
  items: T[],
  batchSize: number = 10,
  delay: number = 100
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentIndex >= items.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const nextBatch = items.slice(currentIndex, currentIndex + batchSize);
      setVisibleItems(prev => [...prev, ...nextBatch]);
      setCurrentIndex(prev => prev + batchSize);
    }, delay);

    return () => clearTimeout(timer);
  }, [items, currentIndex, batchSize, delay]);

  const loadMore = useCallback(() => {
    if (currentIndex < items.length) {
      const nextBatch = items.slice(currentIndex, currentIndex + batchSize);
      setVisibleItems(prev => [...prev, ...nextBatch]);
      setCurrentIndex(prev => prev + batchSize);
    }
  }, [items, currentIndex, batchSize]);

  const hasMore = currentIndex < items.length;

  return {
    visibleItems,
    loading,
    hasMore,
    loadMore,
    totalItems: items.length,
    loadedItems: visibleItems.length
  };
}

 