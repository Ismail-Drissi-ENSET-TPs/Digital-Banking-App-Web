import { Routes } from '@angular/router';
import {AccountsComponent} from './accounts/accounts.component';
import {CustomersComponent} from './customers/customers.component';
import {NewCustomerComponent} from './new-customer/new-customer.component';
import {LoginComponent} from './login/login.component';
import {AdminTemplateComponent} from './admin-template/admin-template.component';
import {authenticationGuard} from './guards/authentication.guard';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {authorizationGuard} from './guards/authorization.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EditCustomerComponent} from './edit-customer/edit-customer.component';
import {loginRedirectGuard} from './guards/login-redirect.guard';
import {CustomerAccountsComponent} from './customer-accounts/customer-accounts.component';

export const routes: Routes = [
  {
    path: "", redirectTo: "/login", pathMatch:"full"
  },
  {
    path: "login", component: LoginComponent, canActivate: [loginRedirectGuard]
  },
  {
    path: "admin", component: AdminTemplateComponent, canActivate: [authenticationGuard], children:[
      {
        path:"", component: DashboardComponent
      },
      {
        path:"customers", component: CustomersComponent
      },
      {
        path:"accounts", component: AccountsComponent
      },
      {
        path:"new-customer", component: NewCustomerComponent, canActivate: [authorizationGuard]
      },
      {
        path:"edit-customer/:id", component: EditCustomerComponent, canActivate: [authorizationGuard]
      },
      {
        path:"customer-accounts/:id", component: CustomerAccountsComponent
      }
    ]
  },
  {
    path:"not-authorized", component: NotAuthorizedComponent
  }
];
