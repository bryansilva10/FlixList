import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import components
import { UserEditComponent } from './components/user-edit.component';
import { MovieListComponent } from './components/movie-list.component';
import { HomeComponent } from './components/home.component';
import { MovieAddComponent } from './components/movie-add.component';
import { MovieEditComponent } from './components/movie-edit.component';

//array for all routes
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'movies/:id/:page',
    component: MovieListComponent
  },
  {
    path: 'create-movie/:id',
    component: MovieAddComponent
  },
  {
    path: 'edit-movie/:id',
    component: MovieEditComponent
  },
  {
    path: 'my-info',
    component: UserEditComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
