/* USER MODEL */

//mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
	name: String,
	lastname: String,
	email: String,
	password: String,
	address: String,
	phone: String,
	image: String
});

//export model using user schema
module.exports = mongoose.model('User', UserSchema);