import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageLazyProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
}

export const OptimizedImageLazy: React.FC<OptimizedImageLazyProps> = ({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create optimized image sources
  const createSrcSet = useCallback((baseSrc: string) => {
    const baseUrl = baseSrc.split('.').slice(0, -1).join('.');
    const extension = baseSrc.split('.').pop();
    
    if (extension === 'svg') {
      return baseSrc;
    }

    // Generate responsive sizes
    const sizes = [400, 800, 1200, 1600];
    const webpSources = sizes.map(size => 
      `${baseUrl}-${size}w.webp ${size}w`
    ).join(', ');
    
    const fallbackSources = sizes.map(size => 
      `${baseUrl}-${size}w.${extension} ${size}w`
    ).join(', ');

    return { webp: webpSources, fallback: fallbackSources };
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before element enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate blur placeholder
  const getBlurDataURL = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width || 400} ${height || 300}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `)}`;
  }, [blurDataURL, width, height]);

  const srcSet = createSrcSet(src);

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={getBlurDataURL()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Main image with modern formats */}
      {(isInView || priority) && (
        <picture>
          {/* WebP sources for better compression */}
          {typeof srcSet === 'object' && srcSet.webp && (
            <source
              srcSet={srcSet.webp}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* Fallback image */}
          <img
            src={src}
            srcSet={typeof srcSet === 'string' ? srcSet : srcSet.fallback}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        </picture>
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};