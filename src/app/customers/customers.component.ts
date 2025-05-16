import { Component } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../models/customer.model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
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
  searchFormGroup: FormGroup | undefined;

  constructor(private customerService: CustomerService, private formBuilder: FormBuilder) {

  }

  ngOnInit(){
    this.searchFormGroup = this.formBuilder.group(
      {
        keyword: this.formBuilder.control("")
      }
    )
    this.searchCustomers();
  }

  searchCustomers(){
    let keyword: String = this.searchFormGroup?.value.keyword;
    this.customerService.searchCustomers(keyword).subscribe({
        next: (data) => {
          this.customers = data;
        },
        error: err => {
          this.errorMessage = err.message;
        }
      }
    )
  }

  deleteCustomer(c: Customer){
    this.customerService.deleteCustomer(c.id).subscribe({
      next:()=>{

      }, error: (err)=>{
        console.log(err);
      }
    })
  }

}
