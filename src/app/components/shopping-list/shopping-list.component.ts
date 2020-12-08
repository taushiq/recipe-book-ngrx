import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Ingredient } from '../../models/ingredient.model';


import * as ShoppingListActions from './store/shopping.list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit , OnDestroy {

  ingredients: Observable<{ingredients: Ingredient[]}>;
  subscription: Subscription

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    
    this.ingredients = this.store.select('shoppingList')
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsSubscription
    // .subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
  }

  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }

  onEdit(index: number){
    // this.slService.onStartedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
