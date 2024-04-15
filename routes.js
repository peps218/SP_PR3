const router = require("express").Router();
const passport = require('passport');

const {
	body
} = require("express-validator");

const {
	homePage,
	register,
	registerPage,
	login,
	loginPage,
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
	if (!req.session.userID) {
		return res.redirect('/login');
	}
	next();
}

const ifLoggedin = (req, res, next) => {
	if (req.session.userID) {
		return res.redirect('/');
	}
	next();
}

router.get('/', ifNotLoggedin, homePage);
router.get("/login", ifLoggedin, loginPage);
router.post("/login",
ifLoggedin,
    [
        body("_email", "Invalid email address").notEmpty().escape().trim().isEmail(),
	    body("_password", "The Password must be of minimum 4 characters length ").notEmpty().trim().isLength({
            min: 4
	    }),
    ],
    login
);

router.get("/signup", ifLoggedin, registerPage);
router.post(
    "/signup",
    ifLoggedin,
    [
        body("_name", "The name must be of minimum 3 characters length ").notEmpty().escape().trim().isLength({
            min: 3
		}),
        body("_email", "Invalid email address").notEmpty().escape().trim().isEmail(), body("_password", "The Password must be of minimum 4 characters length ").notEmpty().trim().isLength({
            min: 4
		}),
    ], register);

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
	});
    res.redirect('/login');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
	console.log("Успешная авторизация через Google")
  }
);

router.get('/auth/github',
  passport.authenticate('github', {scope: ['profile', 'email']}));

router.get('/auth/github/callback',
passport.authenticate('github', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
	console.log("Успешная авторизация через GitHub")
  }
);

module.exports = router;