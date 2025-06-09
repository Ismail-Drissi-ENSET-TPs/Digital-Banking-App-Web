# HTTP Interceptors Documentation

## Overview
This document describes the HTTP interceptors implemented in the digital banking web application to handle authentication, logging, loading states, and error handling.

## Interceptors Chain

The interceptors are executed in the following order:

1. **Logging Interceptor** - Logs HTTP requests and responses
2. **Loading Interceptor** - Shows/hides global loading state
3. **Retry Interceptor** - Handles automatic retries for failed requests
4. **App HTTP Interceptor** - Adds authorization headers and handles auth errors

## 1. App HTTP Interceptor (`app-http.interceptor.ts`)

### Purpose
- Adds authorization headers to all HTTP requests
- Handles authentication and authorization errors
- Manages different content types

### Features
- **Authorization Header**: Automatically adds `Bearer {token}` to all requests except public URLs
- **Public URLs**: Skips authentication for login, register, and public endpoints
- **Content Type Management**: Handles JSON, FormData, and URL-encoded content types
- **Error Handling**: 
  - 401 (Unauthorized): Logs out user and redirects to login
  - 403 (Forbidden): Redirects to not-authorized page
  - Network errors: Logs error details

### Configuration
```typescript
// Public URLs that don't need authentication
const publicUrls = [
  '/auth/login',
  '/auth/register', 
  '/auth/forgot-password',
  '/public'
];
```

## 2. Logging Interceptor (`logging.interceptor.ts`)

### Purpose
- Logs HTTP requests and responses for debugging
- Tracks request duration
- Identifies which user made the request

### Features
- **Request Logging**: Logs method, URL, headers, body, and user
- **Response Logging**: Logs status, duration, and response body
- **Security**: Masks authorization headers and skips sensitive URLs
- **Performance Tracking**: Measures request duration

### Configuration
```typescript
// URLs that won't be logged for security
const sensitiveUrls = [
  '/auth/login', 
  '/auth/change-password', 
  '/users/change-password'
];
```

### Example Output
```
🌐 HTTP GET /api/customers
📤 Request: {
  method: "GET",
  url: "/api/customers",
  headers: { "Content-Type": "application/json" },
  user: "admin"
}
📥 Response: {
  status: 200,
  duration: "245ms",
  body: [...]
}
```

## 3. Loading Interceptor (`loading.interceptor.ts`)

### Purpose
- Shows global loading spinner during HTTP requests
- Manages loading state across multiple concurrent requests

### Features
- **Global Loading**: Shows spinner overlay during requests
- **Request Counting**: Tracks multiple concurrent requests
- **Selective Loading**: Skips loading for certain URLs (heartbeat, refresh)
- **Automatic Cleanup**: Hides loading when all requests complete

### Configuration
```typescript
// URLs that won't trigger loading spinner
const skipLoadingUrls = [
  '/auth/refresh',
  '/heartbeat',
  '/ping'
];
```

## 4. Retry Interceptor (`retry.interceptor.ts`)

### Purpose
- Automatically retries failed HTTP requests
- Implements exponential backoff strategy

### Features
- **Smart Retry Logic**: Only retries GET requests and network/server errors
- **Exponential Backoff**: Increases delay between retries (1s, 2s, 4s, max 10s)
- **Limited Retries**: Maximum 3 retry attempts
- **Error Filtering**: Only retries 5xx server errors and network errors (status 0)

### Configuration
```typescript
// Request methods that won't be retried
const noRetryMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

// URLs that won't be retried
const noRetryUrls = ['/auth/login', '/auth/logout'];
```

## 5. Loading Service (`loading.service.ts`)

### Purpose
- Manages global loading state
- Provides observable for loading status

### Features
- **Request Counting**: Tracks active requests
- **Observable State**: Reactive loading state
- **Force Hide**: Emergency stop for loading state

### Usage
```typescript
// In components
constructor(public loadingService: LoadingService) {}

// In templates
<div *ngIf="loadingService.loading$ | async">Loading...</div>
```

## 6. Loading Component (`loading.component.ts`)

### Purpose
- Displays global loading overlay
- Provides consistent loading UI

### Features
- **Overlay Design**: Full-screen overlay with backdrop blur
- **Responsive**: Works on all screen sizes
- **Accessible**: Includes screen reader support

## Configuration in App Config

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(withInterceptors([
      loggingInterceptor,    // First: Log requests
      loadingInterceptor,    // Second: Show loading state  
      retryInterceptor,      // Third: Handle retries
      appHttpInterceptor     // Last: Add auth headers
    ]))
  ]
};
```

## Error Handling Flow

1. **Network Error (status 0)**:
   - Retry interceptor attempts up to 3 retries
   - App interceptor logs error
   - Loading interceptor hides spinner

2. **401 Unauthorized**:
   - App interceptor logs out user
   - Redirects to login page
   - Loading interceptor hides spinner

3. **403 Forbidden**:
   - App interceptor redirects to not-authorized page
   - Loading interceptor hides spinner

4. **5xx Server Error**:
   - Retry interceptor attempts retries
   - If all retries fail, error is propagated
   - Loading interceptor hides spinner

## Security Considerations

- **Token Security**: Authorization headers are masked in logs
- **Sensitive URLs**: Login and password change requests are not logged
- **Automatic Logout**: Invalid tokens trigger automatic logout
- **CORS Handling**: Proper error handling for CORS issues

## Performance Features

- **Request Deduplication**: Loading service handles concurrent requests
- **Exponential Backoff**: Prevents server overload during retries
- **Selective Logging**: Reduces console noise in production
- **Efficient Loading**: Minimal UI updates for loading states

## Development vs Production

### Development Mode
- Full request/response logging
- Detailed error messages
- Loading indicators for all requests

### Production Mode
- Reduced logging (can be configured)
- Error messages without sensitive data
- Optimized loading states

## Troubleshooting

### Common Issues

1. **Loading Spinner Stuck**:
   ```typescript
   // Force hide loading
   loadingService.forceHide();
   ```

2. **Too Many Logs**:
   - Add URLs to `sensitiveUrls` in logging interceptor

3. **Unwanted Retries**:
   - Add URLs to `noRetryUrls` in retry interceptor

4. **Missing Auth Headers**:
   - Check if URL is in `publicUrls` list
   - Verify token is available in AuthService

## Testing

### Unit Testing Interceptors
```typescript
// Example test for auth interceptor
it('should add authorization header', () => {
  const token = 'test-token';
  spyOn(authService, 'getAccessToken').and.returnValue(token);
  
  const req = new HttpRequest('GET', '/api/test');
  const next = jasmine.createSpy().and.returnValue(of({}));
  
  appHttpInterceptor(req, next);
  
  expect(next).toHaveBeenCalledWith(
    jasmine.objectContaining({
      headers: jasmine.objectContaining({
        Authorization: `Bearer ${token}`
      })
    })
  );
});
```

## Best Practices

1. **Order Matters**: Interceptors execute in the order they're provided
2. **Error Handling**: Always handle errors appropriately
3. **Performance**: Avoid heavy operations in interceptors
4. **Security**: Never log sensitive information
5. **Testing**: Write unit tests for interceptor logic
