/**
 * @author Martin Alemajoh
 * @description This controller handles verify requests
 * @date 7/19/2021
 */

const path = require("path");
const Controller = require(path.join(__dirname, "./Controller"));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const Query = require(path.join(__dirname, "../model/Query"));
const middleware = require(path.join(__dirname, "../middleware/verifyMiddleware"));
const Logger = require(path.join(__dirname, "../utils/Logger"));

class VerifyController extends Controller {

	static async verifyUser(req, res) {
		const status = "verified";
		const phone = req.body.phone;

		try {
			await Query.updateOne("password_reset", "status", status, "phone", phone);
			const statusCode = 201;
			const message = "Reset request verified";
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

module.exports = VerifyController;