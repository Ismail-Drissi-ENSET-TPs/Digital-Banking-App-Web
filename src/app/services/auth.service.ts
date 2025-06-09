import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from './config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';
  private platformId = inject(PLATFORM_ID);
  private apiUrl: string;

  isAuthenticated: boolean = false;
  roles: Array<string> | undefined;
  username: string | undefined;
  private token: string | null = null;

  constructor(private httpClient: HttpClient, private config: ConfigService) {
    config.loadConfig();
    this.apiUrl = config.backendHost;

    // Only try to restore from localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = this.getAccessToken();
      if (storedToken) {
        this.loadProfileFromToken(storedToken);
      }
    }
  }

  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    }
    let params = new HttpParams().set("username", username).set("password", password);
    return this.httpClient.post(`${this.apiUrl}/auth/login`, params, options);
  }

  public loadProfile(data: any) {
    const token = data["access-token"];
    if (token) {
      this.token = token;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      }
      this.loadProfileFromToken(token);
    }
  }

  public getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      console.log('🔑 Getting token from localStorage:', token ? 'Token exists' : 'No token found');
      return token;
    }
    console.log('🔑 Getting token from memory:', this.token ? 'Token exists' : 'No token found');
    return this.token;
  }

  private loadProfileFromToken(token: string) {
    this.isAuthenticated = true;
    const decoded: any = jwtDecode(token);
    this.username = decoded.sub;
    this.roles = decoded.scope;
  }

  public logout() {
    this.isAuthenticated = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    this.token = null;
    this.username = undefined;
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  // Diagnostic method
  public debugAuthStatus(): void {
    console.log('🔍 Auth Service Debug Status:');
    console.log('  - isAuthenticated:', this.isAuthenticated);
    console.log('  - username:', this.username);
    console.log('  - roles:', this.roles);
    console.log('  - token in memory:', this.token ? 'EXISTS' : 'NULL');

    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      console.log('  - token in localStorage:', storedToken ? 'EXISTS' : 'NULL');

      if (storedToken) {
        try {
          const decoded: any = jwtDecode(storedToken);
          console.log('  - token decoded:', decoded);
          console.log('  - token expires:', new Date(decoded.exp * 1000));
          console.log('  - token is expired:', decoded.exp * 1000 < Date.now());
        } catch (error) {
          console.error('  - token decode error:', error);
        }
      }
    }
  }
}
