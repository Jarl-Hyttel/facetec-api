// Node has not yet implemented ES6 import feature, so use standard require instead. 
// Must export.module in each controller
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/Register');
const signin = require('./controllers/Signin');
const profile = require('./controllers/Profile');
const image = require('./controllers/Image');

// Through knex connect server to Heroku database 
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
  		ssl: true,	
  	}
});

const app = express();

// To bypass browser same origin policy while developing. Check out MDN web docs CORS
app.use(cors())

// Using bodyparser to be able to receive data from frontend using JSON (must be parsed)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ENDPOINTS
app.get('/', (req, res)=> { res.send('it is working') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) })
app.get("/profile/:id", (req, res) => { profile.handleProfileGet(req, res, db) })
app.put("/image", (req, res) => { image.handleImage(req, res, db) })
app.post("/imageurl", (req, res) => { image.handleApiCall(req, res) })

// Setup on received port from Heroku, or default port 3000
app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})