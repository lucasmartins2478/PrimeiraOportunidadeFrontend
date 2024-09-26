import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  constructor(private authService: AuthService){}
  
  isAuthenticated() {
    return this.authService.getIsAuthenticated();
  }
  ngOnInit(): void {
      console.log("iniciando componente navbar")
  }
}
