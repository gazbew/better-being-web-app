import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Router Guard component to ensure React Router context is available
 * This helps prevent "useContext is null" errors for Link components
 */
export const RouterGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    // This will throw if we're not inside a Router context
    useLocation();
    return <>{children}</>;
  } catch (error) {
    // Fallback if Router context is not available
    console.warn('RouterGuard: Router context not available, falling back to div wrapper');
    return <div>{children}</div>;
  }
};

export default RouterGuard;