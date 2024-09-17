import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
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
    MyJobsComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
