import { Injectable } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { ICompany } from '../../models/company.interface';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private user: IUser | null = null;
  private company: ICompany | null = null;

  constructor(private http: HttpClient) {
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

  private saveCompanyDataToStorage(company: ICompany): void {
    localStorage.setItem('responsible', company.responsible);
    localStorage.setItem('companyName', company.name); // Usando 'companyName' para evitar conflito com 'name'
    localStorage.setItem('companyEmail', company.email);
    localStorage.setItem('companyId', company.id.toString());
  }

  private getUserDataFromStorage(): IUser | null {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const id = Number(localStorage.getItem('id'));

    if (name && email && phoneNumber && id > 0) { // Verificando se o id é válido
      return {
        name,
        email,
        phoneNumber,
        id,
      } as IUser;
    }
    return null;
  }

  private getCompanyDataFromStorage(): ICompany | null {
    const responsible = localStorage.getItem('responsible');
    const email = localStorage.getItem('companyEmail');
    const name = localStorage.getItem('companyName'); // Usando 'companyName' para evitar conflito com 'name'
    const id = Number(localStorage.getItem('companyId'));

    if (responsible && email && id > 0 && name) {
      return {
        responsible,
        email,
        id,
        name,
      } as ICompany;
    }
    return null;
  }

  private clearUserDataFromStorage(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('id');
    localStorage.removeItem('companyName'); // Removendo 'companyName'
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

  async hasCurriculum(userId: number | undefined): Promise<boolean> {
    const apiUrl = `https://backend-production-ff1f.up.railway.app/users/${userId}`;

    try {
      const response = await lastValueFrom(this.http.get<IUser>(apiUrl));
      if(response.curriculumId != null){
        return true
      }
      else{
        return false
      }
    } catch (error) {
      console.log(`Erro ao buscar usuários: ${error}`);
      return false;
    }
  }
}
