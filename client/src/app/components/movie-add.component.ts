import { MovieService } from 'src/app/services/movie.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// import { ArtistService } from 'src/app/services/artist.service';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'artist-add',
  templateUrl: '../views/movie-add.component.html'
})

export class MovieAddComponent implements OnInit {
  //component properties
  public title: string;
  public movie: Movie;
  public movies: Movie[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public isEdit;

  //constructor, inject services
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private movieService: MovieService) {
    //set properties
    this.title = 'Create New Movie';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    //initialize artist object
    this.movie = new Movie('', '', '', 2000, '', '', 1, '');
    this.isEdit = false;
  }

  ngOnInit() {

  }

  onSubmit() {
    console.log(this.movie);
    this.route.params.forEach((params: Params) => {
      //retrieve owner/user id from param
      let ownerId = params['id'];
      //store that id into movie prop for owner
      this.movie.owner = ownerId;


      //use service to add artist on submit
      this.movieService.addMovie(this.token, this.movie)
        //subscribe to response
        .subscribe(
          response => {
            //if there is no response
            if (!response.movie) {
              //show error
              this.alertMessage = 'Error on server';
            } else {
              //success message
              this.alertMessage = 'Movie created successfully';
              //assign data from db to component property
              this.movie = response.movie;
              //redirect
              this.router.navigate(['./edit-movie', response.movie._id]);
            }
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
              this.alertMessage = error.error.message;
              console.log(errorMessage);
            }
          }
        )
    })

  }

  //for file change event
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
