/**
 * @author Martin Alemajoh
 * @description Holds all the middleware functions  for verify
 */

const path = require("path");
const Validate = require(path.join(__dirname, "../validations/ValidateCredentials"));
const Query = require(path.join(__dirname, "../model/Query"));
const Logger = require(path.join(__dirname, "../utils/Logger"));

const middleware = new Map();

function validatePayLoad(req, res, next) {

	const payload = req.body;
	if (Object.keys(payload).length === 0 || !payload.phone || !payload.code) {
		const statusCode = 400;
		const error = "Please provide phone number and code";
		next({ error, statusCode });
		return;
	}
	next();
}

function validate(req, res, next) {

	const phone = req.body.phone;
	const code = req.body.code;
	if (!Validate.isValidPhone(phone) || !Validate.isValidCode(code)) {
		const statusCode = 400;
		const error = "Invalid phone number or code";
		next({ error, statusCode });
		return;
	}
	next();
}

async function codeExistAndValid(req, res, next) {

	const { phone, code } = req.body;
	try {
		const selectResult = await Query.selectOne("password_reset", "phone", phone);
		if (selectResult.length > 0 && selectResult[0]["code"] === code && selectResult[0]["status"] === "progress") {

			const now = new Date().getTime();
			const past = parseInt(selectResult[0].date, 10);
			const diffInMinutes = new Date(now - past).getMinutes();

			if (diffInMinutes >= 5) {
				const statusCode = 403;
				const error = `Verification code expired ${diffInMinutes} minutes ago`;
				next({ error, statusCode });
				return;
			}

			next();
		}
		else {
			const statusCode = 403;
			const error = "Invalid phone number or code";
			next({ error, statusCode });
			return;
		}
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
middleware.set("codeExistAndValid", codeExistAndValid);

module.exports = middleware;