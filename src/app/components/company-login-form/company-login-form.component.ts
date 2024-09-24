import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-login-form',
  templateUrl: './company-login-form.component.html',
  styleUrl: './company-login-form.component.css'
})
export class CompanyLoginFormComponent implements OnInit {
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
      user: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {


    if ( this.loginForm.valid){
      window.alert("Dados corretos")
    }else{
      window.alert("Dados incorretos")
    }
    // const formData = this.loginForm.value;
    // let isLogged: boolean = false;

    // const apiUrl = 'https://664d0a0cede9a2b556527d60.mockapi.io/api/v1/users';

    // // Fazendo a requisição GET
    // this.http.get<any[]>(apiUrl).subscribe(
    //   (response) => {


    //     response.forEach(user=>{
    //       if(user.email == formData.user && user.password == formData.password){
    //         window.alert("usuário e senha corretos")
    //         this.router.navigate(['/vagas']);
    //       }
    //     })
    //   },
    //   (error) => {
    //     window.alert(`Erro ao buscar dados, ${error}`);
    //   }
    // );
    // window.alert(`dados do formulário : ${formData.user}, ${formData.password}`);
    // this.router.navigate(['/vagas']);
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
