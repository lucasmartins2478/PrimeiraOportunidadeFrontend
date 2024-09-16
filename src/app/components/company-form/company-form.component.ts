import { Component } from '@angular/core';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent {
  title:string = "Cadastre-se";
  companyNameLabel:string = "Nome da empresa";
  companyEmailLabel:string = "Email corporativo";
  companyPasswordLabel:string = "Senha";
  companyPhoneNumberLabel:string = "Número de Telefone";
  companyAddressLabel:string = "Endereço";
  companyCityLabel:string = "Cidade";
  companyCnpjLabel:string = "CNPJ";


  registerCompany(){
    window.alert("Cadastrado")
  }
}
