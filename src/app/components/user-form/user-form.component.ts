import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  onSubmit() {
    const formData = this.userForm.value;
    if (formData.password === formData.confirmPassword) {
      window.alert('Senhas são iguais');

      const body = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      this.http
        .post('https://664d0a0cede9a2b556527d60.mockapi.io/api/v1/users', body)
        .subscribe(
          (response) => {
            window.alert(`Dados enviados com sucesso, ${response}`);
          },
          (error) => {
            window.alert(`'Erro ao enviar dados', ${error}`);
          }
        );
    } else if (formData.password !== formData.confirmPassword) {
      window.alert('Senhas não conferem');
    }
    // window.alert(`dados do formulário : ${formData.name}, ${formData.phoneNumber}, ${formData.email}, ${formData.password}, ${formData.confirmPassword}`)
  }
}
