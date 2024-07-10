import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private auth: ApiService, private cookieService:CookieService)
  {}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cookieValue = this.cookieService.get('token');
    return new Promise((resolve, reject) => {
      this.auth.get("user", cookieValue).subscribe(
        response => {
          if (response.data.active) {
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            reject(false)
          }
        },
        error => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
            resolve(false)
          } else {
            reject(error);
          }
        }
      );
    });
  }
}
