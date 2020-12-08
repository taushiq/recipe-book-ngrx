import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

export interface AuthResponse{
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : string
  }

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user))
    return new AuthActions.AuthenticateSuccess({email: email, userId: userId, token: token, expirationDate:expirationDate, redirect: true })
}

const handleError = (errRes: any) => {

    let error = "An unkown Error occured!";
                    if(!errRes.error || !errRes.error.error){
                        return of(new AuthActions.AuthenticateFail(error));
                    }
                    switch(errRes.error.error.message){
                        case 'EMAIL_EXISTS' :
                        error = "Email id already exists!";
                        break;
                        case 'EMAIL_NOT_FOUND' :
                        error = "Invalid Email Id"
                        break;
                        case 'INVALID_PASSWORD':
                        error = "Invalid Password"
                        break;

                    }

                    return of(new AuthActions.AuthenticateFail(error));
}


@Injectable()
export class AuthEffects{

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction : AuthActions.SignupStart)=>{
            return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
                }).pipe(tap(
                    resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }
                ),map(respData => {
                    return handleAuthentication(+respData.expiresIn, respData.email, respData.localId, respData.idToken);
                }),catchError(errRes => {
                    return handleError(errRes);
                }))
        })
    );



    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart)=>{
            return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, 
                {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
                }).pipe(tap(
                    resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }
                ),map(respData => {
                    return handleAuthentication(+respData.expiresIn, respData.email, respData.localId, respData.idToken);
                }),catchError(errRes => {
                    return handleError(errRes);
                }))
        }),

    );

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
        const userData : {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
          } = JSON.parse(localStorage.getItem('userData'));
      
          if(!userData){
            return { type: 'DUMMY' };
          }
      
          const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      
          if(loadedUser.token){
              const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
              this.authService.setLogoutTimer(expirationDuration);
            // this.user.next(loadedUser);
            return new AuthActions.AuthenticateSuccess({email: loadedUser.email, userId: userData.id, token: userData._token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false });
            // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            // this.autoLogout(expirationDuration);
          }

          
          return { type: 'DUMMY' };
    }));

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), 
    tap((authSuccessAction: AuthActions.AuthenticateSuccess)=> {
        if(authSuccessAction.payload.redirect){
            this.router.navigate(['/recipes']);
        }
    }))

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(()=>{
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/login']);
    }));

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService){}
}