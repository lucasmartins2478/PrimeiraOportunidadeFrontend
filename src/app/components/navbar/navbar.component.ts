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

  ngOnInit() {
    this.userType = this.authService.getUserType();

    if (this.userType === 'user') {
      const id = this.authService.getUserData()?.id;  // Pegue o ID do usuário autenticado
      if (id) {
        // Verifique se o usuário tem um currículo
        const curriculum = this.authService.getUserData()?.curriculumId
        if(curriculum !== null && curriculum !== undefined){
          this.hasCurriculum = true
        }else{
          this.hasCurriculum = false
        }
        console.log(this.hasCurriculum)
        console.log(this.authService.getUserData()?.curriculumId)
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
