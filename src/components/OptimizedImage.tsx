import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  quality?: number;
  blurDataURL?: string;
  onLoadComplete?: () => void;
}

/**
 * High-performance optimized image component with:
 * - Modern format support (WebP/AVIF)
 * - Intersection Observer lazy loading
 * - Responsive image sizes
 * - Progressive loading with blur placeholder
 * - Error handling and fallbacks
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = '/placeholder.svg',
  priority = false,
  webpSrc,
  avifSrc,
  sizes,
  quality = 75,
  blurDataURL,
  onLoadComplete,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Generate optimized srcSet with multiple formats and sizes
  const { srcSet, webpSrcSet, avifSrcSet } = useMemo(() => {
    if (!width || hasError) return { srcSet: undefined, webpSrcSet: undefined, avifSrcSet: undefined };

    const generateSrcSet = (baseSrc: string, format?: string) => {
      const extension = format ? `.${format}` : '';
      const baseUrl = baseSrc.split('.').slice(0, -1).join('.');
      
      return [
        `${baseUrl}-${width}w${extension}?q=${quality} ${width}w`,
        `${baseUrl}-${Math.round(width * 1.5)}w${extension}?q=${quality} ${Math.round(width * 1.5)}w`,
        `${baseUrl}-${width * 2}w${extension}?q=${quality} ${width * 2}w`,
      ].join(', ');
    };

    return {
      srcSet: generateSrcSet(src),
      webpSrcSet: webpSrc ? generateSrcSet(webpSrc, 'webp') : generateSrcSet(src, 'webp'),
      avifSrcSet: avifSrc ? generateSrcSet(avifSrc, 'avif') : generateSrcSet(src, 'avif'),
    };
  }, [src, webpSrc, avifSrc, width, quality, hasError]);

  // Calculate responsive sizes if not provided
  const responsiveSizes = sizes || (width ? `(max-width: 768px) 100vw, ${width}px` : '100vw');

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`} 
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {isLoading && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {isLoading && !blurDataURL && (
        <Skeleton 
          className="absolute inset-0 w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" 
          style={{ width: width || '100%', height: height || '200px' }}
        />
      )}

      {/* Progressive enhancement with modern formats */}
      {isInView && (
        <picture>
          {/* AVIF - Best compression */}
          {avifSrcSet && (
            <source
              type="image/avif"
              srcSet={avifSrcSet}
              sizes={responsiveSizes}
            />
          )}
          
          {/* WebP - Good compression */}
          {webpSrcSet && (
            <source
              type="image/webp"
              srcSet={webpSrcSet}
              sizes={responsiveSizes}
            />
          )}
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={hasError ? fallback : src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            srcSet={!hasError ? srcSet : undefined}
            sizes={responsiveSizes}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            {...props}
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
