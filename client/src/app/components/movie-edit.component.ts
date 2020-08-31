import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MovieService } from 'src/app/services/movie.service';
import { UploadService } from 'src/app/services/upload.service';
import { Movie } from '../models/movie';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'movie-edit',
  templateUrl: '../views/movie-add.component.html'
})

export class MovieEditComponent implements OnInit {
  //component properties
  public title: string;
  public movie: Movie;
  public user: User;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public isEdit;
  public filesToUpload: Array<File>;

  //constructor, inject services
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private movieService: MovieService, private uploadService: UploadService) {
    //set properties
    this.title = 'Edit Artist';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    //initialize artist object
    this.movie = new Movie('', '', '', 2000, '', '', 1, '');
    this.isEdit = true;
  }

  ngOnInit() {
    //call api to get artist by id
    this.getMovie();
    // console.log(this.identity);
  }

  //method to get movie from api
  getMovie() {
    //retrieve id from url
    this.route.params.forEach((params: Params) => {
      //retrieve id param
      let id = params['id'];

      //retrieve artist using service
      this.movieService.getMovie(this.token, id)
        //subscribe to response of service method
        .subscribe(
          response => {
            //if artist is not retrieve correctly
            if (!response.movie) {
              //redirect
              this.router.navigate(['/']);
            } else {
              //retrieve artist and assign to component prop
              this.movie = response.movie;
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
              // this.alertMessage = error.error.message;
              console.log(errorMessage);
            }
          }
        )
    })
  }

  onSubmit() {
    console.log(this.movie);

    this.route.params.forEach((params: Params) => {
      //retrieve id param
      let id = params['id'];
      //use service to add movie on submit
      this.movieService.editMovie(this.token, id, this.movie)
        //subscribe to response
        .subscribe(
          response => {
            //if there is no response
            if (!response.movie) {
              //show error
              this.alertMessage = 'Error on server';
            } else {
              //success message
              this.alertMessage = 'Movie updated successfully';

              //check if there are files to upload
              if (!this.filesToUpload) {
                //redirect
                this.router.navigate(['/movies', this.identity._id, 1]);
              } else {
                //upload image with method
                this.uploadService.makeFileRequest(this.url + 'upload-image-movie/' + id, [], this.filesToUpload, this.token, 'image')
                  .then(
                    (result) => {
                      //redirect
                      this.router.navigate(['/movie', response.movie._id]);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                //assign data from db to component property
                // this.artist = response.artist;
                //redirect
              }
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
      //use service to update user to include movie id????????
    })
  }

  //method for file change event
  fileChangeEvent(fileInput: any) {
    //grab files selected and store in component prop
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
