import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customers: any;

  constructor(private http: HttpClient) {
  }

  public getCustomers(): Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>("http://localhost:8082/customers");
  }

  public searchCustomers(keyword:String = ""): Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>("http://localhost:8082/customers/search?k="+keyword);
  }

  public saveCustomer(customer: Customer): Observable<Customer>{
    return this.http.post<Customer>("http://localhost:8082/customer/", customer);
  }

  public deleteCustomer(customerId: Number){
    return this.http.delete("http://localhost:8082/customer/"+customerId);
  }
}
