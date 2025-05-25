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
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
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
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.token = null;
    this.username = undefined;
  }
}
