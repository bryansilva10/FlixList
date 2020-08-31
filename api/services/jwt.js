/* UTILITY SERVICE FOR GENERATING JSON WEB TOKEN */

//Imports
const jwt = require('jwt-simple'); //for token
const moment = require('moment'); //for timestamps
const secret = 'secret_key_flixlist'; //used for hash

//export method to crete token
exports.createToken = user => {
	//create data for token
	const payload = {
		sub: user._id,
		name: user.name,
		lastname: user.lastname,
		email: user.email,
		address: user.address,
		phone: user.phone,
		image: user.image,
		movies: user.movies,
		//issued at => create timestamp
		iat: moment().unix(),
		//expires at => create timestamp
		exp: moment().add(30, 'days').unix()
	}

	//return the token
	return jwt.encode(payload, secret)
}