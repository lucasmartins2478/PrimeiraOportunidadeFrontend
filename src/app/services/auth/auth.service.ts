import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private userData: any; // Variável para armazenar os dados do usuário

  constructor() {}

  login(user: any) {
    this.isAuthenticated = true;
    this.userData = user; // Armazena os dados do usuário
  }

  logout() {
    this.isAuthenticated = false;
    this.userData = null; // Limpa os dados do usuário ao fazer logout
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getUserData() {
    return this.userData; // Retorna os dados do usuário
  }
}
