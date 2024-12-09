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
    if (!user || !user.id) {
      console.error('Erro: Usuário inválido.');
      return;
    }

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

    if (user.curriculumId) {
      localStorage.setItem('curriculumId', user.curriculumId.toString());
    }

    if (user.name) {
      localStorage.setItem('name', user.name);
    }

    if (user.email) {
      localStorage.setItem('email', user.email);
    }

    if (user.phoneNumber) {
      localStorage.setItem('phoneNumber', user.phoneNumber);
    }
  }
  // Dentro do UserAuthService
  // Dentro do UserAuthService
private curriculumIdChangeCallbacks: ((curriculumId: number | null) => void)[] = [];

// Adiciona um callback para escutar alterações no curriculumId
subscribeToCurriculumIdChange(callback: (curriculumId: number | null) => void): () => void {
  this.curriculumIdChangeCallbacks.push(callback);

  // Retorna uma função para desinscrição
  return () => {
    this.curriculumIdChangeCallbacks = this.curriculumIdChangeCallbacks.filter(
      (cb) => cb !== callback
    );
  };
}


// Atualiza o curriculumId e notifica os inscritos
updateCurriculumUser(curriculumId: number ): void {
  if (this.user) {
    this.user.curriculumId = curriculumId;
    this.saveUserDataToStorage(this.user); // Atualiza o LocalStorage
  }

  // Notifica todos os callbacks
  this.curriculumIdChangeCallbacks.forEach((callback) => callback(curriculumId));
}

refreshUserData(): void {
  this.user = this.getUserDataFromStorage();
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
    const curriculumId = Number(localStorage.getItem('curriculumId'));
    const id = Number(localStorage.getItem('id'));

    if (name && email && phoneNumber && id > 0 && curriculumId) {
      // Verificando se o id é válido
      return {
        name,
        email,
        phoneNumber,
        id,
        curriculumId,
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
    localStorage.removeItem('curriculumId');
  }

  // Função pública para obter dados do usuário (pode ser chamada a partir de um componente)
  getUserData(): IUser | null {
    return this.user;
  }

  // Função pública para obter dados da empresa (pode ser chamada a partir de um componente)
  getCompanyData(): ICompany | null {
    return this.company;
  }

  async saveCurriculum(userId: number): Promise<void> {
    const apiUrl = `https://backend-production-ff1f.up.railway.app/users/${userId}/curriculum`;

    const body = {
      curriculumId: userId,
    };

    try {
      const response = await this.http.put<IUser>(apiUrl, body).toPromise();
    } catch (error) {}
  }

  async hasCurriculum(userId: number | undefined): Promise<boolean> {
    const apiUrl = `https://backend-production-ff1f.up.railway.app/users/${userId}`;

    try {
      const response = await lastValueFrom(this.http.get<IUser>(apiUrl));
      if (response.curriculumId != null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Erro ao buscar usuários: ${error}`);
      return false;
    }
  }
}
