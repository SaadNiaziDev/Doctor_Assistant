let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
const uuidv4 = require("uuid");

const { publicPics, secret } = require("../config");

let UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		uuid: { type: String },
		email: { type: String, required: true },
		profileImage: {
			type: String,
			default: `${publicPics}/noImage.png`,
		},
		googleId: { type: String, unique: true },
		hash: { type: String, default: null },
		salt: { type: String },
		resetPasswordToken: { type: String, default: null },
		mailToken: { type: String, default: null },
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "Taken" });

UserSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

UserSchema.methods.generatePasswordRestToken = function () {
	this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
};

UserSchema.methods.generateMailToken = function () {
	this.mailToken = crypto.randomBytes(10).toString("hex");
};

UserSchema.methods.generatePatientID = function () {
	let a = uuidv4.v4();
	this.uuid = a;
};

UserSchema.pre("validate", function (next) {
	if (!this.uuid) {
		this.generatePatientID();
	}
	next();
});

UserSchema.methods.generateJWT = function () {
	let today = new Date();
	let exp = new Date(today);
	exp.setDate(today.getDate() + 1);

	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			exp: parseInt(exp.getTime() / 1000),
		},
		secret,
		{
			algorithm: "HS256",
		}
	);
};

UserSchema.methods.toJSON = function () {
	return {
		_id: this._id,
		name: this._name,
		email: this.email,
		uuid: this.uuid,
		profileImage: this.profileImage,
		createdAt: this.createdAt,
	};
};

module.exports = mongoose.model("User", UserSchema);
