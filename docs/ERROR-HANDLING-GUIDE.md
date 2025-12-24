# Error Handling & Debugging Guide

## Overview
Comprehensive error handling system for Aurora Horizon RP with enhanced debugging capabilities for the development team.

## Error Pages

### 1. Standard Error Page (`app/error.tsx`)
**Route-level errors** - Catches errors in specific routes/pages.

**Features:**
- 🎯 **Error categorization** - Automatically categorizes errors (Network, Database, Runtime, etc.)
- 📊 **Comprehensive error details** - Message, stack trace, environment info, URL
- 🔄 **Quick actions** - Copy report, download JSON, retry operation
- 🛠️ **Developer mode** - Extra debug info when `NODE_ENV=development`
- 💡 **Suggested fixes** - Context-aware solutions based on error type
- 📋 **Full error report** - Formatted for sharing with team

**Usage:**
```typescript
// Errors are automatically caught by Next.js Error Boundary
// Thrown errors will display this page

throw new Error("Something went wrong");
```

### 2. Global Error Page (`app/global-error.tsx`)
**Application-level errors** - Catches critical errors that break the entire app.

**Features:**
- 🚨 **Critical error handling** - For catastrophic failures
- 📦 **Module loading errors** - Detects chunk/script loading issues
- 🔍 **Hydration error detection** - Identifies React rendering issues
- 💾 **Error persistence** - Logs to console and provides download
- 🎯 **Emergency recovery** - Clear steps for fixing critical errors

**When it triggers:**
- Module/chunk loading failures
- React hydration errors
- Root component crashes
- Provider/context errors

### 3. 404 Not Found Page (`app/not-found.tsx`)
**Missing pages** - User-friendly 404 with debugging info.

**Features:**
- 🔗 **URL display** - Shows the requested URL with copy button
- 🛠️ **Developer info** - Route debugging hints in dev mode
- 🧭 **Quick navigation** - Links to common pages
- 📍 **Debugging steps** - Checklist for fixing 404s

## Error Logger (`lib/error-logger.ts`)

### Features
- **Automatic categorization** - Network, Database, Auth, Runtime, etc.
- **Severity levels** - Low, Medium, High, Critical
- **Context tracking** - URL, user agent, custom context
- **In-memory logs** - Last 100 errors
- **LocalStorage persistence** - Dev mode error history
- **Statistics** - Error counts by severity and category
- **Export functionality** - Download logs as JSON

### Usage

#### Basic Error Logging
```typescript
import { logError } from "@/lib/error-logger";

try {
  // Your code
} catch (error) {
  logError(error as Error, {
    customField: "value",
    userId: user.id
  });
}
```

#### API Error Logging
```typescript
import { logApiError } from "@/lib/error-logger";

try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
} catch (error) {
  logApiError(
    error as Error,
    '/api/endpoint',
    'GET',
    response?.status
  );
}
```

#### Database Error Logging
```typescript
import { logDatabaseError } from "@/lib/error-logger";

try {
  const user = await prisma.user.findUnique({ where: { id } });
} catch (error) {
  logDatabaseError(
    error as Error,
    'findUnique',
    'User'
  );
}
```

#### Advanced Usage
```typescript
import { ErrorLogger } from "@/lib/error-logger";

// Log with full options
ErrorLogger.logError(error, {
  severity: 'critical',
  category: 'database',
  context: {
    operation: 'createUser',
    model: 'User',
    data: sanitizedData
  },
  userId: currentUser?.id
});

// Get error statistics
const stats = ErrorLogger.getStatistics();
console.log(`Total errors: ${stats.total}`);
console.log(`Critical: ${stats.bySeverity.critical}`);

// Get filtered logs
const criticalErrors = ErrorLogger.getErrorLogs({
  severity: 'critical',
  limit: 10
});

// Export logs
const json = ErrorLogger.exportLogs();

// Clear logs
ErrorLogger.clearLogs();
```

## Error Dashboard (`components/ErrorDashboard.tsx`)

### Features
- 📊 **Real-time statistics** - Total errors, by severity, by category
- 🔍 **Filtering** - Filter by severity and category
- 📋 **Error details** - Expandable cards with full info
- 💾 **Export** - Download logs as JSON
- 🗑️ **Clear logs** - Reset error history
- ♻️ **Auto-refresh** - Updates every 5 seconds

### Adding to Admin Panel
```typescript
// app/admin/errors/page.tsx
"use client";

import ErrorDashboard from "@/components/ErrorDashboard";
import AdminLayout from "@/components/AdminLayout";

export default function ErrorsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Error Monitoring</h1>
        <ErrorDashboard />
      </div>
    </AdminLayout>
  );
}
```

## Development vs Production

### Development Mode
**Extra debugging features enabled:**
- ✅ Stack traces visible on error pages
- ✅ Developer debug sections with command hints
- ✅ Errors saved to localStorage
- ✅ Detailed console logging with colors
- ✅ Environment info displayed
- ✅ Quick debug commands shown

### Production Mode
**Production-safe error handling:**
- ❌ No stack traces shown to users
- ❌ No sensitive debug info exposed
- ✅ User-friendly error messages
- ✅ Error digest for support tickets
- ✅ External logging (when configured)
- ✅ Clean error reports

## Error Categories

### Network Errors
**Keywords:** fetch, network, connection, timeout
```typescript
// Example
try {
  await fetch('/api/data');
} catch (error) {
  // Auto-categorized as "network"
  logError(error);
}
```

### Database Errors
**Keywords:** database, prisma, sql
```typescript
// Example
try {
  await prisma.user.create({ data });
} catch (error) {
  // Auto-categorized as "database"
  logDatabaseError(error, 'create', 'User');
}
```

### Authentication Errors
**Keywords:** auth, unauthorized, permission, security
```typescript
// Example
if (!session) {
  const error = new Error("Unauthorized access");
  logError(error, { category: 'authentication' });
}
```

### Validation Errors
**Keywords:** validation, invalid, required
```typescript
// Example
if (!email.includes('@')) {
  throw new Error("Invalid email format");
  // Auto-categorized as "validation"
}
```

## Severity Levels

### Critical 🔴
**Immediate attention required**
- Database connection failures
- Authentication system crashes
- Data corruption
- Security breaches

### High 🚨
**Urgent, affects functionality**
- API endpoint failures
- Permission errors
- Failed database operations
- User-facing errors

### Medium ⚠️
**Should be addressed soon**
- Network timeouts
- API rate limits
- Non-critical validation errors
- Third-party service issues

### Low ℹ️
**Nice to fix, low impact**
- Minor rendering issues
- Non-critical warnings
- Edge case errors
- Development-only errors

## Best Practices

### 1. Always Catch Errors
```typescript
// ❌ Bad
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logApiError(error as Error, '/api/data', 'GET');
    throw error;
  }
}
```

### 2. Provide Context
```typescript
// ❌ Bad
catch (error) {
  logError(error);
}

// ✅ Good
catch (error) {
  logError(error, {
    userId: user.id,
    action: 'updateProfile',
    data: { fields: updatedFields }
  });
}
```

### 3. Use Appropriate Severity
```typescript
// ❌ Bad - Everything is critical
logError(error, { severity: 'critical' });

// ✅ Good - Let auto-detection work
logError(error); // Auto-determines severity

// ✅ Good - Override when needed
logError(error, { 
  severity: 'critical',  // Override for important cases
  category: 'database'
});
```

### 4. Don't Log Sensitive Data
```typescript
// ❌ Bad
logError(error, {
  password: user.password,
  creditCard: payment.cardNumber
});

// ✅ Good
logError(error, {
  userId: user.id,
  email: user.email,
  action: 'payment'
  // No sensitive data
});
```

## Debugging Tips

### Check Error Logs in Development
```typescript
// Open browser console
console.log(ErrorLogger.getStatistics());
console.log(ErrorLogger.getErrorLogs());

// Or check localStorage
const logs = localStorage.getItem('ahrp_error_logs');
console.log(JSON.parse(logs));
```

### Find Specific Error Types
```typescript
// In browser console
const dbErrors = ErrorLogger.getErrorLogs({
  category: 'database'
});

const criticalErrors = ErrorLogger.getErrorLogs({
  severity: 'critical',
  limit: 5
});
```

### Export and Share Logs
```typescript
// Download logs
const json = ErrorLogger.exportLogs();
// Save to file or share with team
```

### Common Error Patterns

**Prisma Errors:**
```typescript
// P2002: Unique constraint violation
// P2025: Record not found
// P1001: Can't reach database

if (error.code === 'P2002') {
  logDatabaseError(error, 'create', 'User');
}
```

**Fetch Errors:**
```typescript
// TypeError: Failed to fetch
// AbortError: The user aborted a request

if (error.name === 'AbortError') {
  logApiError(error, endpoint, 'GET', 0);
}
```

## Integration with External Services

### Sentry Integration (Future)
```typescript
// lib/error-logger.ts
private static sendToExternalService(log: ErrorLog): void {
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(new Error(log.message), {
      level: log.severity,
      tags: { category: log.category },
      extra: log.context,
    });
  }
}
```

### LogRocket Integration (Future)
```typescript
if (typeof LogRocket !== 'undefined') {
  LogRocket.error(log.message, log);
}
```

## Testing Error Pages

### Test Standard Error
```typescript
// In any page
throw new Error("Test error");
```

### Test 404
Navigate to any non-existent route: `/test-404`

### Test Global Error
Create an error in `app/layout.tsx` or provider

## FAQ

**Q: Why don't I see stack traces in production?**
A: Stack traces are hidden in production for security. Error digests are provided instead.

**Q: How do I clear error logs?**
A: Use `ErrorLogger.clearLogs()` in console or click "Clear All" in Error Dashboard.

**Q: Can I send errors to Sentry/LogRocket?**
A: Yes, implement the integration in `sendToExternalService()` method in error-logger.ts.

**Q: How many errors are kept in memory?**
A: Last 100 errors in memory, last 50 in localStorage (dev only).

**Q: Do error pages work without JavaScript?**
A: Global error page works without JS (server-rendered), standard error page requires JS for full features.

## Support

For questions or issues with the error system:
- Check browser console for detailed logs
- Export error logs and share with team
- Contact dev team on Discord
- Review this documentation

## Related Files

- `app/error.tsx` - Standard error page
- `app/global-error.tsx` - Global error page  
- `app/not-found.tsx` - 404 page
- `lib/error-logger.ts` - Error logging utility
- `components/ErrorDashboard.tsx` - Error monitoring dashboard
