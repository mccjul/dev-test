import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { myConfig } from './auth.config';

declare var Auth0Lock: any;

@Injectable()
export class Auth {
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, {});

  userProfile: any;

  constructor(private router: Router) {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          alert(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;

        const redirectUrl: string = localStorage.getItem('redirect_url');
        if (redirectUrl !== undefined) {
          this.router.navigate([redirectUrl]);
          localStorage.removeItem('redirect_url');
        }
      });
    });
  }

  public login() {
    this.lock.show();
  };

  public authenticated() {
    return tokenNotExpired();
  };

  public isProperPermission(permission: String): boolean {
    return permission === '' || this.userProfile.app_metadata.authorization.roles.indexOf(permission) !== -1;

      // var Permission = {
      //   admin: (role) => ['admin', ''].indexOf(role) > -1,
      //   undefined: (role) => [''].indexOf(role) > -1
      // }[this.userProfile.app_metadata.authorization.roles](permission);
  }

  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
    this.router.navigate(['']);
  };
};
