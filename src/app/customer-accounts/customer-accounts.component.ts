import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { BankAccountDTO, AccountOperationDTO, AccountHistoryDTO } from '../models/bank-account.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { catchError, Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    DecimalPipe,
    AsyncPipe
  ],
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: number;
  customer!: Customer;
  accounts: Array<BankAccountDTO> = [];
  errorMessage!: string;

  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountHistoryDTO>;
  selectedAccount!: BankAccountDTO;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    // Constructor
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('')
    });

    this.loadCustomer();
    this.loadCustomerAccounts();
  }

  loadCustomer() {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  loadCustomerAccounts() {
    this.accountsService.getCustomerAccounts(this.customerId).subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountsService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  viewAccountOperations(account: BankAccountDTO) {
    this.selectedAccount = account;
    this.accountFormGroup.patchValue({ accountId: account.id });
    this.handleSearchAccount();
  }
}
