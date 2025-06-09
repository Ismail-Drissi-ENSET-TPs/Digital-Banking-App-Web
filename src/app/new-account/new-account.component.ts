import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {
  formGroup!: FormGroup;
  customers: Customer[] = [];
  customerId?: number;
  customer?: Customer;
  errorMessage?: string;
  successMessage?: string;

  accountTypes = [
    { value: 'CURRENT_ACCOUNT', label: 'Current Account' },
    { value: 'SAVING_ACCOUNT', label: 'Saving Account' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private accountsService: AccountsService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if customerId is provided in route params
    this.customerId = this.route.snapshot.params['customerId'];
    
    this.formGroup = this.formBuilder.group({
      customerId: this.formBuilder.control(this.customerId || null, [Validators.required]),
      accountType: this.formBuilder.control('CURRENT_ACCOUNT', [Validators.required]),
      initialBalance: this.formBuilder.control(0, [Validators.required, Validators.min(0)])
    });

    this.loadCustomers();
    
    if (this.customerId) {
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Error loading customers';
      }
    });
  }

  loadCustomer(id: number): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.errorMessage = 'Error loading customer';
      }
    });
  }

  onCustomerChange(): void {
    const selectedCustomerId = this.formGroup.get('customerId')?.value;
    if (selectedCustomerId) {
      this.loadCustomer(selectedCustomerId);
    }
  }

  handleCreateAccount(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      
      this.accountsService.createAccount(
        formValue.customerId,
        formValue.accountType,
        formValue.initialBalance
      ).subscribe({
        next: (account) => {
          this.successMessage = `Account ${account.id} created successfully!`;
          this.errorMessage = undefined;
          this.formGroup.reset();
          this.formGroup.patchValue({
            accountType: 'CURRENT_ACCOUNT',
            initialBalance: 0
          });
          
          // Navigate to customer accounts page after 2 seconds
          setTimeout(() => {
            this.router.navigateByUrl(`/admin/customer-accounts/${formValue.customerId}`);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating account:', error);
          this.errorMessage = 'Error creating account. Please try again.';
          this.successMessage = undefined;
        }
      });
    }
  }

  cancel(): void {
    if (this.customerId) {
      this.router.navigateByUrl(`/admin/customer-accounts/${this.customerId}`);
    } else {
      this.router.navigateByUrl('/admin/customers');
    }
  }
}
