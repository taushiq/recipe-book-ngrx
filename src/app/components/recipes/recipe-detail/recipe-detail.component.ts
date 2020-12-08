import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from 'src/app/models/recipe.model';
import * as fromApp from '../../../store/app.reducer';
import { map } from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping.list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
     private router: Router, private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];   // + sign to cast the string to a number
        // this.recipe = this.recipeService.getRecipe(this.id);
        this.store.select('recipes').pipe(map(recipeState => {
           return recipeState.recipes.find((recipe, index)=>{
            return index === this.id;
           }) })).subscribe(
             recipe => {
               this.recipe = recipe;
             });
      }
    );

    // this.route.data.subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];   // + sign to cast the string to a number
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // );
  }

  toShoppingList(){
    // this.recipeService.toShoppingListService(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  editRecipe(){
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id , 'edit'], { relativeTo: this.route });
  }

  onDelete(){
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
