import { Component } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  title:string = "Seja-bem vindo(a) ao Primeira Oportunidade";
  userInput:string = "Usuário";
  passwordInput:string = "Senha";
  buttonText:string = "Entrar";
  useTermsText:string = "Termos de uso";
  forgotPassword:string= "Esqueceu sua senha?"


  login(){
    window.alert("Entrou")
  }
}
