import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from "@angular/router";
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-template',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent implements OnInit {
  sidebarCollapsed = false;
  activeSubmenu: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Auto-collapse sidebar on mobile
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubmenu(menu: string): void {
    this.activeSubmenu = this.activeSubmenu === menu ? null : menu;
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 768) {
      this.sidebarCollapsed = true;
    }
  }
}
