import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { IUser } from '../../models/user.interface';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css'],
})
export class UserLoginFormComponent implements OnInit {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/users';

      // Recupera tentativas falhas e bloqueio do localStorage
      const failedAttempts = Number(localStorage.getItem('failedAttempts') || 0);
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

      this.http.get<IUser[]>(apiUrl).subscribe(
        (response) => {
          const user = response.find((user) => user.email === formData.email);
          if (user) {
            if (user.password === formData.password) {
              // Reset no sucesso
              localStorage.removeItem('failedAttempts');
              localStorage.removeItem('lockUntil');

              this.alertMessage = `Seja bem-vindo(a) ${user.name}`;
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();

              setTimeout(() => {
                // Armazena os dados do usuário no AuthService
                this.authService.login(user);
                // Navega para a próxima página após o tempo do alerta
                this.router.navigate(['/vagas']);
              }, 2000);
            } else {
              // Incrementa tentativas falhas
              const newFailedAttempts = failedAttempts + 1;
              localStorage.setItem('failedAttempts', String(newFailedAttempts));

              if (newFailedAttempts >= 3) {
                const lockTime = 15 * 60 * 1000; // 15 minutos em milissegundos
                const unlockTime = now + lockTime;
                localStorage.setItem('lockUntil', String(unlockTime));
                localStorage.setItem('failedAttempts', '0'); // Reseta as tentativas após bloqueio

                this.alertMessage = 'Muitas tentativas falhas. Conta bloqueada por 15 minutos.';
                this.alertClass = 'alert alert-danger';
                this.alertTitle = 'Erro';
                this.alertIconClass = 'bi bi-x-circle';
                this.showAlert = true;
                this.resetAlertAfterDelay();
              } else {
                this.alertMessage = `Senha incorreta. Você tem mais ${3 - newFailedAttempts} tentativa(s).`;
                this.alertClass = 'alert alert-danger';
                this.alertTitle = 'Erro';
                this.alertIconClass = 'bi bi-x-circle';
                this.showAlert = true;
                this.resetAlertAfterDelay();
              }
            }
          } else {
            this.alertMessage = 'O email informado está incorreto!';
            this.alertClass = 'alert alert-danger';
            this.alertTitle = 'Erro';
            this.alertIconClass = 'bi bi-x-circle';
            this.showAlert = true;
            this.resetAlertAfterDelay();
          }
        },
        (error) => {
          window.alert(`Erro ao buscar dados: ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Preencha os campos antes de fazer login!';
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
