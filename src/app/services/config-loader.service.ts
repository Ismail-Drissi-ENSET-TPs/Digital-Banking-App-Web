import { Injectable } from '@angular/core';
// No need for HttpClient

// Importing the file statically (bundled at build time)
import configJson from '../../../assets/config.json'; // adjust path if needed

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any = configJson;

  constructor() {}

  // This is no longer asynchronous
  loadConfig() {
    return Promise.resolve(); // To keep compatibility
  }

  get backendHost(): string {
    return this.config?.backendHost
      ? `http://${this.config.backendHost}:${this.config.backendPort}`
      : 'http://localhost:8082';
  }
}
