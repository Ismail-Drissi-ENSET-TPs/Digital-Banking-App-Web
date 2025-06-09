import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-customer',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css',
  providers: [
    CustomerService
  ],
  standalone: true
})
export class EditCustomerComponent implements OnInit {
  formGroup: FormGroup | undefined;
  customerId: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];

    this.formGroup = this.formBuilder.group({
      id: [this.customerId],
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });

    if (this.customerId) {
      // Fetch customer data to populate the form
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (customer) => {
          if (this.formGroup) {
            this.formGroup.setValue({
              id: customer.id,
              name: customer.name,
              email: customer.email
            });
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error loading customer data');
        }
      });
    }
  }


  public handleUpdateCustomer(): void {
    if (this.formGroup?.valid) {
      let customer: Customer = this.formGroup.value;
      this.customerService.updateCustomer(customer).subscribe({
        next: () => {
          alert("Customer updated successfully");
          this.router.navigateByUrl('/admin/customers');
        },
        error: (error) => {
          console.error(error);
          alert("Error updating customer");
        }
      });
    }
  }
}
