import { Injectable } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { ICompany } from '../../models/company.interface';


@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private user: IUser | null = null;
  private company: ICompany | null = null;

  constructor() {}

  login(user: IUser) {
    this.user = user;
    // Armazenar o tipo do usuário
    localStorage.setItem('userType', 'user');
  }

  loginCompany(company: ICompany) {
    this.company = company;
    // Armazenar o tipo da empresa
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
