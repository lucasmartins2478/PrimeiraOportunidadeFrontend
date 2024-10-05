import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { MyJobsComponent } from './pages/my-jobs/my-jobs.component';
import { LoginComponent } from './pages/login/login.component';
import { CommunityComponent } from './pages/community/community.component';
import { CurriculumStep1Component } from './pages/curriculum-step-1/curriculum-step-1.component';
import { CurriculumStep4Component } from './pages/curriculum-step-4/curriculum-step-4.component';
import { CurriculumStep2Component } from './pages/curriculum-step-2/curriculum-step-2.component';
import { CurriculumStep3Component } from './pages/curriculum-step-3/curriculum-step-3.component';
import { JobRegisterComponent } from './pages/job-register/job-register.component';
import { AuthGuard, CompanyGuard, UserGuard } from './services/auth/auth.guard';
import { NotAuthenticadedComponent } from './pages/not-authenticaded/not-authenticaded.component';


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"empresas", component:CompaniesComponent},
  {path:"vagas", component: JobsComponent},
  {path:"criar-conta", component: UserRegisterComponent},
  {path:"para-empresas", component: CompanyRegisterComponent},
  {path:"recuperar-senha", component: ForgotPasswordComponent},
  {path:"minhas-candidaturas", component: ApplicationsComponent, canActivate: [AuthGuard, UserGuard]},
  {path:"minhas-vagas", component:MyJobsComponent, /*canActivate: [AuthGuard, CompanyGuard]*/},
  {path:"login", component:LoginComponent},
  {path:"comunidade", component: CommunityComponent},
  {path:"criar-curriculo/etapa1", component: CurriculumStep1Component, canActivate: [AuthGuard, UserGuard]},
  {path:"criar-curriculo/etapa2", component: CurriculumStep2Component, canActivate: [AuthGuard, UserGuard]},
  {path:"criar-curriculo/etapa3", component: CurriculumStep3Component, canActivate: [AuthGuard, UserGuard]},
  {path:"criar-curriculo/etapa4", component: CurriculumStep4Component, canActivate: [AuthGuard, UserGuard]},
  {path:"criar-vaga", component: JobRegisterComponent, /*canActivate: [AuthGuard, CompanyGuard]*/},
  {path:"realize-login", component: NotAuthenticadedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
