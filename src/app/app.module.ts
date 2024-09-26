import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { CommunityComponent } from './pages/community/community.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { CurriculumFormComponent } from './components/curriculum-form/curriculum-form.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { ArticleUserComponent } from './components/article-user/article-user.component';
import { ArticleCompanyComponent } from './components/article-company/article-company.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { MyJobsComponent } from './pages/my-jobs/my-jobs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JobCardComponent } from './components/job-card/job-card.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { CompanyLoginFormComponent } from './components/company-login-form/company-login-form.component';
import { UserLoginFormComponent } from './components/user-login-form/user-login-form.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';
import { AlertComponent } from './components/alert/alert.component';
import { CurriculumRegisterComponent } from './pages/curriculum-register/curriculum-register.component';
import { CurriculumStep1Component } from './pages/curriculum-step-1/curriculum-step-1.component';
import { CurriculumStep2Component } from './pages/curriculum-step-2/curriculum-step-2.component';
import { CurriculumStep3Component } from './pages/curriculum-step-3/curriculum-step-3.component';
import { CurriculumStep4Component } from './pages/curriculum-step-4/curriculum-step-4.component';
import { CurriculumForm1Component } from './components/curriculum-form-1/curriculum-form-1.component';
import { CurriculumForm2Component } from './components/curriculum-form-2/curriculum-form-2.component';
import { CurriculumForm3Component } from './components/curriculum-form-3/curriculum-form-3.component';
import { CurriculumForm4Component } from './components/curriculum-form-4/curriculum-form-4.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    JobsComponent,
    CompaniesComponent,
    CarouselComponent,
    UserFormComponent,
    UserRegisterComponent,
    CommunityComponent,
    CompanyFormComponent,
    CurriculumFormComponent,
    JobFormComponent,
    CompanyRegisterComponent,
    ArticleUserComponent,
    ArticleCompanyComponent,
    ForgotPasswordComponent,
    ForgotPasswordFormComponent,
    ApplicationsComponent,
    MyJobsComponent,
    JobCardComponent,
    SearchFormComponent,
    LoginComponent,
    CompanyLoginFormComponent,
    UserLoginFormComponent,
    CompanyCardComponent,
    AlertComponent,
    CurriculumRegisterComponent,
    CurriculumStep1Component,
    CurriculumStep2Component,
    CurriculumStep3Component,
    CurriculumStep4Component,
    CurriculumForm1Component,
    CurriculumForm2Component,
    CurriculumForm3Component,
    CurriculumForm4Component,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
