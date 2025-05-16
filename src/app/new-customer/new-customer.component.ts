import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css',
  providers: [
    CustomerService
  ]
})
export class NewCustomerComponent {
  formGroup: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: this.formBuilder.control(null, [Validators.required, Validators.minLength(4)]),
      email: this.formBuilder.control(null, [Validators.required, Validators.email])
    })
  }

  public handleSaveCustomer(): void {
    let customer: Customer = this.formGroup?.value;
    this.customerService.saveCustomer(customer).subscribe({
      next: (value) => {
        alert("Customer is saved successfully");
        this.formGroup?.reset();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
