import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formGroup: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void{
    this.formGroup = this.formBuilder.group({
      username: this.formBuilder.control(null, [Validators.required]),
      password: this.formBuilder.control(null, [Validators.required])
    })
  }


  handleLogin(){

     this.authService.login(this.formGroup?.value.username, this.formGroup?.value.password).subscribe(
       {
         next: value => {
           console.log(value)
           this.authService.loadProfile(value);
           this.router.navigateByUrl("/admin");
         }, error: err => {
           console.log(err);
         }
       }
     );

  }
}
