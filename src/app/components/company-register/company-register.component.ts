import { Component } from '@angular/core';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.css'
})
export class CompanyRegisterComponent {
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
