/**
 * @author Martin Alemajoh
 * @description This controller handles signup requests
 * @date 7/19/2021
 */

const path = require("path");
const Controller = require(path.join(__dirname, "./Controller"));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const Query = require(path.join(__dirname, "../model/Query"));
const middleware = require(path.join(__dirname, "../middleware/resetMiddleware"));
const Logger = require(path.join(__dirname, "../utils/Logger"));
const Helper = require(path.join(__dirname, "../utils/Helper"));
const Hash = require(path.join(__dirname, "../services/Hash"));


class resetController extends Controller {

	static async resetRequest(req, res) {

		let { phone, limit, code } = req.body;
		limit = limit === 0 ? 1 : limit + 1;
		const randomPassword = Helper.passwordGenerator(8);
		const hashPassword = Hash.hashData(randomPassword);

		const insertObject = { "phone": phone, "code": code, "reset_limit": limit, "date": new Date().getTime() };

		try {
			await Query.insert("password_reset", insertObject);
			await Query.updateOne("login", "password", hashPassword, "phone", phone);
			const statusCode = 200;
			const message = "Reset request successful";
			SendResponse.successResponse(statusCode, req, res, message);
		} catch (err) {
			const statusCode = 500;
			const error = "Internal server error";
			Logger.logWarning(err, __filename, new Date());
			SendResponse.failedResponse(statusCode, req, res, error);
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

module.exports = resetController;