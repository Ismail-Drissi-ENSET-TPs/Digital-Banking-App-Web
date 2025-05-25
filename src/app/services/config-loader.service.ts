import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(config => this.config = config);
  }

  get backendHost(): string {
    return this.config?.backendHost
      ? `http://${this.config.backendHost}:${this.config.backendPort}`
      : 'http://localhost:8082';  }
}
