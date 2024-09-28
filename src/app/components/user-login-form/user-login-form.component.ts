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
  alertType: 'success' | 'danger' = 'success';
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
      const apiUrl = 'http://localhost:3333/users';

      this.http.get<IUser[]>(apiUrl).subscribe(
        (response) => {
          const user = response.find((user) => user.email === formData.email);
          if (user && user.password === formData.password) {
            this.alertMessage = `Seja bem-vindo(a) ${user.name}`;
            this.alertType = 'success';
            this.showAlert = true;
            this.resetAlertAfterDelay();

            // Armazena os dados do usuário no AuthService
            this.authService.login(user);

            // Navega para a próxima página
            this.router.navigate(['/vagas']);
          } else {
            this.alertMessage = 'Usuário ou senha incorretos!';
            this.alertType = 'danger';
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
