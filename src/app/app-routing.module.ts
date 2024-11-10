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
import { CompanyLoginComponent } from './pages/company-login/company-login.component';
import { Section1Component } from './pages/section-1/section-1.component';
import { Section2Component } from './pages/section-2/section-2.component';
import { Section3Component } from './pages/section-3/section-3.component';
import { Section4Component } from './pages/section-4/section-4.component';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'empresas', component: CompaniesComponent },
  { path: 'vagas', component: JobsComponent },
  { path: 'criar-conta', component: UserRegisterComponent },
  { path: 'para-empresas', component: CompanyRegisterComponent },
  { path: 'login/empresa', component: CompanyLoginComponent },
  { path: 'recuperar-senha', component: ForgotPasswordComponent },
  {
    path: 'minhas-candidaturas',
    component: ApplicationsComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'minhas-vagas',
    component: MyJobsComponent,
    canActivate: [AuthGuard, CompanyGuard],
  },
  { path: 'login/candidato', component: LoginComponent },
  { path: 'comunidade', component: CommunityComponent },
  {
    path: 'criar-curriculo/etapa1',
    component: CurriculumStep1Component,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'criar-curriculo/etapa2',
    component: CurriculumStep2Component,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'criar-curriculo/etapa3',
    component: CurriculumStep3Component,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'criar-curriculo/etapa4',
    component: CurriculumStep4Component,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'criar-vaga',
    component: JobRegisterComponent,
    canActivate: [AuthGuard, CompanyGuard],
  },
  {
    path: 'criar-vaga/:id',
    component: JobRegisterComponent,
    canActivate: [AuthGuard, CompanyGuard],
  },
  { path: 'realize-login', component: NotAuthenticadedComponent },
  { path: 'comunidade/seção1', component: Section1Component },
  { path: 'comunidade/seção2', component: Section2Component },
  { path: 'comunidade/seção3', component: Section3Component },
  { path: 'comunidade/seção4', component: Section4Component },
  {
    path: 'comunidade/chat',
    component: ChatComponent,
    canActivate: [AuthGuard, UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
