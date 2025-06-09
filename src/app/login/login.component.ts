import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup | undefined;
  loading: boolean = false;
  errorMessage: string | undefined;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/admin');
      return;
    }

    this.formGroup = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  handleLogin(): void {
    if (!this.formGroup) {
      return;
    }

    const { username, password } = this.formGroup.value;

    // Simple validation - just check if fields are not empty
    if (!username || !password) {
      this.errorMessage = 'Veuillez saisir votre nom d\'utilisateur et mot de passe';
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = undefined;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.authService.loadProfile(response);

        // Add a small delay for better UX
        setTimeout(() => {
          this.router.navigateByUrl('/admin');
        }, 500);
      },
      error: (error) => {
        this.loading = false;

        // Handle different error types
        if (error.status === 401) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès refusé. Contactez l\'administrateur.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }





  private markFormGroupTouched(): void {
    Object.keys(this.formGroup?.controls || {}).forEach(key => {
      this.formGroup?.get(key)?.markAsTouched();
    });
  }


}
