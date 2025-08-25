import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { AppErrorClass, ErrorCodes, logError } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

/**
 * Enhanced Error Boundary with multiple fallback UI options and error reporting
 */
export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    const appError = new AppErrorClass(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.level || 'component',
      }
    );

    logError(appError);

    // Update state with error info
    this.setState({
      errorInfo,
      eventId: Date.now().toString(), // Simple event ID for tracking
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Auto-retry for component-level errors after 5 seconds
    if (this.props.level === 'component') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.handleReset();
      }, 5000);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, children } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== children) {
      this.handleReset();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleReset = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo, eventId } = this.state;
    
    // Prepare error report
    const errorReport = {
      eventId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      level: this.props.level,
    };

    // Copy to clipboard for user to share
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2)).then(() => {
      alert('Error details copied to clipboard. Please share this with our support team.');
    }).catch(() => {
      console.log('Error Report:', errorReport);
      alert('Error report logged to console. Please share the console output with our support team.');
    });
  };

  renderMinimalFallback() {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-red-700 text-sm">Something went wrong</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={this.handleReset}
          className="ml-2 text-red-600 hover:text-red-700"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  renderComponentFallback() {
    const { error } = this.state;

    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-red-700 text-lg">Component Error</CardTitle>
          </div>
          <CardDescription className="text-red-600">
            This component encountered an error and couldn't render properly.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          <Alert variant="destructive" className="bg-red-100 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="text-sm font-mono">
              {error?.message || 'Unknown error occurred'}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-between pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleReset}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={this.handleReportError}
            className="flex items-center space-x-1 text-red-600"
          >
            <Bug className="w-4 h-4" />
            <span>Report</span>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  renderPageFallback() {
    const { error, eventId } = this.state;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-700">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-red-600 mt-2">
              We're sorry, but this page encountered an error. Our team has been notified.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Information</AlertTitle>
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <div><strong>Error:</strong> {error?.message || 'Unknown error'}</div>
                  {eventId && <div><strong>Event ID:</strong> {eventId}</div>}
                  <div><strong>Time:</strong> {new Date().toLocaleString()}</div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              <p className="mb-2"><strong>What you can do:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try refreshing the page</li>
                <li>Check your internet connection</li>
                <li>Go back to the homepage</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={this.handleReload}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={this.handleGoHome}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={this.handleReportError}
              className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Bug className="w-4 h-4" />
              <span>Report Error</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  renderCriticalFallback() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Critical Error
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-md">
            The application encountered a critical error and cannot continue. 
            Please refresh the page or contact support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={this.handleReload}
              size="lg"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Application</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={this.handleReportError}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Bug className="w-5 h-5" />
              <span>Report Issue</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise, use level-appropriate fallback
      switch (level) {
        case 'critical':
          return this.renderCriticalFallback();
        case 'page':
          return this.renderPageFallback();
        case 'component':
        default:
          return this.renderComponentFallback();
      }
    }

    return children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for error boundary functionality in functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // This would typically integrate with your error reporting service
    const appError = new AppErrorClass(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      {
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        source: 'useErrorHandler',
      }
    );

    logError(appError);
    
    // Re-throw to be caught by error boundary
    throw error;
  };
}

/**
 * Minimal error fallback component
 */
export const MinimalErrorFallback: React.FC<{ error?: Error; onReset?: () => void }> = ({ 
  error, 
  onReset 
}) => (
  <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
    <span className="text-red-700 text-sm">
      {error?.message || 'Something went wrong'}
    </span>
    {onReset && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="ml-2 text-red-600 hover:text-red-700"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    )}
  </div>
);

export default ErrorBoundary;