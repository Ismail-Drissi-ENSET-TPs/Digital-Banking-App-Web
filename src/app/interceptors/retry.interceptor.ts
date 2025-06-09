import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer, mergeMap, throwError } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Don't retry certain types of requests
  const noRetryMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  const noRetryUrls = ['/auth/login', '/auth/logout'];
  
  const shouldRetry = !noRetryMethods.includes(req.method) && 
                     !noRetryUrls.some(url => req.url.includes(url));

  if (!shouldRetry) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry on network errors or 5xx server errors
        if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
          const delayMs = Math.min(1000 * Math.pow(2, retryCount - 1), 10000); // Exponential backoff, max 10s
          console.warn(`Retrying request (attempt ${retryCount}/3) after ${delayMs}ms:`, req.url);
          return timer(delayMs);
        }
        
        // Don't retry for client errors (4xx)
        return throwError(() => error);
      }
    })
  );
};
