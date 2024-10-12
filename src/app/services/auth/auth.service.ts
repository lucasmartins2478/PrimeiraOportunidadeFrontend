import { Injectable } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { ICompany } from '../../models/company.interface';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private user: IUser | null = null;
  private company: ICompany | null = null;

  constructor() {
    const userType = this.getUserType();
    if (userType === 'user') {
      this.user = this.getUserDataFromStorage();
    } else if (userType === 'company') {
      this.company = this.getCompanyDataFromStorage();
    }

    // Validação adicional:
    if (!this.user && userType === 'user') {
      console.warn('Dados do usuário não encontrados no localStorage.');
    }
    if (!this.company && userType === 'company') {
      console.warn('Dados da empresa não encontrados no localStorage.');
    }
  }


  login(user: IUser) {
    console.log('Dados do usuário durante o login:', user); // Verificar o objeto
    this.user = user;
    localStorage.setItem('userType', 'user');
    this.saveUserDataToStorage(user); // Salvar dados no localStorage ao logar
  }


  loginCompany(company: ICompany) {
    this.company = company;
    localStorage.setItem('userType', 'company');
    this.saveCompanyDataToStorage(company); // Salvar dados no localStorage ao logar
  }

  logout() {
    this.user = null;
    this.company = null;
    localStorage.removeItem('userType');
    this.clearUserDataFromStorage(); // Limpar dados do localStorage ao deslogar
  }

  isAuthenticated(): boolean {
    return this.user !== null || this.company !== null;
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  // Função para salvar dados do usuário no localStorage
  private saveUserDataToStorage(user: IUser): void {
    if (user.id !== undefined && user.id !== null) {
      localStorage.setItem('id', user.id.toString());
    } else {
      console.error('Erro: O ID do usuário está indefinido ou nulo.');
    }

    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
    localStorage.setItem('phoneNumber', user.phoneNumber);
  }

  // Função para salvar dados da empresa no localStorage
  private saveCompanyDataToStorage(company: ICompany): void {
    localStorage.setItem('responsible', company.name);
    localStorage.setItem('companyEmail', company.email);
    localStorage.setItem('companyId', company.id.toString());
    // Adicione outros campos relevantes aqui
  }

  // Função para obter dados do usuário do localStorage
  private getUserDataFromStorage(): IUser | null {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const id = Number(localStorage.getItem('id'))

    if (name && email && phoneNumber && id) {
      return {
        name,
        email,
        phoneNumber,
        id
      } as IUser;
    }
    return null; // Caso algum dado esteja faltando
  }

  // Função para obter dados da empresa do localStorage
  private getCompanyDataFromStorage(): ICompany | null {
    const responsible = localStorage.getItem('responsible');
    const email = localStorage.getItem('companyEmail');
    const id = Number(localStorage.getItem('companyId'))
    if (responsible && email && id) {
      return {
        responsible,
        email,
        id
      } as ICompany;
    }
    return null; // Caso algum dado esteja faltando
  }

  // Função para limpar dados do localStorage ao deslogar
  private clearUserDataFromStorage(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('id');
    localStorage.removeItem('responsible');
    localStorage.removeItem('companyEmail');
    localStorage.removeItem('companyId');
  }

  // Função pública para obter dados do usuário (pode ser chamada a partir de um componente)
  getUserData(): IUser | null {
    return this.user;
  }

  // Função pública para obter dados da empresa (pode ser chamada a partir de um componente)
  getCompanyData(): ICompany | null {
    return this.company;
  }
}
