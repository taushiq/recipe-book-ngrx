import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '' , pathMatch: 'full', redirectTo: 'recipes' },
  { path: 'recipes', loadChildren: () => import('../app/components/recipes/recipes.module')
  .then(mod => mod.RecipesModule) },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
