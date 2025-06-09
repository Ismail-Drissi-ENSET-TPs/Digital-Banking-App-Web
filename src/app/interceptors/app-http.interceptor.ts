import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Enable debug mode to see detailed logs
const DEBUG_MODE = true; // Set to false in production

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // URLs that don't need authentication
  const publicUrlPatterns = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/public'
  ];



  // Static assets that don't need authentication
  const assetPatterns = [
    '/assets/', '.json', '.css', '.js', '.ico',
    '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.woff', '.woff2', '.ttf', '.eot'
  ];

  // Check if this is a public endpoint
  const isPublicEndpoint = publicUrlPatterns.some(pattern => req.url.includes(pattern));

  console.log('🔍 isPublicEndpoint:', isPublicEndpoint, 'for URL:', req.url);


  // Check if this is an asset request
  const isAssetRequest = assetPatterns.some(pattern => req.url.includes(pattern));

  // Check if this is an external URL
  const apiUrl = authService.getApiUrl();
  const isExternalUrl = req.url.startsWith('http') && !req.url.includes(apiUrl);

  if (DEBUG_MODE) {
    console.log(`🔍 URL Analysis for: ${req.url}`);
    console.log(`   API URL: ${apiUrl}`);
    console.log(`   Is Public: ${isPublicEndpoint}`);
    console.log(`   Is Asset: ${isAssetRequest}`);
    console.log(`   Is External: ${isExternalUrl}`);
  }

  // Determine if we should add auth header
  const shouldAddAuth = !isPublicEndpoint && !isAssetRequest && !isExternalUrl;

  let modifiedRequest = req;

  if (shouldAddAuth) {
    const token = authService.getAccessToken();
    if (token) {
      modifiedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      if (DEBUG_MODE) {
        console.log(`🔐 Adding auth header to: ${req.method} ${req.url}`);
      }
    } else {
      if (DEBUG_MODE) {
        console.warn(`⚠️ No token available for: ${req.method} ${req.url}`);
      }
    }
  } else {
    if (DEBUG_MODE) {
      console.log(`🌐 Skipping auth header for: ${req.method} ${req.url} (public: ${isPublicEndpoint}, asset: ${isAssetRequest}, external: ${isExternalUrl})`);
    }
  }

  if (DEBUG_MODE) {
    console.log(`📋 Final request details:`, {
      method: req.method,
      url: req.url,
      hasAuthHeader: modifiedRequest.headers.has('Authorization'),
      shouldAddAuth,
      isPublicEndpoint,
      isAssetRequest,
      isExternalUrl
    });
  }

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (DEBUG_MODE) {
        console.error(`❌ HTTP Error for ${req.method} ${req.url}:`, error);
      }

      // Handle authentication errors
      if (error.status === 401) {
        console.warn('🚫 Unauthorized access - redirecting to login');
        authService.logout();
        router.navigateByUrl('/login');
      } else if (error.status === 403) {
        console.warn('🚫 Forbidden access - redirecting to not authorized page');
        router.navigateByUrl('/not-authorized');
      }

      return throwError(() => error);
    })
  );
};
