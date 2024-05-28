let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let GoogleStrategy = require("passport-google-oauth20").Strategy;
let mongoose = require("mongoose");
const { backend, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../config/env/development");
let User = mongoose.model("User");

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(
	new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return done(null, false, { message: "Incorrect Email Address" });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: "Incorrect Password" });
				}
				return done(null, user);
			})
			.catch((err) => {
				return done(null, false, { message: "Something went wrong!" });
			});
	})
);

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: backend + "/api/user/google/callback",
			passReqToCallback: false,
		},
		function (accessToken, refreshToken, profile, cb) {
			return cb(null, profile);
		}
	)
);
