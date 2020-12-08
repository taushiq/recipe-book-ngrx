import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Recipe } from '../../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor( private route: ActivatedRoute,
     private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe(
      (recipes: Recipe[])=>{
        this.recipes = recipes;
      }
    );
    
  }

  addRecipe(){
    this.router.navigate(['new'], { relativeTo : this.route });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
