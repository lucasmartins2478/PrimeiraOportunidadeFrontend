import { ParseSourceFile } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {

  users = [
    {user:"lucas", password:"senhaLucas"},
    {user:"laysa", password:"senhaLaysa"}
  ]

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  @Input() title: string = '';

  onSubmit() {
    const formData = this.loginForm.value;
    let isLogged:boolean = false

    this.users.forEach((user)=>{
      if(user.user === formData.user && user.password === formData.password){
        isLogged = true
      }
    })
    if(isLogged){
      window.alert("Usuário encontrado")
      this.router.navigate(["/vagas"])
    }else{
      window.alert("Usuário não encontrado")
    }
    // window.alert(`dados do formulário : ${formData.user}, ${formData.password}`);
    // this.router.navigate(['/vagas']);
  }
}
