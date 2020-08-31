/* MOVIE MODEL */

//mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = Schema({
	name: String,
	genre: String,
	year: Number,
	duration: String,
	image: String,
	rating: Number,
	owner: String
});

//export model using user schema
module.exports = mongoose.model('Movie', MovieSchema);