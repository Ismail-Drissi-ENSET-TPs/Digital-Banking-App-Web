import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const startTime = Date.now();

  // Don't log sensitive requests in production
  const sensitiveUrls = ['/auth/login', '/auth/change-password', '/users/change-password'];
  const isSensitive = sensitiveUrls.some(url => req.url.includes(url));

  if (!isSensitive) {
    console.group(`🌐 HTTP ${req.method} ${req.url}`);
    console.log('📤 Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys().reduce((acc, key) => {
        // Don't log authorization header for security
        if (key.toLowerCase() !== 'authorization') {
          acc[key] = req.headers.get(key);
        } else {
          acc[key] = '***';
        }
        return acc;
      }, {} as any),
      body: req.body,
      user: authService.username || 'Anonymous'
    });
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse && !isSensitive) {
          const duration = Date.now() - startTime;
          console.log('📥 Response:', {
            status: event.status,
            statusText: event.statusText,
            duration: `${duration}ms`,
            body: event.body
          });
          console.groupEnd();
        }
      },
      error: (error) => {
        if (!isSensitive) {
          const duration = Date.now() - startTime;
          console.error('❌ Error Response:', {
            status: error.status,
            statusText: error.statusText,
            duration: `${duration}ms`,
            error: error.error,
            message: error.message
          });
          console.groupEnd();
        }
      }
    })
  );
};
