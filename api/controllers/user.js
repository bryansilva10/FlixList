/* CONTROLLER FOR USER RELATED LOGIC */

//imports
const bcrypt = require('bcrypt-nodejs'); //for encrypting passowrd
const User = require('../models/user'); //import user model
const jwt = require('../services/jwt'); //import jwt service file

//import file system and path
const fs = require('fs');
const path = require('path');


//method to save user
exports.saveUser = (req, res, next) => {
	//extract info coming from request body
	const name = req.body.name;
	const lastname = req.body.lastname;
	const email = req.body.email;
	const address = req.body.address;
	const phone = req.body.phone;
	const image = 'null';
	const movies = null;

	console.log(req.body);

	//check if password exists
	if (req.body.password) {
		//encrypt password...
		bcrypt.hash(req.body.password, null, null, (err, hash) => {
			//if user data is valid...
			if (name != null && lastname != null && email != null) {
				//instantiate a user, fill with info from req, and add hashed password
				const user = new User({
					name: name,
					lastname: lastname,
					email: email,
					password: hash,
					address: address,
					phone: phone,
					image: image,
					movies: movies
				});
				//save user to database
				user.save()
					.then(storedUser => {
						//if user not registered on DB correctly
						if (!storedUser) {
							//response with error
							res.status(404).json({ message: 'Error Registering User' });
						} else {
							//if no error at all
							//rsponse with sucess and user data
							res.status(200).send({ user: storedUser });
						}
					})
					.catch(err => {
						//response with error
						res.status(500).json({ message: 'Failed Saving User' });
					});
			} else {
				//response with error
				res.status(200).json({ message: 'Please enter all fields' });
			}
		});
	} else {
		//response with error
		res.status(200).json({ message: 'Password missing' });
	}
}

//method to log in
exports.loginUser = (req, res, next) => {
	//extract info from request
	const email = req.body.email;
	const password = req.body.password;

	//retrieve user by email
	User.findOne({ email: email.toLowerCase() })
		.then(user => {
			//if user does NOT exist
			if (!user) {
				console.log(user);
				//not found response
				res.status(404).send({ message: 'User does not exist' });
			} else {
				//check/compare password on db with passwrd on req
				bcrypt.compare(password, user.password, (err, check) => {
					//if check is successful
					if (check) {
						//check if there is a parameter called gethash
						if (req.body.getHash) {
							//return a jtw token to the client
							res.status(200).send({
								//user service to generate token
								token: jwt.createToken(user)
							})
						} else {
							//respnse with just the user
							res.status(200).send({ user });
						}
					} else {
						//send not found error
						res.status(404).send({ message: 'User could not authenticate' });
					}
				});
			}
		})
		.catch(err => {
			res.status(500).send({ message: 'Error finding user' });
		})
}

//method to update user info
exports.updateUser = (req, res, next) => {
	//retrieve user id from param
	const userId = req.params.id;
	//retrieve modified body
	const update = req.body;

	//check if user is not authenticated before allowing to update info
	if (userId != req.user.sub) {
		//return error rsponse and exit 
		return res.status(500).send({ message: 'Not Allowed to Update User' });
	}

	//Use model to find and update by id
	User.findByIdAndUpdate(userId, update)
		.then(updatedUser => {
			//if thre is an error with the returned user
			if (!updatedUser) {
				//return error response
				res.status(404).send({ message: 'Could not update user' });
			} else {
				//return sucessful response and updated user
				res.status(200).send({ user: updatedUser });
			}
		})
		.catch(err => {
			//return error rsponse
			res.status(500).send({ message: 'Error updating user' });
		})
}

//method to uplaod user image
exports.uploadImage = (req, res, next) => {
	//retrieve user id from params
	const userId = req.params.id;
	//default file name
	let file_name = 'Not uploaded...';

	//check if there is a file coming in the req
	if (req.files) {
		//retrieve file path from req
		const file_path = req.files.image.path;
		//split file path
		const file_split = file_path.split(path.sep);
		//get only name from split file name
		const file_name = file_split[2];

		//split on dot and get file extension
		const ext_split = file_name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//update image on database using model
			User.findByIdAndUpdate(userId, { image: file_name }, (err, updatedUser) => {
				//if thre is an error with the returned user
				if (!updatedUser) {
					//return error response
					res.status(404).send({ message: 'Could not update user' });
				} else {
					//return sucessful response and updated user with image
					res.status(200).send({ image: file_name, user: updatedUser });
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

//method to get image files
exports.getImageFile = (req, res, next) => {
	//retrieve image file name from params
	const imageFile = req.params.imageFile;
	//entire file path
	const file_path = `./uploads/users/${imageFile}`;

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

//method to get user movies
exports.getUserMovies = (req, res, next) => {
	//retrieve user id from param
	const userId = req.params.id;

	//get user
	User.findById(userId)
		//populate its movies
		.populate({ path: 'movies' })
		.then(movies => {
			//if movies not found
			if (!movies) {
				//response with error
				res.status(404).json({ message: 'Error Finding Movies' });
			} else {
				//if no error at all
				//rsponse with sucess and movie data
				res.status(200).send({ movies });
			}
		})
		.catch(err => {
			//500 error
			res.status(500).send({ message: 'Error on the request to find Movies' });
		})

}