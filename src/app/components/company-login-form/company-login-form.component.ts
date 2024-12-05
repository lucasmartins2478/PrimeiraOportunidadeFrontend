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
  // Atributos de exibição do alerta

  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  // Atributo do formulário

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: UserAuthService
  ) {}

  // Inicializa o formulário de login vazio na tela

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Função que valida se os dados fornecidos são
  // válidos verificando as informações no banco de dados

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/companies';

      // Recupera tentativas falhas e bloqueio do localStorage
      const failedAttempts = Number(
        localStorage.getItem('failedAttempts') || 0
      );
      const lockUntil = localStorage.getItem('lockUntil');
      const now = Date.now();

      // Verifica se o usuário está bloqueado
      if (lockUntil && now < Number(lockUntil)) {
        const remainingTime = Math.ceil((Number(lockUntil) - now) / 1000);
        this.alertMessage = `Conta bloqueada. Tente novamente em ${remainingTime} segundos.`;
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
        return;
      }

      this.http.get<ICompany[]>(apiUrl).subscribe(
        (response) => {
          const company = response.find((comp) => comp.email === formData.user);
          if (company && company.password === formData.password) {
            localStorage.removeItem('failedAttempts');
            localStorage.removeItem('lockUntil');

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
            const newFailedAttempts = failedAttempts + 1;
            localStorage.setItem('failedAttempts', String(newFailedAttempts));

            if (newFailedAttempts >= 3) {
              const lockTime = 15 * 60 * 1000; // 15 minutos em milissegundos
              const unlockTime = now + lockTime;
              localStorage.setItem('lockUntil', String(unlockTime));
              localStorage.setItem('failedAttempts', '0'); // Reseta as tentativas após bloqueio

              this.alertMessage =
                'Muitas tentativas falhas. Conta bloqueada por 15 minutos.';
              this.alertClass = 'alert alert-danger';
              this.alertTitle = 'Erro';
              this.alertIconClass = 'bi bi-x-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            } else {
              this.alertMessage = `Senha incorreta. Você tem mais ${
                3 - newFailedAttempts
              } tentativa(s).`;
              this.alertClass = 'alert alert-danger';
              this.alertTitle = 'Erro';
              this.alertIconClass = 'bi bi-x-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            }
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

  // Função que remove o alerta da tela após 3 segundos

  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Função que limpa os dados do alerta

  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
