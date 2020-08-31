/* FILE FOR EXPRESS APP */

//Imports
const express = require('express'); //import express
const bodyParser = require('body-parser'); //import bodyparser

const app = express(); //express app

//Import Routes
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');

//config middleware for body parser
app.use(bodyParser.urlencoded({ extended: false })); //parse body with urlenconded
app.use(bodyParser.json()); //parse body to json

//config CORS headers
app.use((req, res, next) => {
	//Set header to allow access to any domain
	res.setHeader("Access-Control-Allow-Origin", "*");
	//set headers to be alloweed
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
	);
	//set http methods to be allowed
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.setHeader('Allow', "GET, POST, PATCH, PUT, DELETE, OPTIONS");

	//continue to nex middlware
	next();
});

//Base Routes
app.use('/api', userRoutes);
app.use('/api', movieRoutes);

//export express app
module.exports = app;