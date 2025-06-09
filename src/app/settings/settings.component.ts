import { Component, OnInit } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  successMessage: string | undefined;
  errorMessage: string | undefined;

  // App data
  appVersion = '1.0.0';
  selectedTheme = 'light';

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.selectedTheme = savedTheme;
    }
  }

  selectTheme(theme: string): void {
    this.selectedTheme = theme;
    // Save immediately to localStorage
    localStorage.setItem('selectedTheme', theme);
    this.successMessage = `Mode ${theme === 'light' ? 'clair' : 'sombre'} activé`;
    this.clearMessagesAfterDelay();
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = undefined;
      this.errorMessage = undefined;
    }, 2000);
  }
}
