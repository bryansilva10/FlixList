/* MAIN FILE FOR STARTING SERVER */

//imports
const mongoose = require('mongoose');
const app = require('./app');


//port for deployment and local
const port = process.env.PORT || 2020;


//connect to database
mongoose
	.connect('mongodb+srv://admin-bryan:bryanpass@cluster0-mnqtb.mongodb.net/flixlist?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
	.then(() => {
		//express app listening
		app.listen(port, () => {
			console.log(`Listening on Port: ${port}`);
		});
		console.log('Connected to DB Successfully!');
	}).catch(err => {
		console.log(err.message);
	})
