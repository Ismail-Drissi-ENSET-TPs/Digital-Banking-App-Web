import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
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

}
