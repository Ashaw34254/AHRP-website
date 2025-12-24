/**
 * Error Logger Utility for Aurora Horizon RP
 * 
 * Comprehensive error logging system for development and production environments.
 * Provides structured logging, error categorization, and debugging helpers.
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 
  | 'network'
  | 'database'
  | 'authentication'
  | 'validation'
  | 'runtime'
  | 'rendering'
  | 'api'
  | 'unknown';

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
  environment: 'development' | 'production';
}

export class ErrorLogger {
  private static logs: ErrorLog[] = [];
  private static maxLogs = 100; // Keep last 100 errors in memory

  /**
   * Log an error with full context
   */
  static logError(
    error: Error,
    options?: {
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      context?: Record<string, any>;
      userId?: string;
    }
  ): ErrorLog {
    const isDev = process.env.NODE_ENV === 'development';
    const severity = options?.severity || this.calculateSeverity(error);
    const category = options?.category || this.categorizeError(error);

    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      severity,
      category,
      context: options?.context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: options?.userId,
      environment: isDev ? 'development' : 'production',
    };

    // Add to in-memory logs
    this.logs.push(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Console logging with colors and structure
    this.consoleLog(errorLog, error);

    // In production, you could send to external service (Sentry, LogRocket, etc.)
    if (!isDev) {
      this.sendToExternalService(errorLog);
    }

    // Save to localStorage for dev debugging
    if (isDev) {
      this.saveToLocalStorage(errorLog);
    }

    return errorLog;
  }

  /**
   * Calculate error severity based on error type and message
   */
  private static calculateSeverity(error: Error): ErrorSeverity {
    const msg = error.message.toLowerCase();
    
    // Critical errors
    if (msg.includes('database') || msg.includes('critical') || msg.includes('fatal')) {
      return 'critical';
    }
    
    // High severity
    if (msg.includes('auth') || msg.includes('permission') || msg.includes('security')) {
      return 'high';
    }
    
    // Medium severity
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('api')) {
      return 'medium';
    }
    
    // Low severity (default)
    return 'low';
  }

  /**
   * Categorize error based on error type and message
   */
  private static categorizeError(error: Error): ErrorCategory {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('connection')) {
      return 'network';
    }
    if (msg.includes('database') || msg.includes('prisma') || msg.includes('sql')) {
      return 'database';
    }
    if (msg.includes('auth') || msg.includes('unauthorized') || msg.includes('permission')) {
      return 'authentication';
    }
    if (msg.includes('validation') || msg.includes('invalid') || msg.includes('required')) {
      return 'validation';
    }
    if (msg.includes('render') || msg.includes('hydration') || msg.includes('component')) {
      return 'rendering';
    }
    if (msg.includes('api') || msg.includes('endpoint') || msg.includes('route')) {
      return 'api';
    }
    
    return 'runtime';
  }

  /**
   * Enhanced console logging with colors and grouping
   */
  private static consoleLog(log: ErrorLog, originalError: Error): void {
    const severityColors: Record<ErrorSeverity, string> = {
      low: '#3b82f6',      // Blue
      medium: '#f59e0b',   // Amber
      high: '#ef4444',     // Red
      critical: '#dc2626', // Dark red
    };

    const severityEmojis: Record<ErrorSeverity, string> = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
      critical: '🔴',
    };

    console.group(
      `%c${severityEmojis[log.severity]} ${log.category.toUpperCase()} ERROR [${log.severity}]`,
      `color: ${severityColors[log.severity]}; font-weight: bold; font-size: 14px;`
    );
    
    console.log('%cError ID:', 'color: #6366f1; font-weight: bold;', log.id);
    console.log('%cTimestamp:', 'color: #6366f1; font-weight: bold;', log.timestamp);
    console.log('%cMessage:', 'color: #6366f1; font-weight: bold;', log.message);
    
    if (log.url) {
      console.log('%cURL:', 'color: #6366f1; font-weight: bold;', log.url);
    }
    
    if (log.context) {
      console.log('%cContext:', 'color: #6366f1; font-weight: bold;', log.context);
    }
    
    if (log.stack) {
      console.groupCollapsed('%cStack Trace:', 'color: #8b5cf6; font-weight: bold;');
      console.log(log.stack);
      console.groupEnd();
    }
    
    console.log('%cOriginal Error:', 'color: #ec4899; font-weight: bold;', originalError);
    console.groupEnd();
  }

  /**
   * Save error to localStorage for dev debugging
   */
  private static saveToLocalStorage(log: ErrorLog): void {
    try {
      const stored = localStorage.getItem('ahrp_error_logs');
      const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];
      logs.push(log);
      
      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem('ahrp_error_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Send error to external monitoring service (placeholder)
   */
  private static sendToExternalService(log: ErrorLog): void {
    // TODO: Implement external service integration
    // Examples: Sentry, LogRocket, Datadog, etc.
    
    // Example Sentry integration:
    // Sentry.captureException(error, {
    //   level: log.severity,
    //   tags: { category: log.category },
    //   extra: log.context,
    // });
  }

  /**
   * Generate unique error ID
   */
  private static generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all logged errors
   */
  static getErrorLogs(filters?: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    limit?: number;
  }): ErrorLog[] {
    let logs = [...this.logs];

    if (filters?.severity) {
      logs = logs.filter(log => log.severity === filters.severity);
    }

    if (filters?.category) {
      logs = logs.filter(log => log.category === filters.category);
    }

    if (filters?.limit) {
      logs = logs.slice(-filters.limit);
    }

    return logs.reverse(); // Most recent first
  }

  /**
   * Get errors from localStorage (dev only)
   */
  static getStoredErrors(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('ahrp_error_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear all error logs
   */
  static clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('ahrp_error_logs');
    } catch {
      // Ignore
    }
  }

  /**
   * Export error logs as JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error statistics
   */
  static getStatistics(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    recentErrors: ErrorLog[];
  } {
    const bySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const byCategory = {
      network: 0,
      database: 0,
      authentication: 0,
      validation: 0,
      runtime: 0,
      rendering: 0,
      api: 0,
      unknown: 0,
    };

    this.logs.forEach(log => {
      bySeverity[log.severity]++;
      byCategory[log.category]++;
    });

    return {
      total: this.logs.length,
      bySeverity,
      byCategory,
      recentErrors: this.logs.slice(-10).reverse(),
    };
  }
}

/**
 * Helper function for quick error logging
 */
export function logError(
  error: Error,
  context?: Record<string, any>
): void {
  ErrorLogger.logError(error, { context });
}

/**
 * Helper function for API error logging
 */
export function logApiError(
  error: Error,
  endpoint: string,
  method: string,
  statusCode?: number
): void {
  ErrorLogger.logError(error, {
    category: 'api',
    severity: statusCode && statusCode >= 500 ? 'high' : 'medium',
    context: { endpoint, method, statusCode },
  });
}

/**
 * Helper function for database error logging
 */
export function logDatabaseError(
  error: Error,
  operation: string,
  model?: string
): void {
  ErrorLogger.logError(error, {
    category: 'database',
    severity: 'critical',
    context: { operation, model },
  });
}
