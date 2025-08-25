import { useMemo } from 'react';

// Feature flag configuration
const FEATURE_FLAGS = {
  // Performance features
  LAZY_LOADING: true,
  IMAGE_OPTIMIZATION: true,
  BUNDLE_SPLITTING: true,
  
  // UX features
  ADVANCED_SEARCH: true,
  PRODUCT_RECOMMENDATIONS: false,
  WISHLIST: false,
  
  // Commerce features
  GUEST_CHECKOUT: false,
  PAYMENT_INTEGRATION: false,
  INVENTORY_TRACKING: true,
  
  // Analytics and tracking
  ANALYTICS: false,
  PERFORMANCE_MONITORING: true,
  ERROR_TRACKING: true,
  
  // Development features
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  STAGING_FEATURES: process.env.VITE_ENV === 'staging',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Hook to check if a feature flag is enabled
 * @param flag - The feature flag to check
 * @returns boolean indicating if the feature is enabled
 */
export const useFeatureFlag = (flag: FeatureFlag): boolean => {
  return useMemo(() => {
    // Check environment variables first (allows runtime overrides)
    const envOverride = process.env[`VITE_FEATURE_${flag}`];
    if (envOverride !== undefined) {
      return envOverride === 'true';
    }
    
    // Fall back to default configuration
    return FEATURE_FLAGS[flag];
  }, [flag]);
};

/**
 * Hook to get multiple feature flags at once
 * @param flags - Array of feature flags to check
 * @returns Record of flag names to their enabled status
 */
export const useFeatureFlags = <T extends FeatureFlag[]>(
  flags: T
): Record<T[number], boolean> => {
  return useMemo(() => {
    const result = {} as Record<T[number], boolean>;
    flags.forEach(flag => {
      result[flag] = useFeatureFlag(flag);
    });
    return result;
  }, [flags]);
};

/**
 * Component wrapper for conditional feature rendering
 */
interface FeatureGateProps {
  flag: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  flag, 
  children, 
  fallback = null 
}) => {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? children : fallback;
};

export default useFeatureFlag;
