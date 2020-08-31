
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { MovieListComponent } from './components/movie-list.component';
import { HomeComponent } from './components/home.component';
import { MovieAddComponent } from './components/movie-add.component';
import { MovieEditComponent } from './components/movie-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    MovieListComponent,
    HomeComponent,
    MovieAddComponent,
    MovieEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
