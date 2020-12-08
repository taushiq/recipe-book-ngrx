import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../login/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub :Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    

    this.userSub = this.store.select('auth').pipe(map(authState => {
      return authState.user;
    })).subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  saveData(){
    
    //   this.dataStorage.storeRecipes()
    // .subscribe();
    this.store.dispatch(new RecipeActions.StoreRecipes());
    
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  fetchData(){
    // this.dataStorage.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  

}
