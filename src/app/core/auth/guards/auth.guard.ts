import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      filter(user => user !== undefined),
      take(1),
      switchMap(user => {
        const isLoggedIn = !!user;
        if (!isLoggedIn) {
          if (state.url === '/enter') {
            return of(true);
          }
          this.router.navigate(['/enter']);
          return of(false);
        } else if (state.url === '/enter') {
          this.router.navigate(['/user']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
