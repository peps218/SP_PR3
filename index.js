require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();
const passport = require('passport');
const path = require('path');
const routes = require('./routes');
require('./passport');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
	extended: false
}));

app.use(session({
	name: 'session',
	secret: 'my_secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 3600 * 1000,
	}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));
app.use(routes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


routes.get('/', (req, res) => res.send(userProfile));
routes.get('/login', (req, res) => res.send("error logging in"));

app.listen(3000, () => console.log('Server is running on port 3000'));