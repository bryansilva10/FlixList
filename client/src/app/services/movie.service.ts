/*SERVICE FOR MOVIE RELATED OPERATIONS */

//imports
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from './../models/movie';

//make this service available from the root component
@Injectable({
  providedIn: 'root'
})

export class MovieService {
  //properties
  public url: string;

  //Constructor, inject http client
  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  //method to add artist
  addMovie(token, movie: Movie): Observable<any> {
    //convert object to json to pass as params later
    let params = JSON.stringify(movie);

    //set headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    //return request
    return this.http.post(this.url + 'movie', params, { headers: headers });
  }

  //method to get movies
  getMovies(token, id, page): Observable<any> {
    //set headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.get(this.url + `movies/${id}/` + page, { headers: headers });
  }

  //method to get single movie
  getMovie(token, id: string): Observable<any> {
    //set headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.get(this.url + 'movie/' + id, { headers: headers });
  }

  //method to update movie
  editMovie(token, id: string, movie: Movie): Observable<any> {
    //convert object to json to pass as params later
    let params = JSON.stringify(movie);

    //set headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    //return request
    return this.http.put(this.url + 'movie/' + id, params, { headers: headers });
  }

  //delete artist
  deleteMovie(token, id: string): Observable<any> {
    //set headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.delete(this.url + 'movie/' + id, { headers: headers });
  }

  // //add movie to user list
  // addToUserList(id: string): Observable<any> {

  // }
}
