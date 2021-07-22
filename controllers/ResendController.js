/**
 * @author Martin Alemajoh
 * @description This controller handles resend requests
 * @date 7/19/2021
 */

const path = require("path");
const Controller = require(path.join(__dirname, "./Controller"));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const Query = require(path.join(__dirname, "../model/Query"));
const middleware = require(path.join(__dirname, "../middleware/resendMiddleware"));
const Logger = require(path.join(__dirname, "../utils/Logger"));

class ResendController extends Controller {

	static async resendCode(req, res) {

		const code = req.body.code;
		const phone = req.body.phone;
		const updateResend = req.body.resend + 1;
		const updateObject = { "code": code, "resend": updateResend, "date": new Date().getTime() };
		try {
			await Query.updateMany("password_reset", updateObject, "phone", phone);
			const statusCode = 200;
			const message = "Verification sent";
			SendResponse.successResponse(statusCode, req, res, message);
		} catch (err) {
			const statusCode = 500;
			const error = "Internal server error";
			SendResponse.failedResponse(statusCode, req, res, error);
			Logger.logWarning(err, __filename, new Date());
		}
	}

	static middleware() {
		const middlewareFunctions = [];

		for (const [_, value] of middleware) {
			middlewareFunctions.push(value);
		}
		return middlewareFunctions;
	}
}

module.exports = ResendController;