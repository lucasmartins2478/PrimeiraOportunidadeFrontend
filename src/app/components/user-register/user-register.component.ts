import { Component } from '@angular/core';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
})
export class UserRegisterComponent {
  title: string = 'Cadastre-se';
  nameLabel: string = 'Nome';
  phoneNumberLabel: string = 'Telefone';
  passwordLabel: string = 'Senha';
  emailLabel: string = 'Email';
  genderLabel: string = 'Gênero';
  cityLabel: string = 'Cidade';
  dateOfBirthLabel: string = 'Data de nascimento';
  registerButtonText: string = 'Cadastrar';

  registerUser() {}
}
