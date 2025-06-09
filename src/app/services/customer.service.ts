import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';
import {ConfigService} from './config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {
    config.loadConfig();
    this.apiUrl = config.backendHost;
  }

  public getCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(`${this.apiUrl}/customers`);
  }

  public searchCustomers(keyword: string = ""): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(`${this.apiUrl}/customer/search?k=${keyword}`);
  }

  public getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${id}`);
  }

  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customer/`, customer);
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customer/`, customer);
  }

  public deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/${customerId}`);
  }
}
