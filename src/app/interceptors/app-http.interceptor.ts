import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = authService.getAccessToken()
  if (token) {
    const newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(newRequest);
  }

  return next(req);
};
