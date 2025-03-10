import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importando o FormsModule
import { BrowserModule } from '@angular/platform-browser';
import { CompanyRegisterComponent } from './pages/company-register/company-register.component';
import { AppRoutingModule, routes } from './app-routing.module';
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
import { CurriculumStep1Component } from './pages/curriculum-step-1/curriculum-step-1.component';
import { CurriculumStep2Component } from './pages/curriculum-step-2/curriculum-step-2.component';
import { CurriculumStep3Component } from './pages/curriculum-step-3/curriculum-step-3.component';
import { CurriculumStep4Component } from './pages/curriculum-step-4/curriculum-step-4.component';
import { CurriculumForm1Component } from './components/curriculum-form-1/curriculum-form-1.component';
import { CurriculumForm2Component } from './components/curriculum-form-2/curriculum-form-2.component';
import { CurriculumForm3Component } from './components/curriculum-form-3/curriculum-form-3.component';
import { CurriculumForm4Component } from './components/curriculum-form-4/curriculum-form-4.component';
import { JobRegisterComponent } from './pages/job-register/job-register.component';
import { NotAuthenticadedComponent } from './pages/not-authenticaded/not-authenticaded.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CompanyLoginComponent } from './pages/company-login/company-login.component';
import { SectionCardComponent } from './components/section-card/section-card.component';
import { Section1Component } from './pages/section-1/section-1.component';
import { Section2Component } from './pages/section-2/section-2.component';
import { Section3Component } from './pages/section-3/section-3.component';
import { Section4Component } from './pages/section-4/section-4.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
    CurriculumStep1Component,
    CurriculumStep2Component,
    CurriculumStep3Component,
    CurriculumStep4Component,
    CurriculumForm1Component,
    CurriculumForm2Component,
    CurriculumForm3Component,
    CurriculumForm4Component,
    JobRegisterComponent,
    NotAuthenticadedComponent,
    CompanyLoginComponent,
    SectionCardComponent,
    Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,
    ChatComponent,
    ChatMessageComponent,
    AboutUsComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Adiciona essa linha
    }),
  ],
  exports:[RouterModule],
  providers: [provideAnimationsAsync(), provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
