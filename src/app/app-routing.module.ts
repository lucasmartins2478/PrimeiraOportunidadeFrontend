import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"empresas", component:CompaniesComponent},
  {path:"vagas", component: JobsComponent},
  {path:"criar-conta", component: UserRegisterComponent},
  {path:"para-empresas", component: CompanyRegisterComponent},
  {path:"recuperar-senha", component: ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
