import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  onMetrics?: (metrics: Partial<PerformanceMetrics>) => void;
  enableLogging?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetrics,
  enableLogging = process.env.NODE_ENV === 'development'
}) => {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    // Web Vitals measurement
    const measureWebVitals = () => {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = entry.startTime;
            metricsRef.current.fcp = fcp;
            
            if (enableLogging) {
              console.log(`🎨 FCP: ${fcp.toFixed(2)}ms`, {
                target: '< 1800ms (Good)',
                status: fcp < 1800 ? '✅ Good' : fcp < 3000 ? '⚠️ Needs Improvement' : '❌ Poor'
              });
            }
            
            onMetrics?.({ fcp });
          }
        }
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        metricsRef.current.lcp = lcp;
        
        if (enableLogging) {
          console.log(`🖼️ LCP: ${lcp.toFixed(2)}ms`, {
            target: '< 2500ms (Good)',
            status: lcp < 2500 ? '✅ Good' : lcp < 4000 ? '⚠️ Needs Improvement' : '❌ Poor'
          });
        }
        
        onMetrics?.({ lcp });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = entry.processingStart - entry.startTime;
          metricsRef.current.fid = fid;
          
          if (enableLogging) {
            console.log(`⚡ FID: ${fid.toFixed(2)}ms`, {
              target: '< 100ms (Good)',
              status: fid < 100 ? '✅ Good' : fid < 300 ? '⚠️ Needs Improvement' : '❌ Poor'
            });
          }
          
          onMetrics?.({ fid });
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        metricsRef.current.cls = clsValue;
        
        if (enableLogging) {
          console.log(`📐 CLS: ${clsValue.toFixed(4)}`, {
            target: '< 0.1 (Good)',
            status: clsValue < 0.1 ? '✅ Good' : clsValue < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'
          });
        }
        
        onMetrics?.({ cls: clsValue });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte (TTFB)
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        metricsRef.current.ttfb = ttfb;
        
        if (enableLogging) {
          console.log(`🌐 TTFB: ${ttfb.toFixed(2)}ms`, {
            target: '< 800ms (Good)',
            status: ttfb < 800 ? '✅ Good' : ttfb < 1800 ? '⚠️ Needs Improvement' : '❌ Poor'
          });
        }
        
        onMetrics?.({ ttfb });
      }

      // Bundle size and loading performance
      if (enableLogging) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const cssResources = resources.filter(r => r.name.includes('.css'));
        const imageResources = resources.filter(r => 
          r.name.includes('.jpg') || r.name.includes('.png') || 
          r.name.includes('.webp') || r.name.includes('.avif')
        );

        const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const totalImageSize = imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

        console.group('📊 Performance Summary');
        console.log(`📦 JS Bundle Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
        console.log(`🎨 CSS Size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
        console.log(`🖼️ Images Size: ${(totalImageSize / 1024).toFixed(2)} KB`);
        console.log(`🔄 Total Requests: ${resources.length}`);
        console.groupEnd();

        // Font loading performance
        const fontResources = resources.filter(r => 
          r.name.includes('fonts.googleapis.com') || 
          r.name.includes('fonts.gstatic.com')
        );
        
        if (fontResources.length > 0) {
          const fontLoadTime = Math.max(...fontResources.map(r => r.responseEnd));
          console.log(`🔤 Font Load Time: ${fontLoadTime.toFixed(2)}ms`);
        }
      }

      // Cleanup observers on unmount
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    // Start measuring after a short delay to ensure page is loaded
    const timer = setTimeout(measureWebVitals, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onMetrics, enableLogging]);

  // Memory usage monitoring
  useEffect(() => {
    if (!enableLogging || !(performance as any).memory) return;

    const logMemoryUsage = () => {
      const memory = (performance as any).memory;
      console.log('🧠 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    };

    // Log memory usage periodically in development
    const interval = setInterval(logMemoryUsage, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [enableLogging]);

  return null; // This component doesn't render anything
};

// Hook for using performance metrics
export const usePerformanceMetrics = () => {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});
  
  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    metricsRef.current = { ...metricsRef.current, ...newMetrics };
  };

  const getMetrics = () => metricsRef.current;

  return { updateMetrics, getMetrics };
};