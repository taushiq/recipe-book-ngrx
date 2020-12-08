import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './components/login/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'recipe-book';

  constructor(private store: Store<fromApp.AppState>){}
  
  ngOnInit(){
    this.store.dispatch(new AuthActions.AutoLogin());
  }
  



}