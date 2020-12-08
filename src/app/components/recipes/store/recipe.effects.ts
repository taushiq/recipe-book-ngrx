import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../../models/recipe.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';


@Injectable()
export class RecipeEffects {
    
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(()=>{
            return this.http.get<Recipe[]>('https://recipebook-05.firebaseio.com/recipes.json', )
        }),
        map(recipes => {
            return recipes.map(recipe => {
              return { ...recipe, ingredient: recipe.ingredients? recipe.ingredients : []
               };
            });
          }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
        )

    @Effect({dispatch: false})    
    storeRecipes = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesData])=>{
            return this.http.put('https://recipebook-05.firebaseio.com/recipes.json', recipesData.recipes);
        })
    );    

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}