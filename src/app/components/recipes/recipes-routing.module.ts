import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { RecipesResolverService } from '../../guards/recipes.resolver.service';
import { CanDeactivateGuard } from '../../guards/can-deactivate-guard.service';

const routes: Routes = [
  
  { path: '' , canActivate: [AuthGuardService], component: RecipesComponent, children: [
    { path: '' , component: RecipeStartComponent},
    { path: 'new', component: RecipeEditComponent },
    { path: ':id', component: RecipeDetailComponent , resolve: [RecipesResolverService]},
    { path: ':id/edit', component: RecipeEditComponent,  resolve: [RecipesResolverService], canDeactivate: [CanDeactivateGuard]}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
