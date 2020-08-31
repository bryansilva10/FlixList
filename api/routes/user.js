/* USER RELATED ROUTES */

//imports
const express = require('express');
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth');
const multipart = require('connect-multiparty'); //for file upload 

//upload middlware
const md_upload = multipart({ uploadDir: './uploads/users' });

//instance of router
const userRoute = express.Router();

//POST ROUTE to register user /api/register
userRoute.post('/register', UserController.saveUser);
//POST ROUTE to login user /api/login
userRoute.post('/login', UserController.loginUser);
//PUT ROUTE to update user info /api/update-user/id
userRoute.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);
//POST ROUTE to upload user image /api/upload-image-user/id
userRoute.post('/upload-image-user/:id', [auth.ensureAuth, md_upload], UserController.uploadImage);
//GET ROUTE to retrieve user image /api/get-image-user/file
userRoute.get('/get-image-user/:imageFile', UserController.getImageFile);
//POSSIBLE ROUTE TO GET USER MOVIES, MIGHT NEED AUTH AND FIND({email: email}).POPULATE({PATH: 'MOVIES'})
userRoute.get('/get-user-movies/:id', auth.ensureAuth, UserController.getUserMovies);

//export routes
module.exports = userRoute;