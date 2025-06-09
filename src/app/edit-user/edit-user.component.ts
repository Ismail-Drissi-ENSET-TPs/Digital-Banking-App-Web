import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User, UpdateUserRequest } from '../services/user.service';
import { NgIf, NgForOf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, DatePipe],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  formGroup!: FormGroup;
  user?: User;
  userId!: number;
  errorMessage?: string;
  successMessage?: string;
  isLoading = false;

  availableRoles = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Administrator' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = parseInt(this.route.snapshot.params['id']);
    
    this.formGroup = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      roles: this.formBuilder.control([], [Validators.required])
    });

    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.formGroup.patchValue({
          username: user.username,
          email: user.email,
          roles: user.roles
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage = 'Error loading user';
        this.isLoading = false;
      }
    });
  }

  handleUpdateUser(): void {
    if (this.formGroup.valid && this.user) {
      this.isLoading = true;
      this.errorMessage = undefined;
      this.successMessage = undefined;

      const formValue = this.formGroup.value;
      const updateRequest: UpdateUserRequest = {
        id: this.user.id,
        username: formValue.username,
        email: formValue.email,
        roles: formValue.roles
      };

      this.userService.updateUser(updateRequest).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.successMessage = `User ${updatedUser.username} updated successfully!`;
          this.user = updatedUser;
          
          // Redirect to user management after 2 seconds
          setTimeout(() => {
            this.router.navigateByUrl('/admin/users');
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating user:', error);
          
          if (error.status === 400) {
            this.errorMessage = 'Username or email already exists';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found';
          } else {
            this.errorMessage = 'Error updating user. Please try again.';
          }
        }
      });
    }
  }

  onRoleChange(event: any, roleValue: string): void {
    const currentRoles = this.formGroup.get('roles')?.value || [];
    
    if (event.target.checked) {
      if (!currentRoles.includes(roleValue)) {
        currentRoles.push(roleValue);
      }
    } else {
      const index = currentRoles.indexOf(roleValue);
      if (index > -1) {
        currentRoles.splice(index, 1);
      }
    }
    
    this.formGroup.patchValue({ roles: currentRoles });
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/users');
  }
}
