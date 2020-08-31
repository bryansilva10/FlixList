/* MOVIE RELATED ROUTEs */

//imports
const express = require('express');
const MovieController = require('../controllers/movie');
const auth = require('../middlewares/auth');
const multipart = require('connect-multiparty'); //for file upload 

//upload middlware
const md_upload = multipart({ uploadDir: './uploads/movies' });

//instance of router
const movieRoute = express.Router();

//Routes
//POST ROUTE to create a movie /api/movie
movieRoute.post('/movie', auth.ensureAuth, MovieController.saveMovie);
//GET ROUTE to retrieve a specific movie /api/movie/id
movieRoute.get('/movie/:id', auth.ensureAuth, MovieController.getMovie);
//GET ROUTE to retrieve a list of all movies /api/movies/page?
movieRoute.get('/movies/:owner/:page?', auth.ensureAuth, MovieController.getMovies);
//GET ROUTE to retrieve movie image /api/movies/id
movieRoute.get('/get-image-movie/:imageFile', MovieController.getImageFile);
//POST ROUTE to upload movie image api/movies/upload-image-movie/id
movieRoute.post('/upload-image-movie/:id', [auth.ensureAuth, md_upload], MovieController.uploadImage);
//PUT ROUTE to update a movie api/movie/id
movieRoute.put('/movie/:id', auth.ensureAuth, MovieController.updateMovie);
//DELETE ROTE to remove a movie api/movie/id
movieRoute.delete('/movie/:id', auth.ensureAuth, MovieController.deleteMovie);


module.exports = movieRoute;