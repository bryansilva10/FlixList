/* CONTROLLER FILE FOR MOVIE RELATED LOGIC */

//imports
const fs = require('fs');
const path = require('path');
//module for pagination
const mongoosePaginate = require('mongoose-pagination');

//model
const Movie = require('../models/movie');

//method to retrieve a movie
exports.getMovie = (req, res, next) => {
	//retrieve movie id from param
	var movieId = req.params.id;

	//find movie by ID from db
	Movie.findById(movieId)
		.then(movie => {
			//check if movie is not defined in db
			if (!movie) {
				//send error respoonse
				res.status(404).send({ message: 'Movie was not found' });
			} else {
				//send success respoonse and movie
				res.status(200).send({ movie });
			}
		})
		.catch(err => {
			//send error respoonse
			res.status(500).send({ message: 'Error trying to find Movie' });
		})
}

//method to retrieve all movies
exports.getMovies = (req, res, next) => {
	//retrieve user id from url
	const ownerId = req.params.owner;

	//retrieve all movies matching owner id in descending order
	var find = Movie.find({ owner: ownerId }).sort({ rating: 'desc' });

	//if there is a page in url parameter...
	if (req.params.page) {
		//retrieve and assign page from params
		var page = req.params.page;
	} else {
		//default to 1
		var page = 1;
	}

	//how many movies per page
	const itemsPerPage = 6;

	//populate found movies with owner info. 
	find.populate({ path: 'owner' })
		//Paginate, pass current page and items per page, and cb function with err, movie objects and total pages
		.paginate(page, itemsPerPage, (err, movies, total) => {
			//if there is an error 
			if (err) {
				//send err response
				res.status(500).send({ message: 'Error on the request' });
			} else {
				//if there were no movies
				if (!movies) {
					//not found response
					res.status(404).send({ message: 'No movies on list' });
				} else {
					//return success response
					return res.status(200).send({
						//num of pages
						total_items: total,
						movies: movies
					})
				}
			}
		})
}

//method to create/save a movie
exports.saveMovie = (req, res, next) => {
	//retrieve info from request
	const name = req.body.name;
	const genre = req.body.genre;
	const year = req.body.year;
	const duration = req.body.duration;
	const image = 'null';
	const rating = req.body.rating;
	const owner = req.body.owner;

	//create new movie
	const movie = new Movie({
		name,
		genre,
		year,
		duration,
		image,
		rating,
		owner
	});

	//save movie to DB
	movie.save()
		.then(storedMovie => {
			//if we don't get stored movie...
			if (!storedMovie) {
				//send error message response
				res.status(404).send({ message: 'Could not save Movie' });
			} else {
				//send success message response with movie
				res.status(200).send({ movie: storedMovie });
			}
		})
		.catch(err => {
			//send error message response
			res.status(500).send({ message: 'Error saving Movie' });
		})
}

//method to update a movie
exports.updateMovie = (req, res, next) => {
	//retrieve movie id
	const movieId = req.params.id;

	//updated movie info coming from req body
	const update = req.body;

	//use model to find by id and update
	Movie.findByIdAndUpdate(movieId, update)
		.then(updatedMovie => {
			//check if movie is not found
			if (!updatedMovie) {
				//send error message response
				res.status(404).send({ message: 'Could not update Movie' });
			} else {
				//send success message response with movie
				res.status(200).send({ movie: updatedMovie });
			}
		})
		.catch(err => {
			//send error message response
			res.status(500).send({ message: 'Error in the request to update a Movie' });
		})
}

//method to delete a movie
exports.deleteMovie = (req, res, next) => {
	//retrieve movie id from url
	const movieId = req.params.id;

	//find by id and delete
	Song.findByIdAndRemove(movieId)
		.then(removedMovie => {
			//check if stored song is not defined or found
			if (!removedMovie) {
				//404 error
				res.status(404).send({ message: 'Movie could not be Deleted' });
			} else {
				//success message with updated movie object
				res.status(200).send({ movie: removedMovie });
			}
		})
		.catch(err => {
			//500 error
			res.status(500).send({ message: 'Error on the request to delete Movie' });
		})
}

//method to upload movie image
exports.uploadImage = (req, res, next) => {
	//retrieve movie id from params
	const movieId = req.params.id;
	//default file name
	let file_name = 'Not uploaded...';

	//check if there is a file coming in the requst
	if (req.files) {
		//retrieve file path from req
		const file_path = req.files.image.path;
		//split file path
		const file_split = file_path.split(path.sep);
		//get only name from split file name
		file_name = file_split[2];

		//split on dot and get file extension
		const ext_split = file_name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//update image on database using model
			Movie.findByIdAndUpdate(movieId, { image: file_name }, (err, updatedMovie) => {
				//if thre is an error with the returned object
				if (!updatedMovie) {
					//return error response
					res.status(404).send({ message: 'Could not update Movie' });
				} else {
					//return sucessful response and updated movie obj
					res.status(200).send({ movie: updatedMovie });
				}
			});
		} else {
			//return error response, wrong file extentsion
			res.status(200).send({ message: 'File Extention is not valid...' });
		}
	} else {
		//return error response
		res.status(200).send({ message: 'No image was uploaded...' });
	}
}

//method to retrieve movie image
exports.getImageFile = (req, res, next) => {
	//retrieve image file name from params
	const imageFile = req.params.imageFile;
	//entire file path
	const file_path = `./uploads/movies/${imageFile}`;

	//check if file exists in folder
	//callback to do something with it
	fs.exists(file_path, exists => {
		//if file exists
		if (exists) {
			//send the file
			res.sendFile(path.resolve(file_path));
		} else {
			//return error response
			res.status(200).send({ message: 'Image does not exist...' });
		}
	});
}