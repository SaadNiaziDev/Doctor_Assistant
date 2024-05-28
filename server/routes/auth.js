let jsonwebtoken = require("jsonwebtoken");
let secret = require("../config").secret;
let mongoose = require("mongoose");

let User = mongoose.model("User");
const { UnauthorizedResponse, BadRequestResponse } = require("express-http-response");

const isToken = function (req, res, next) {
	if (req.headers.authorization) {
		let token = req.headers.authorization.split(" ");
		if (typeof token[1] === "undefined" || typeof token[1] === null) {
			next(new UnauthorizedResponse("Please login first to continue further!"));
		} else {
			jsonwebtoken.verify(token[1], secret, (err, data) => {
				if (err) {
					next(new UnauthorizedResponse("Please login first to continue further!"));
				} else {
					User.findById(data.id)
						.then(function (user) {
							if (!user) {
								next(new ForbiddenResponse());
							}
							req.user = user;
							next();
						})
						.catch((e) => {
							next(new BadRequestResponse(e.error));
						});
				}
			});
		}
	} else {
		next(new UnauthorizedResponse("No Token Attached to request!"));
	}
};

module.exports = {
	isToken,
};
