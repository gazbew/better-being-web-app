import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domLoad: number; // DOM Load Time
  resourceLoad: number; // Resource Load Time
  imageOptimization: {
    totalImages: number;
    optimizedImages: number;
    totalSize: number;
    compressionRatio: number;
  };
}

interface PerformanceOptions {
  enableReporting?: boolean;
  reportEndpoint?: string;
  sampleRate?: number;
  debug?: boolean;
}

/**
 * Advanced performance monitoring hook for tracking Core Web Vitals
 * and asset optimization metrics
 */
export const usePerformanceMonitoring = (options: PerformanceOptions = {}) => {
  const {
    enableReporting = false,
    reportEndpoint,
    sampleRate = 1.0,
    debug = false
  } = options;

  const metricsRef = useRef<Partial<PerformanceMetrics>>({});
  const observersRef = useRef<PerformanceObserver[]>([]);

  // Log performance metrics
  const logMetric = useCallback((name: string, value: number, unit = 'ms') => {
    if (debug) {
      console.log(`🚀 Performance: ${name} = ${value.toFixed(2)}${unit}`);
    }
  }, [debug]);

  // Measure First Contentful Paint
  const measureFCP = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metricsRef.current.fcp = entry.startTime;
          logMetric('First Contentful Paint', entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    observersRef.current.push(observer);
  }, [logMetric]);

  // Measure Largest Contentful Paint
  const measureLCP = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        metricsRef.current.lcp = lastEntry.startTime;
        logMetric('Largest Contentful Paint', lastEntry.startTime);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    observersRef.current.push(observer);
  }, [logMetric]);

  // Measure First Input Delay
  const measureFID = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        metricsRef.current.fid = entry.processingStart - entry.startTime;
        logMetric('First Input Delay', entry.processingStart - entry.startTime);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    observersRef.current.push(observer);
  }, [logMetric]);

  // Measure Cumulative Layout Shift
  const measureCLS = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      metricsRef.current.cls = clsValue;
      logMetric('Cumulative Layout Shift', clsValue, '');
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    observersRef.current.push(observer);
  }, [logMetric]);

  // Measure Time to First Byte
  const measureTTFB = useCallback(() => {
    if (!('performance' in window)) return;

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      metricsRef.current.ttfb = ttfb;
      logMetric('Time to First Byte', ttfb);
    }
  }, [logMetric]);

  // Measure DOM and Resource Load Times
  const measureLoadTimes = useCallback(() => {
    if (!('performance' in window)) return;

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const domLoad = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
      const resourceLoad = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
      
      metricsRef.current.domLoad = domLoad;
      metricsRef.current.resourceLoad = resourceLoad;
      
      logMetric('DOM Load Time', domLoad);
      logMetric('Resource Load Time', resourceLoad);
    }
  }, [logMetric]);

  // Measure Image Optimization Metrics
  const measureImageOptimization = useCallback(() => {
    if (!('performance' in window)) return;

    const imageResources = performance.getEntriesByType('resource')
      .filter((entry: any) => entry.initiatorType === 'img') as PerformanceResourceTiming[];

    let totalImages = imageResources.length;
    let optimizedImages = 0;
    let totalSize = 0;

    imageResources.forEach((entry: any) => {
      totalSize += entry.transferSize || 0;
      
      // Check if image is optimized (WebP, AVIF, or reasonable size)
      const isWebP = entry.name.includes('.webp');
      const isAVIF = entry.name.includes('.avif');
      const isReasonableSize = (entry.transferSize || 0) < 100 * 1024; // Less than 100KB
      
      if (isWebP || isAVIF || isReasonableSize) {
        optimizedImages++;
      }
    });

    const compressionRatio = totalImages > 0 ? (optimizedImages / totalImages) * 100 : 0;

    metricsRef.current.imageOptimization = {
      totalImages,
      optimizedImages,
      totalSize,
      compressionRatio
    };

    if (debug) {
      console.log('📊 Image Optimization Metrics:', {
        totalImages,
        optimizedImages,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        compressionRatio: `${compressionRatio.toFixed(1)}%`
      });
    }
  }, [debug]);

  // Report metrics to analytics endpoint
  const reportMetrics = useCallback(async () => {
    if (!enableReporting || !reportEndpoint || Math.random() > sampleRate) return;

    try {
      await fetch(reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metrics: metricsRef.current,
          connection: (navigator as any).connection?.effectiveType || 'unknown'
        }),
      });
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }, [enableReporting, reportEndpoint, sampleRate]);

  // Get current metrics
  const getMetrics = useCallback((): Partial<PerformanceMetrics> => {
    return { ...metricsRef.current };
  }, []);

  // Performance score calculation
  const calculatePerformanceScore = useCallback((): number => {
    const metrics = metricsRef.current;
    let score = 100;

    // FCP scoring (0-4s scale)
    if (metrics.fcp) {
      if (metrics.fcp > 4000) score -= 25;
      else if (metrics.fcp > 2500) score -= 15;
      else if (metrics.fcp > 1500) score -= 5;
    }

    // LCP scoring (0-4s scale)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 25;
      else if (metrics.lcp > 2500) score -= 15;
      else if (metrics.lcp > 1500) score -= 5;
    }

    // FID scoring (0-300ms scale)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 20;
      else if (metrics.fid > 100) score -= 10;
      else if (metrics.fid > 50) score -= 5;
    }

    // CLS scoring (0-0.25 scale)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 20;
      else if (metrics.cls > 0.1) score -= 10;
      else if (metrics.cls > 0.05) score -= 5;
    }

    // Image optimization bonus
    if (metrics.imageOptimization) {
      const { compressionRatio } = metrics.imageOptimization;
      if (compressionRatio > 80) score += 10;
      else if (compressionRatio > 60) score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }, []);

  // Initialize monitoring
  useEffect(() => {
    // Wait for page load to start measuring
    if (document.readyState === 'complete') {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
      measureLoadTimes();
      measureImageOptimization();
    } else {
      window.addEventListener('load', () => {
        measureFCP();
        measureLCP();
        measureFID();
        measureCLS();
        measureTTFB();
        measureLoadTimes();
        measureImageOptimization();
      });
    }

    // Report metrics after a delay
    const reportTimer = setTimeout(() => {
      reportMetrics();
    }, 5000);

    // Cleanup observers on unmount
    return () => {
      clearTimeout(reportTimer);
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
    };
  }, [
    measureFCP,
    measureLCP,
    measureFID,
    measureCLS,
    measureTTFB,
    measureLoadTimes,
    measureImageOptimization,
    reportMetrics
  ]);

  return {
    getMetrics,
    calculatePerformanceScore,
    reportMetrics
  };
};

export default usePerformanceMonitoring;