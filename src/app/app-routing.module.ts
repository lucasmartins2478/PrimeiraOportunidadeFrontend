import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
<<<<<<< HEAD
import { ApplicationsComponent } from './pages/applications/applications.component';
import { MyJobsComponent } from './pages/my-jobs/my-jobs.component';
=======
>>>>>>> 361e3ebf035404c0200c2f93f8802a79ffc51bb0


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"empresas", component:CompaniesComponent},
  {path:"vagas", component: JobsComponent},
  {path:"criar-conta", component: UserRegisterComponent},
  {path:"para-empresas", component: CompanyRegisterComponent},
<<<<<<< HEAD
  {path:"recuperar-senha", component: ForgotPasswordComponent},
  {path:"minhas-candidaturas", component: ApplicationsComponent},
  {path:"minhas-vagas", component:MyJobsComponent}
=======
  {path:"recuperar-senha", component: ForgotPasswordComponent}
>>>>>>> 361e3ebf035404c0200c2f93f8802a79ffc51bb0
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
