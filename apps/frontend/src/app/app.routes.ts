import { Route } from '@angular/router';
import { CollectionComponent } from './components/pages/collection.component';
import { EventsComponent } from './components/pages/events.component';
import { FourOhFourComponent } from './components/pages/four-oh-four.component';
import { LandingPageComponent } from './components/pages/landing-page.component';
import { LoginComponent } from './components/pages/login.component';
import { ProfileComponent } from './components/pages/profile.component';
import { SampleDesignComponent } from './components/pages/sample-design.component';
import { UsersComponent } from './components/pages/users.component';
import {
  ROUTE_COLLECTION,
  ROUTE_DESIGN,
  ROUTE_EVENTS,
  ROUTE_LOGIN,
  ROUTE_PROFILE,
  ROUTE_USER_MANAGEMENT,
} from './constants';
import { isAuthenticatedOrRedirectToLogin } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
  },
  {
    path: ROUTE_LOGIN,
    component: LoginComponent,
  },
  {
    path: ROUTE_EVENTS,
    component: EventsComponent,
    canActivate: [isAuthenticatedOrRedirectToLogin],
  },
  {
    path: ROUTE_COLLECTION,
    component: CollectionComponent,
    canActivate: [isAuthenticatedOrRedirectToLogin],
  },
  {
    path: ROUTE_PROFILE,
    component: ProfileComponent,
    canActivate: [isAuthenticatedOrRedirectToLogin],
  },
  {
    path: ROUTE_USER_MANAGEMENT,
    component: UsersComponent,
    canActivate: [isAuthenticatedOrRedirectToLogin],
  },
  {
    path: ROUTE_DESIGN,
    component: SampleDesignComponent,
    canActivate: [isAuthenticatedOrRedirectToLogin],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: FourOhFourComponent,
  },
];
