import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginSignUpPageComponent } from './login-sign-up-page/login-sign-up-page.component';

const routes: Routes = [
  {path : '', component : LoginSignUpPageComponent},
  {path : 'dashboard', component : DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
