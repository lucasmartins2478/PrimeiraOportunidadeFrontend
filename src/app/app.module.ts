import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { CompanyRegisterComponent } from './components/company-register/company-register.component';
import { CurriculumRegisterComponent } from './components/curriculum-register/curriculum-register.component';
import { JobRegisterComponent } from './components/job-register/job-register.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    UserRegisterComponent,
    CompanyRegisterComponent,
    CurriculumRegisterComponent,
    JobRegisterComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
