'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingIndicators, { Spinner, Dots, Skeleton } from '@/components/ui/LoadingIndicators';

interface LazyLoadProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  className?: string;
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder,
  onLoad,
  className = ''
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible) {
      setIsVisible(true);
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();
      }, 100);
    }
  }, [isVisible, onLoad]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  const defaultPlaceholder = (
    <div className="flex items-center justify-center p-8 bg-gray-800/50 rounded-lg">
      <Spinner size="md" />
    </div>
  );

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {!isVisible ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {placeholder || defaultPlaceholder}
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center p-4"
          >
            <Dots />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Virtual scrolling component for large lists
interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor(scrollTop / itemHeight) + visibleCount + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Image lazy loading component
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (src) {
      setImageSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <div className="flex items-center justify-center bg-gray-800/50 rounded-lg">
      <Spinner size="sm" />
    </div>
  );

  return (
    <LazyLoad
      placeholder={placeholder ? (
        <img
          src={placeholder}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${className}`}
        />
      ) : defaultPlaceholder}
      onLoad={() => {
        const img = new Image();
        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = imageSrc;
      }}
    >
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center bg-gray-800/50 rounded-lg"
            style={{ width, height }}
          >
            <Spinner size="sm" />
          </motion.div>
        ) : hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center bg-gray-800/50 rounded-lg text-gray-400"
            style={{ width, height }}
          >
            <span className="text-sm">Resim yüklenemedi</span>
          </motion.div>
        ) : (
          <motion.img
            key="image"
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            className={`object-cover ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </LazyLoad>
  );
}

// Progressive loading for data
interface ProgressiveLoadProps<T> {
  data: T[];
  batchSize?: number;
  delay?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: (index: number) => React.ReactNode;
  className?: string;
}

export function ProgressiveLoad<T>({
  data,
  batchSize = 10,
  delay = 100,
  renderItem,
  renderSkeleton,
  className = ''
}: ProgressiveLoadProps<T>) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visibleCount < data.length) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + batchSize, data.length));
        setIsLoading(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [visibleCount, data.length, batchSize, delay]);

  const defaultSkeleton = (index: number) => (
    <div key={`skeleton-${index}`} className="p-4 bg-gray-800/50 rounded-lg">
      <Skeleton width="w-3/4" height="h-4" className="mb-2" />
      <Skeleton width="w-1/2" height="h-3" />
    </div>
  );

  return (
    <div className={className}>
      {/* Visible items */}
      {data.slice(0, visibleCount).map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 50 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid gap-4 mt-4">
          {Array.from({ length: Math.min(batchSize, data.length - visibleCount) }).map((_, index) => (
            <motion.div
              key={`loading-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 100 }}
            >
              {renderSkeleton ? renderSkeleton(visibleCount + index) : defaultSkeleton(visibleCount + index)}
            </motion.div>
          ))}
        </div>
      )}

      {/* Load more indicator */}
      {visibleCount < data.length && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-4"
        >
          <Dots />
        </motion.div>
      )}
    </div>
  );
} 