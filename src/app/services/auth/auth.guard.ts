import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: UserAuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private authService: UserAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getUserType() === 'user') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CompanyGuard implements CanActivate {
  constructor(private authService: UserAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getUserType() === 'company') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
