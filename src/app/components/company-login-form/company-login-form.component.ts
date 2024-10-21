import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICompany } from '../../models/company.interface';

@Component({
  selector: 'app-company-login-form',
  templateUrl: './company-login-form.component.html',
  styleUrls: ['./company-login-form.component.css'],
})
export class CompanyLoginFormComponent implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const apiUrl = 'http://localhost:3333/companies';

      this.http.get<ICompany[]>(apiUrl).subscribe(
        (response) => {
          const company = response.find((comp) => comp.email === formData.user);
          if (company && company.password === formData.password) {
            this.alertMessage = `Seja bem-vindo(a) ${company.responsible}`;
            this.alertClass = 'alert alert-success';
            this.alertTitle = 'Sucesso';
            this.alertIconClass = 'bi bi-check-circle';
            this.showAlert = true;
            this.resetAlertAfterDelay();

            setTimeout(() => {
              this.authService.loginCompany(company);

              // Navega para a próxima página
              this.router.navigate(['/minhas-vagas']);
            }, 2000);
            // Armazena os dados da empresa no AuthService
          } else {
            this.alertMessage = 'Usuário ou senha incorretos!';
            this.alertClass = 'alert alert-danger';
            this.alertTitle = 'Erro';
            this.alertIconClass = 'bi bi-x-circle';
            this.showAlert = true;
            this.resetAlertAfterDelay();
          }
        },
        (error) => {
          window.alert(`Erro ao buscar dados, ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
