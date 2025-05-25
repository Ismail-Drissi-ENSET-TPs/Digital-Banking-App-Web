import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AccountDetails} from "../models/account.model";
import {BankAccountDTO} from "../models/bank-account.model";
import {ConfigService} from './config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {
    config.loadConfig();
    this.apiUrl = config.backendHost;
  }

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.apiUrl}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`);
  }

  public debit(accountId: string, amount: number, description: string) {
    let data = { accountId, amount, description };
    return this.http.post(`${this.apiUrl}/accounts/debit`, data);
  }

  public credit(accountId: string, amount: number, description: string) {
    let data = { accountId, amount, description };
    return this.http.post(`${this.apiUrl}/accounts/credit`, data);
  }

  public transfer(accountSource: string, accountDestination: string, amount: number, description: string) {
    let data = { senderAccountId: accountSource, receiverAccountId: accountDestination, balance: amount, description };
    return this.http.post(`${this.apiUrl}/accounts/transfer`, data);
  }

  public getAccounts(): Observable<Array<AccountDetails>> {
    return this.http.get<Array<AccountDetails>>(`${this.apiUrl}/accounts/histories`);
  }

  public getCustomerAccounts(customerId: number): Observable<Array<BankAccountDTO>> {
    return this.http.get<Array<BankAccountDTO>>(`${this.apiUrl}/customer/${customerId}/accounts`);
  }
}
