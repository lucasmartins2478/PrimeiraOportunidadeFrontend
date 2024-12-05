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
  userData!: IUser | null;
  isMenuOpen = false;



  constructor(
    private authService: UserAuthService,
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType(); // Obtém o tipo de usuário

    if (this.userType === 'user') {
      this.loadUserData();
      this.hasCurriculum =
        this.authService.getUserData()?.curriculumId !== null;
    }
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Função que carrega os dados do usuário
  loadUserData() {
    this.userData = this.authService.getUserData();
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
