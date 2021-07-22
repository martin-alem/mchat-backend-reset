/**
 * @author Martin Alemajoh
 * @description Holds all the middleware functions  for setup
 */

const path = require("path");
const Validate = require(path.join(__dirname, "../validations/ValidateCredentials"));
const Hash = require(path.join(__dirname, "../services/Hash"));
const Query = require(path.join(__dirname, "../model/Query"));
const Logger = require(path.join(__dirname, "../utils/Logger"));



const middleware = new Map();

function validatePayLoad(req, res, next) {
	const payload = req.body;
	if (Object.keys(payload).length === 0 || !payload.phone || !payload.password) {
		const statusCode = 400;
		const error = "Please provide all required credentials";
		next({ error, statusCode });
		return;
	}
	next();
}

function validate(req, res, next) {

	const phone = req.body.phone;
	const password = req.body.password;

	if (!Validate.isValidPhone(phone) || !Validate.isValidPassword(password)) {
		const statusCode = 400;
		const error = "Invalid credentials provided";
		next({ error, statusCode });
		return;
	}
	next();

}

async function verify(req, res, next) {

	const phone = req.body.phone;
	try {
		const result = await Query.selectOne("password_reset", "phone", phone);
		if (result.length === 0 || result[0]["status"] !== "verified") {
			const statusCode = 403;
			const error = "Unauthorized user.";
			next({ error, statusCode });
			return;
		}
		next();
	} catch (err) {
		const statusCode = 500;
		const error = "Internal server error";
		next({ error, statusCode });
		Logger.logWarning(err, __filename, new Date());
		return;
	}
}

async function resetPassword(req, res, next) {

	const { phone, password } = req.body;
	const newPassword = Hash.hashData(password);

	const transactions = [
		{ "query": `UPDATE login SET password = '${newPassword}' WHERE phone = '${phone}'` },
		{ "query": `UPDATE password_reset SET status = 'complete' WHERE phone = '${phone}'` },
	];

	try {
		await Query.performTransaction(transactions);
		next();
	} catch (err) {
		const statusCode = 500;
		const error = "Internal server error";
		next({ error, statusCode });
		Logger.logWarning(err, __filename, new Date());
		return;
	}
}

middleware.set("validatePayload", validatePayLoad);
middleware.set("validate", validate);
middleware.set("verify", verify);
middleware.set("resetPassword", resetPassword);

module.exports = middleware;