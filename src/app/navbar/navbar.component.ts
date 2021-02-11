import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout(): void {
    const logout = this.authService.logout().pipe(take(1));
    logout.subscribe(success => {
      if (success) {
        this.router.navigate(['/movies']);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}