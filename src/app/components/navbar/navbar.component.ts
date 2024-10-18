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
  hasCurriculum: boolean = false;

  constructor(private authService: UserAuthService) {}

  async ngOnInit(): Promise<void> {
    this.userType = this.authService.getUserType();

    if (this.userType === 'user') {
      const id = this.authService.getUserData()?.id;  // Pegue o ID do usuário autenticado
      if (id) {
        // Verifique se o usuário tem um currículo
        this.hasCurriculum = await this.authService.hasCurriculum(id);
      }
    }
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
