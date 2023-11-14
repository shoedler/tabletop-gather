import { Route } from '@angular/router';
import { UserManagementComponent } from './components/organisms/user-management.component';
import { LoginManagementComponent } from './components/organisms/login-management.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginManagementComponent,
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
];
