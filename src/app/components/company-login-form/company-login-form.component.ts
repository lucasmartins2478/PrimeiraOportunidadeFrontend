import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-login-form',
  templateUrl: './company-login-form.component.html',
  styleUrl: './company-login-form.component.css',
})
export class CompanyLoginFormComponent implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      const apiUrl = 'http://localhost:3333/companies';

      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          response.forEach((user) => {
            if (user.email === formData.user) {
              if (user.password === formData.password) {
                this.alertMessage = `Seja bem-vindo(a) ${user.responsible}`;
                this.alertType = 'success';
                this.showAlert = true;
                this.resetAlertAfterDelay();

                // Armazena os dados do usuário no AuthService
                // Navega para a próxima página (descomente se necessário)
                // this.router.navigate(['/vagas']);
              } else {
                this.alertMessage = 'Usuário ou senha incorretos!';
                this.alertType = 'danger';
                this.showAlert = true;
                this.resetAlertAfterDelay();
              }
            } else {
              this.alertMessage = 'Usuário ou senha incorretos!';
              this.alertType = 'danger';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            }
          });
        },
        (error) => {
          window.alert(`Erro ao buscar dados, ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertType = 'danger';
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
