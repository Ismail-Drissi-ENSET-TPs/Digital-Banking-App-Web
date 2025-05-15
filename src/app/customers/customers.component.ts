import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../models/customer.model';

@Component({
  selector: 'app-customers',
  imports: [
    NgIf,
    NgForOf,
    HttpClientModule,
  ],
  providers:[
    CustomerService
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {

  customers: Array<Customer> | undefined;
  errorMessage: string | undefined;

  constructor(private customerService: CustomerService) {

  }

  ngOnInit(){
    this.customerService.getCustomers().subscribe({
        next: (data) => {
          this.customers = data;
        },
        error: err => {
          this.errorMessage = err.message;
        }
      }
    )
  }

}
