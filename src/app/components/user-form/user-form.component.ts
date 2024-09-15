import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  title: string = 'É seu primeiro acesso? Cadastre-se';
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
