/**
 * @author Martin Alemajoh
 * @description This controller handles setup requests
 * @date 7/19/2021
 */

const path = require('path');
const Controller = require(path.join(__dirname, './Controller'));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const middleware = require(path.join(__dirname, "../middleware/setupMiddleware"));
const Logger = require(path.join(__dirname, "../utils/Logger"))

class ChangeController extends Controller {

    static async change(req, res) {

        try {
            const result = await Query.selectOne("temp_users", "phone", phone);
            const options = { "templateName": "reset", "address": result[0]["email"], "subject": "Your password was updated" }
            await SendEmail.sendEmail(options);
            const statusCode = 201;
            const message = "Password reset successful";
            SendResponse.successResponse(statusCode, req, res, message);
        } catch (err) {
            const statusCode = 500;
            const error = "Internal server error";
            SendResponse.failedResponse(statusCode, req, res, error);
            Logger.logWarning(err.message, __filename, new Date());
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

