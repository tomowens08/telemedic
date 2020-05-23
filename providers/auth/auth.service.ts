import {Injectable} from '@angular/core';
import {TokenService} from './token.service';
import {JwtHelper} from 'angular2-jwt';
import {Identity} from '../../models/identity';
import {isArray} from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {identity} from 'rxjs/util/identity';

@Injectable()
export class AuthService {
  private jwtHalper: JwtHelper = new JwtHelper();

  identity$: BehaviorSubject<Identity> = new BehaviorSubject<Identity>(new Identity());

  constructor(private _tokenService: TokenService) {
  }

  isAuthenticated(): Promise<boolean> {
    return this.getIdentity()
      .then(identity => {
        return identity.isAuthenticated;
      });
  }

  storeToken(token: string): Promise<Identity> {
    return this._tokenService
      .set(token)
      .then(() => this.updateIdentity());
  }

  logout(): Promise<any>{
    return this.removeToken();
  }

  isInRole(role : string): Promise<boolean>{
    return this.getIdentity().then(identity => {
      if(identity.isAuthenticated && identity.roles.find(r=> r == role)){
        return true;
      }
      return false;
    });
  }

  private updateIdentity(): Promise<Identity> {
    return this.getIdentity()
      .then(identity => {
        this.identity$.next(identity);
        return identity;
      });
  }

  private isValidToken(token: string): Promise<boolean> {
    let promise = new Promise<boolean>(resolve => {

      if (!token) {
        resolve(false);
        return promise;
      }

      let isValid = !this.jwtHalper.isTokenExpired(token);
      if (!isValid) {
        this.removeToken().then(() => resolve(false));
        return promise;
      }
      resolve(true);
    });
    return promise;
  }

  private getIdentity(): Promise<Identity> {
    return this._tokenService.get().then(token => {
        return this.isValidToken(token).then(isValid => {
            if (!isValid) {
              let identity = new Identity();
              console.log('identity', identity);
              return identity;
            }

            let parsedToken = this.jwtHalper.decodeToken(token);
            let identity: Identity = {
              id: parsedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
              name: parsedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
              tenantId: parsedToken['http://www.aspnetboilerplate.com/identity/claims/tenantId'],
              roles: [],
              isAuthenticated: true
            };

            let roles = parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            identity.roles = isArray(roles) ? roles : [roles];

            console.log('identity', identity);
            return identity;
          });
      });
  }

  private removeToken(): Promise<any> {
    return this._tokenService.clear()
      .then(() => this.updateIdentity());
  }
}
