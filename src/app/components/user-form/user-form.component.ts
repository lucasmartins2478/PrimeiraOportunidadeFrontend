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
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router) {}

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
      window.alert('Dados corretos');
      const formData = this.userForm.value;
      if (formData.password === formData.confirmPassword) {
        const body = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        };
        this.http
          .post<any[]>(
            'https://664d0a0cede9a2b556527d60.mockapi.io/api/v1/users',
            body
          )
          .subscribe(
            (response) => {

              this.router.navigate(['/login'])
              // response.forEach(user =>{
              //   if(user.email == formData.email){
              //     window.alert("Este email já pertence a um usuário cadastrado!")
              //   }
              // })
            },
            (error) => {
              window.alert(`'Erro ao enviar dados', ${error}`);
            }
          );
      } else if (formData.password !== formData.confirmPassword) {
        window.alert('Senhas não conferem');
      }
    } else {
      window.alert('Preencha os campos corretamente!');
    }
  }
}
