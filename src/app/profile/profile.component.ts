import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  // Simple profile data
  userName = 'John Doe';
  userRole = 'ADMIN';

  constructor(
    public authService: AuthService
  ) {
    console.log(this.authService.username);

  }

  ngOnInit(): void {
    // Load user data from auth service if available
    if (this.authService.username) {
      this.userName = this.authService.username;
      this.userRole = this.authService.roles?.[0] || 'USER';
    }
  }

  get userInitials(): string {
    const names = this.userName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return this.userName.substring(0, 2).toUpperCase();
  }
}
