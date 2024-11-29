import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/auth/auth.service';
import { UserFormService } from '../../services/user/user-form.service';
import { IUser } from '../../models/user.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isProfileMenuOpen: boolean = false;
  userType: string | null = null;
  hasCurriculum: boolean = false;
  userData!: IUser;

  constructor(
    private authService: UserAuthService,
    private userService: UserFormService
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType(); // Obtém o tipo de usuário

    if (this.userType === 'user') {
      const userId = this.authService.getUserData()?.id; // Obtém o ID do usuário logado

      if (userId) {
        this.loadUserData(userId);
      }
    }
  }

  // Função que carrega os dados do usuário
  loadUserData(userId: number): void {
    this.userService.getUserData(userId).subscribe(
      (userData) => {
        // Se os dados do usuário forem encontrados
        this.userData = userData;

        // Verifica se o curriculumId é válido
        if (this.userData && this.userData.curriculumId) {
          this.hasCurriculum = true;
        } else {
          this.hasCurriculum = false;
        }

        console.log('User data loaded from database:', this.userData);
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
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
