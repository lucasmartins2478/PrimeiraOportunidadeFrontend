import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { CompanyRegisterComponent } from './components/company-register/company-register.component';
import { CurriculumRegisterComponent } from './components/curriculum-register/curriculum-register.component';
import { JobRegisterComponent } from './components/job-register/job-register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ArticleComponent } from './components/article/article.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    CompanyRegisterComponent,
    CurriculumRegisterComponent,
    JobRegisterComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    JobsComponent,
    CompaniesComponent,
    CarouselComponent,
    ArticleComponent,
    UserFormComponent,
    UserRegisterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
