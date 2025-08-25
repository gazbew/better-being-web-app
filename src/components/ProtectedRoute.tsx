import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

export function ProtectedRoute({ children, requireEmailVerified = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return true;
      } else {
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const verifyAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!accessToken || !storedUser) {
      // No tokens, try to refresh
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        setIsLoading(false);
        return;
      }
    } else {
      // Verify the access token is still valid
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, try refresh
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
              setIsAuthenticated(true);
            }
          }
        } else if (response.status === 401) {
          // Token expired, try refresh
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Try refresh as fallback
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          setIsAuthenticated(true);
        }
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    verifyAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-wellness">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification requirement
  if (requireEmailVerified && user && !user.emailVerified) {
    toast({
      title: "Email Verification Required",
      description: "Please verify your email address to access this feature.",
      variant: "destructive",
    });
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Higher-order component version for easier use
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: { requireEmailVerified?: boolean } = {}
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute requireEmailVerified={options.requireEmailVerified}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}