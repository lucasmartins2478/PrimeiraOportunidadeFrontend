import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.css',
})
export class UserLoginFormComponent implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
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

      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          response.forEach((user) => {

            if(user.email == formData.email){
              if(user.password == formData.password){
                window.alert('Usuário e senha corretos!');
                this.router.navigate(['/vagas']);
              }
              else{
                window.alert("Senha não confere!")
              }
            }
          });

        },
        (error) => {
          window.alert(`Erro ao buscar dados, ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Erro ao cadastrar o usuário.';
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
