import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache, cacheUtils, CACHE_KEYS } from './useCache';

interface QueryOptions<T> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: T | null, error: Error | null) => void;
}

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
  isStale: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: QueryOptions<T> = {}
): QueryResult<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onSettled
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if data is stale
  const isStale = !lastFetchTime || (Date.now() - lastFetchTime) > staleTime;

  // Check cache first
  const cachedData = cacheUtils.get<T>(key);
  const isSuccess = !loading && !error && data !== null;
  const isError = error !== null;

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Don't fetch if we have fresh data and not forcing
    if (!force && cachedData && !isStale) {
      setData(cachedData);
      return;
    }

    try {
      setLoading(true);
      setIsFetching(true);
      setError(null);

      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const result = await fetcher();
      
      // Check if request was cancelled
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setData(result);
      setLastFetchTime(Date.now());
      setRetryCount(0);

      // Cache the result
      cacheUtils.set(key, result, cacheTime);

      onSuccess?.(result);
      onSettled?.(result, null);
    } catch (err) {
      // Don't set error if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      // Retry logic
      if (retryCount < retry) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchData(true);
        }, retryDelay);
      } else {
        onError?.(error);
        onSettled?.(null, error);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [enabled, key, fetcher, staleTime, cacheTime, retry, retryDelay, retryCount, isStale, cachedData, onSuccess, onError, onSettled]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cacheUtils.delete(key);
    setData(null);
    setLastFetchTime(null);
  }, [key]);

  // Initial fetch
  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchData();
    }
  }, [enabled, refetchOnMount, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isStale) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, isStale, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    isStale,
    isFetching,
    isError,
    isSuccess
  };
}

// Mutation hook for data updates
interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
  retry?: number;
  retryDelay?: number;
}

interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
): MutationResult<TData, TVariables> {
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeMutation = useCallback(async (variables: TVariables, retryAttempt = 0): Promise<TData> => {
    try {
      setLoading(true);
      setError(null);
      setIsSuccess(false);

      const result = await mutationFn(variables);
      
      setIsSuccess(true);
      setRetryCount(0);
      onSuccess?.(result, variables);
      onSettled?.(result, null, variables);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      // Retry logic
      if (retryAttempt < retry) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return executeMutation(variables, retryAttempt + 1);
      }

      onError?.(error, variables);
      onSettled?.(null, error, variables);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, retry, retryDelay, onSuccess, onError, onSettled]);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    try {
      return await executeMutation(variables);
    } catch {
      return null;
    }
  }, [executeMutation]);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    return executeMutation(variables);
  }, [executeMutation]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setIsSuccess(false);
    setRetryCount(0);
  }, []);

  return {
    mutate,
    mutateAsync,
    loading,
    error,
    isError: error !== null,
    isSuccess,
    reset
  };
}

// Infinite query hook for pagination
interface InfiniteQueryOptions<T> extends QueryOptions<T[]> {
  getNextPageParam?: (lastPage: T[], allPages: T[][]) => any;
  getPreviousPageParam?: (firstPage: T[], allPages: T[][]) => any;
}

interface InfiniteQueryResult<T> extends QueryResult<T[]> {
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
}

export function useInfiniteQuery<T>(
  key: string,
  fetcher: (pageParam: any) => Promise<T[]>,
  options: InfiniteQueryOptions<T> = {}
): InfiniteQueryResult<T> {
  const {
    getNextPageParam,
    getPreviousPageParam,
    ...queryOptions
  } = options;

  const [pages, setPages] = useState<T[][]>([]);
  const [pageParams, setPageParams] = useState<any[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);

  const query = useQuery<T[]>(
    key,
    () => fetcher(pageParams[pageParams.length - 1]),
    queryOptions
  );

  const fetchNextPage = useCallback(async () => {
    if (!query.data || !getNextPageParam) return;

    const nextPageParam = getNextPageParam(query.data, pages);
    if (nextPageParam === undefined) return;

    setIsFetchingNextPage(true);
    try {
      const nextPage = await fetcher(nextPageParam);
      setPages(prev => [...prev, nextPage]);
      setPageParams(prev => [...prev, nextPageParam]);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [query.data, pages, getNextPageParam, fetcher]);

  const fetchPreviousPage = useCallback(async () => {
    if (!query.data || !getPreviousPageParam) return;

    const previousPageParam = getPreviousPageParam(query.data, pages);
    if (previousPageParam === undefined) return;

    setIsFetchingPreviousPage(true);
    try {
      const previousPage = await fetcher(previousPageParam);
      setPages(prev => [previousPage, ...prev]);
      setPageParams(prev => [previousPageParam, ...prev]);
    } finally {
      setIsFetchingPreviousPage(false);
    }
  }, [query.data, pages, getPreviousPageParam, fetcher]);

  const hasNextPage = getNextPageParam ? getNextPageParam(query.data || [], pages) !== undefined : false;
  const hasPreviousPage = getPreviousPageParam ? getPreviousPageParam(query.data || [], pages) !== undefined : false;

  return {
    ...query,
    data: pages.flat(),
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  };
} 