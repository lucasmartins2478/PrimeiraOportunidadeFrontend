import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(12),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      const apiUrl = 'http://localhost:3333/users';

      const formData = this.userForm.value;
      if (formData.password === formData.confirmPassword) {
        const body = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        };

        this.http.post<any[]>(apiUrl, body).subscribe(
          (response) => {
            this.alertMessage = 'Usuário cadastrado com sucesso!';
            this.alertType = 'success';
            this.showAlert = true;
            this.resetAlertAfterDelay();
            // this.router.navigate(['/login']);
          },
          (error) => {
            this.alertMessage = 'Erro ao cadastrar o usuário.';
            this.alertType = 'danger';
            this.showAlert = true;
            this.resetAlertAfterDelay();
          }
        );
      } else if (formData.password !== formData.confirmPassword) {
        this.alertMessage = 'Erro ao cadastrar o usuário.';
        this.alertType = 'danger';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }
    } else {
      this.alertMessage = 'Erro ao cadastrar o usuário.';
      this.alertType = 'danger';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }
  verifyEmail(email: string) {
    const formData = this.userForm.value;
    this.http.get<any[]>('http://localhost:3333/users').subscribe(
      (response) => {
        response.forEach((user) => {
          if (user.email == formData.email) {
            console.log('Ola!!');
          }
        });
      },
      (error) => {
        console.log(`Erro ao buscar por emails cadastrados, ${error}`);
      }
    );
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
