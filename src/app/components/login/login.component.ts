import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import Swal from 'sweetalert2';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../login/store/auth.actions';

import { AuthResponse, AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogIn = true;
  isLoading= false;
  error = null;

  storeSub: Subscription;

  constructor(private authService: AuthService, private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.storeSub = this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
    });
  }

  switchMode(){
    this.isLogIn = !this.isLogIn;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;


    if(this.isLogIn){
      this.store.dispatch(new AuthActions.LoginStart({email: email , password: password}))
    }else{
      this.store.dispatch(new AuthActions.SignupStart({email: email , password: password}));
    }

    form.reset();
  }

  onAlertOver(alert: boolean){
    if(!alert){
      this.store.dispatch(new AuthActions.ClearError());
    }
  }

  ngOnDestroy(){
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
    
  }



