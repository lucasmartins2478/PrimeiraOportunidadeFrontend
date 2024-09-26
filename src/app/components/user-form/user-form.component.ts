import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFormServiceService } from "../../services/form/user-form-service.service"
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
    private router: Router,
    private userFormService: UserFormServiceService
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
      cpf:["", [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async onSubmit() {
    if (this.userForm.valid) {
      const apiUrl = 'http://localhost:3333/users';

      const formData = this.userForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyEmail(formData.email);
        if (exists) {
          this.alertMessage =
            'Endereço de email já vinculado à uma conta existente';
          this.alertType = 'danger';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          const body = {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
          };

          this.http.post<any[]>(apiUrl, body).subscribe(
            (response) => {
              this.userFormService.setFormData(this.userForm.value);
              this.alertMessage = 'Usuário cadastrado com sucesso!';
              this.alertType = 'success';
              this.showAlert = true;
              this.resetAlertAfterDelay();
              // this.router.navigate(['/login']);
            },
            (error) => {
              window.alert(`Erro ao cadastrar usuário ${error}`);
            }
          );
        }
      } else if (formData.password !== formData.confirmPassword) {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertType = 'danger';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }
    } else {
      this.alertMessage = 'Preencha os campos corretamente!';
      this.alertType = 'danger';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }
  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await this.http
        .get<any[]>('http://localhost:3333/users')
        .toPromise();

      if (response && Array.isArray(response)) {
        const emailExists = response.some((user) => user.email === email);
        return emailExists;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Erro ao buscar por emails cadastrados: ${error}`);
      return false;
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
