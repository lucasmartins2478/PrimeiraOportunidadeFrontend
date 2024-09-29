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
    // Verificar se há algum usuário logado no localStorage ao iniciar
    const userType = this.getUserType();
    if (userType === 'user') {
      // Simulando a recuperação do usuário logado do localStorage (você pode substituir por uma chamada de API real se necessário)
      this.user = { /* dados do usuário */ } as IUser;
    } else if (userType === 'company') {
      // Simulando a recuperação da empresa logada do localStorage
      this.company = { /* dados da empresa */ } as ICompany;
    }
  }

  login(user: IUser) {
    this.user = user;
    localStorage.setItem('userType', 'user');
  }

  loginCompany(company: ICompany) {
    this.company = company;
    localStorage.setItem('userType', 'company');
  }

  logout() {
    this.user = null;
    this.company = null;
    localStorage.removeItem('userType');
  }

  isAuthenticated(): boolean {
    return this.user !== null || this.company !== null;
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }
}
