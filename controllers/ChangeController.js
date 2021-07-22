/**
 * @author Martin Alemajoh
 * @description This controller handles setup requests
 * @date 7/19/2021
 */

const path = require("path");
const Controller = require(path.join(__dirname, "./Controller"));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const SendEmail = require(path.join(__dirname, "../services/SendEmail"));
const middleware = require(path.join(__dirname, "../middleware/changeMiddleware"));
const Logger = require(path.join(__dirname, "../utils/Logger"));
const Query = require(path.join(__dirname, "../model/Query"));

class ChangeController extends Controller {

	static async change(req, res) {

		const { phone } = req.body;
		try {
			const result = await Query.selectOne("login", "phone", phone);
			const options = { "templateName": "reset", "address": result[0]["email"], "subject": "Your password was updated" };
			await SendEmail.sendEmail(options);
			const statusCode = 201;
			const message = "Password reset successful";
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

module.exports = ChangeController;

