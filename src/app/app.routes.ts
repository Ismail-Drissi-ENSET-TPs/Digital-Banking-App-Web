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

export const routes: Routes = [
  {
    path: "", redirectTo: "/login", pathMatch:"full"
  },
  {
    path: "login", component: LoginComponent
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
      }
    ]
  },
  {
    path:"not-authorized", component: NotAuthorizedComponent
  }
];
