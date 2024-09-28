import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isProfileMenuOpen: boolean = false;
  userType: string | null = null;

  constructor(private authService: UserAuthService) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.userType = null;
    // Pode redirecionar o usuário após logout, se necessário
  }
}
