import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

// {path: '', redirectTo: '/recipes', pathMatch: 'full' },
// { path: 'recipes', component: RecipesComponent, children: [
//   { path: '', component: RecipeStartComponent },
//   { path: 'new', component: RecipeEditComponent },
//   { path: ':id', component: RecipeDetailComponent },
//   { path: ':id/edit', component: RecipeEditComponent },
// ] },
// { path: 'shopping-list', component: ShoppingListComponent },
// ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
