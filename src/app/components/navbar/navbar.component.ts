import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isProfileMenuOpen = false

  constructor(private authService: AuthService){}

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen; // Alternar visibilidade do menu
  }

  isAuthenticated() {
    return this.authService.getIsAuthenticated();
  }
  ngOnInit(): void {
      console.log("iniciando componente navbar")
  }
}
