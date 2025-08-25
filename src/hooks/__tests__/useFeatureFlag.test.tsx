import { renderHook } from '@testing-library/react';
import { useFeatureFlag, useFeatureFlags, FeatureGate } from '../useFeatureFlag';
import { render, screen } from '../../test/test-utils';

describe('useFeatureFlag', () => {
  beforeEach(() => {
    // Clear any environment variable mocks
    delete process.env.VITE_FEATURE_ADVANCED_SEARCH;
    delete process.env.VITE_FEATURE_LAZY_LOADING;
  });

  it('should return true for enabled features', () => {
    const { result } = renderHook(() => useFeatureFlag('ADVANCED_SEARCH'));
    expect(result.current).toBe(true);
  });

  it('should return false for disabled features', () => {
    const { result } = renderHook(() => useFeatureFlag('PRODUCT_RECOMMENDATIONS'));
    expect(result.current).toBe(false);
  });

  it('should return true for performance features', () => {
    const { result: lazyLoading } = renderHook(() => useFeatureFlag('LAZY_LOADING'));
    const { result: imageOptimization } = renderHook(() => useFeatureFlag('IMAGE_OPTIMIZATION'));
    const { result: bundleSplitting } = renderHook(() => useFeatureFlag('BUNDLE_SPLITTING'));

    expect(lazyLoading.current).toBe(true);
    expect(imageOptimization.current).toBe(true);
    expect(bundleSplitting.current).toBe(true);
  });

  it('should return correct values for development features', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Test development mode
    process.env.NODE_ENV = 'development';
    const { result: debugDev } = renderHook(() => useFeatureFlag('DEBUG_MODE'));
    expect(debugDev.current).toBe(true);

    // Test production mode
    process.env.NODE_ENV = 'production';
    const { result: debugProd } = renderHook(() => useFeatureFlag('DEBUG_MODE'));
    expect(debugProd.current).toBe(false);

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  it('should prioritize environment variable overrides', () => {
    // Set environment override to disable a normally enabled feature
    process.env.VITE_FEATURE_ADVANCED_SEARCH = 'false';
    
    const { result } = renderHook(() => useFeatureFlag('ADVANCED_SEARCH'));
    expect(result.current).toBe(false);
  });

  it('should handle environment variable overrides for enabling features', () => {
    // Set environment override to enable a normally disabled feature
    process.env.VITE_FEATURE_PRODUCT_RECOMMENDATIONS = 'true';
    
    const { result } = renderHook(() => useFeatureFlag('PRODUCT_RECOMMENDATIONS'));
    expect(result.current).toBe(true);
  });

  it('should handle invalid environment variable values', () => {
    // Set invalid environment variable
    process.env.VITE_FEATURE_ADVANCED_SEARCH = 'invalid';
    
    const { result } = renderHook(() => useFeatureFlag('ADVANCED_SEARCH'));
    // Should fall back to default configuration (true for ADVANCED_SEARCH)
    expect(result.current).toBe(true);
  });

  it('should be stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useFeatureFlag('ADVANCED_SEARCH'));
    
    const firstResult = result.current;
    rerender();
    const secondResult = result.current;
    
    expect(firstResult).toBe(secondResult);
  });
});

describe('useFeatureFlags', () => {
  it('should return multiple feature flags', () => {
    const flags = ['ADVANCED_SEARCH', 'LAZY_LOADING', 'PRODUCT_RECOMMENDATIONS'] as const;
    const { result } = renderHook(() => useFeatureFlags(flags));

    expect(result.current).toEqual({
      ADVANCED_SEARCH: true,
      LAZY_LOADING: true,
      PRODUCT_RECOMMENDATIONS: false,
    });
  });

  it('should handle empty flags array', () => {
    const { result } = renderHook(() => useFeatureFlags([]));
    expect(result.current).toEqual({});
  });

  it('should handle single flag', () => {
    const { result } = renderHook(() => useFeatureFlags(['ADVANCED_SEARCH'] as const));
    expect(result.current).toEqual({
      ADVANCED_SEARCH: true,
    });
  });

  it('should update when flags change', () => {
    let flags = ['ADVANCED_SEARCH'] as const;
    const { result, rerender } = renderHook(() => useFeatureFlags(flags));

    expect(result.current).toEqual({
      ADVANCED_SEARCH: true,
    });

    // Change flags
    flags = ['ADVANCED_SEARCH', 'LAZY_LOADING'] as const;
    rerender();

    expect(result.current).toEqual({
      ADVANCED_SEARCH: true,
      LAZY_LOADING: true,
    });
  });
});

describe('FeatureGate', () => {
  it('should render children when feature is enabled', () => {
    render(
      <FeatureGate flag="ADVANCED_SEARCH">
        <div>Feature Content</div>
      </FeatureGate>
    );

    expect(screen.getByText('Feature Content')).toBeInTheDocument();
  });

  it('should not render children when feature is disabled', () => {
    render(
      <FeatureGate flag="PRODUCT_RECOMMENDATIONS">
        <div>Feature Content</div>
      </FeatureGate>
    );

    expect(screen.queryByText('Feature Content')).not.toBeInTheDocument();
  });

  it('should render fallback when feature is disabled and fallback is provided', () => {
    render(
      <FeatureGate 
        flag="PRODUCT_RECOMMENDATIONS" 
        fallback={<div>Fallback Content</div>}
      >
        <div>Feature Content</div>
      </FeatureGate>
    );

    expect(screen.queryByText('Feature Content')).not.toBeInTheDocument();
    expect(screen.getByText('Fallback Content')).toBeInTheDocument();
  });

  it('should render null when feature is disabled and no fallback is provided', () => {
    const { container } = render(
      <FeatureGate flag="PRODUCT_RECOMMENDATIONS">
        <div>Feature Content</div>
      </FeatureGate>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should work with complex children', () => {
    render(
      <FeatureGate flag="ADVANCED_SEARCH">
        <div>
          <h1>Complex Feature</h1>
          <p>With multiple elements</p>
          <button>And interactive components</button>
        </div>
      </FeatureGate>
    );

    expect(screen.getByText('Complex Feature')).toBeInTheDocument();
    expect(screen.getByText('With multiple elements')).toBeInTheDocument();
    expect(screen.getByText('And interactive components')).toBeInTheDocument();
  });

  it('should work with string children', () => {
    render(
      <FeatureGate flag="ADVANCED_SEARCH">
        Just a string
      </FeatureGate>
    );

    expect(screen.getByText('Just a string')).toBeInTheDocument();
  });

  it('should handle environment variable overrides', () => {
    // Enable a normally disabled feature via environment
    process.env.VITE_FEATURE_PRODUCT_RECOMMENDATIONS = 'true';
    
    render(
      <FeatureGate flag="PRODUCT_RECOMMENDATIONS">
        <div>Now Enabled Content</div>
      </FeatureGate>
    );

    expect(screen.getByText('Now Enabled Content')).toBeInTheDocument();
  });

  it('should re-render when feature flag changes', () => {
    const { rerender } = render(
      <FeatureGate flag="PRODUCT_RECOMMENDATIONS">
        <div>Feature Content</div>
      </FeatureGate>
    );

    // Initially disabled
    expect(screen.queryByText('Feature Content')).not.toBeInTheDocument();

    // Enable via environment variable
    process.env.VITE_FEATURE_PRODUCT_RECOMMENDATIONS = 'true';
    
    rerender(
      <FeatureGate flag="PRODUCT_RECOMMENDATIONS">
        <div>Feature Content</div>
      </FeatureGate>
    );

    expect(screen.getByText('Feature Content')).toBeInTheDocument();
  });
});
