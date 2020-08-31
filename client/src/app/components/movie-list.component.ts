import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MovieService } from 'src/app/services/movie.service';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'artist-list',
  templateUrl: '../views/movie-list.component.html'
})

export class MovieListComponent implements OnInit {
  //component properties
  public title: string;
  public movies: Movie[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public nextPage;
  public prevPage;
  public confirmed;

  //constructor, inject services
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private movieService: MovieService) {
    //set properties
    this.title = 'Movies';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
  }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    //retrieve owner id and page from param
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      let page = +params['page'];

      //if there is no page
      if (!page) {
        //default to 1
        page = 1;
      } else {
        //assing next page value
        this.nextPage = page + 1;
        //asign prev page value
        this.prevPage = page - 1;

        //if prev page is 0
        if (this.prevPage == 0) {
          //prevent from going below 0
          this.prevPage = 1;
        }
      }

      //retrieve movies with service
      this.movieService.getMovies(this.token, id, page)
        //subscribe to response
        .subscribe(
          response => {
            //if there is not a resonse
            if (!response.movies) {
              this.alertMessage = 'You have no Movies yet';
            } else {
              //response with movies assinged to component prop
              this.movies = response.movies;
              console.log(response.movies);
            }
          },
          error => {
            //create message
            const errorMessage = <any>error;

            //If ther is an error, log it
            if (errorMessage != null) {
              //parse body of error to json
              // let body = JSON.parse(error._body);
              //assign error on body to errormessage property
              // this.alertMessage = error.error.message;
              console.log(errorMessage);
            }
          });
    })
  }

  //method to confirm deletion
  onDeleteConfirm(id) {
    //assign id to confirm
    this.confirmed = id;
  }

  //method to cancel deletion
  onCancelMovie() {
    //set to null
    this.confirmed = null;
  }

  onDeleteMovie(id) {
    //user service to delete, pass token and id
    this.movieService.deleteMovie(this.token, id)
      //subscribe to response
      .subscribe(
        response => {
          //if movie is not retrieved correctly
          if (!response.movie) {
            //alert
            alert('Error on Server');
          }
          //list all artists
          this.getMovies();
        },
        //in case of error
        error => {
          //create message
          const errorMessage = <any>error;

          //If ther is an error, log it
          if (errorMessage != null) {
            //parse body of error to json
            // let body = JSON.parse(error._body);
            //assign error on body to errormessage property
            // this.alertMessage = error.error.message;
            console.log(errorMessage);
          }
        }
      )
  }
}

