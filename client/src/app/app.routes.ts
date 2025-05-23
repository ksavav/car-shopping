import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {RegisterComponent} from './account/register/register.component';
import {LoginComponent} from './account/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {AboutComponent} from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'about', component: AboutComponent },
  // { path: 'catalog/product/:id', component:  },
  // { path: 'catalog/edit/:id', component:  },
  // { path: 'profile', component:  },
  // { path: 'vin', component:  }
];
