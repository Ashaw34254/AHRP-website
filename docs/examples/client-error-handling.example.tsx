/**
 * Client-Side Error Handling Examples
 * 
 * Best practices for handling errors in React components
 * for the Aurora Horizon RP project.
 */

"use client";

import { useState, useEffect } from "react";
import { logError, logApiError } from "@/lib/error-logger";
import { toast } from "@/lib/toast";

// Placeholder components for examples
const AdvancedView = () => <div>Advanced</div>;
const BasicView = () => <div>Basic</div>;

/**
 * Example 1: API Call with Error Handling
 */
export function DataFetchingComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);

      } catch (error) {
        // Log the error
        logApiError(
          error as Error,
          '/api/data',
          'GET'
        );

        // Show user-friendly message
        const message = "Failed to load data. Please try again.";
        setError(message);
        toast.error(message);

      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return <div>{/* Render data */}</div>;
}

/**
 * Example 2: Form Submission with Error Handling
 */
export function FormComponent() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Client-side validation
      if (!formData.email.includes('@')) {
        throw new Error("Invalid email format");
      }

      // Submit data
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      toast.success("Form submitted successfully!");

    } catch (error) {
      // Log error with context
      logError(error as Error, {
        formData: {
          name: formData.name,
          email: formData.email.substring(0, 3) + '***', // Sanitize email
        },
        action: 'formSubmission',
      });

      // Show error to user
      toast.error((error as Error).message);

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

/**
 * Example 3: Error Boundary with Logging
 */
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error
    logError(error, {
      componentStack: errorInfo.componentStack,
      boundary: 'CustomErrorBoundary',
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">Something went wrong</h3>
          <p className="text-gray-400 text-sm">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Example 4: Retry Logic with Error Handling
 */
export function useApiCall<T>(url: string, maxRetries = 3) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchWithRetry(retryCount = 0): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);

    } catch (error) {
      if (retryCount < maxRetries) {
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry
        return fetchWithRetry(retryCount + 1);
      } else {
        // Max retries reached, log error
        logApiError(
          error as Error,
          url,
          'GET'
        );
        
        setError(error as Error);
        toast.error("Failed to load data after multiple attempts");
      }
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, refetch: () => fetchWithRetry() };
}

/**
 * Example 5: Async Operation with Timeout
 */
export async function fetchWithTimeout(
  url: string,
  timeout = 5000
): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();

  } catch (error: any) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout after ${timeout}ms`);
      logApiError(timeoutError, url, 'GET', 408);
      throw timeoutError;
    }

    logApiError(error as Error, url, 'GET');
    throw error;
  }
}

/**
 * Example 6: Graceful Degradation
 */
export function FeatureComponent() {
  const [featureAvailable, setFeatureAvailable] = useState(true);

  async function tryFeature() {
    try {
      // Try to use feature
      const result = await fetch('/api/advanced-feature');
      
      if (!result.ok) {
        throw new Error('Feature unavailable');
      }

      return await result.json();

    } catch (error) {
      // Log error but don't crash
      logError(error as Error, {
        feature: 'advancedFeature',
        fallback: 'basic',
      });

      // Disable feature and use fallback
      setFeatureAvailable(false);
      
      toast.warning("Advanced feature unavailable, using basic mode");
      
      return null;
    }
  }

  return (
    <div>
      {featureAvailable ? (
        <AdvancedView />
      ) : (
        <BasicView />
      )}
    </div>
  );
}

/**
 * Example 7: User Action Error Handling
 */
export function ActionButton() {
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    setLoading(true);

    try {
      const response = await fetch('/api/action', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Action failed');
      }

      toast.success("Action completed successfully!");

    } catch (error) {
      // Log with user context
      logError(error as Error, {
        action: 'buttonClick',
        buttonId: 'mainAction',
      });

      // User-friendly error message
      toast.error("Unable to complete action. Please try again.");

    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Execute Action'}
    </button>
  );
}

/**
 * Example 8: Global Error Handler Hook
 */
export function useGlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError(event.reason as Error, {
        type: 'unhandledRejection',
      });
      
      toast.error("An unexpected error occurred");
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      logError(event.error, {
        type: 'globalError',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}
