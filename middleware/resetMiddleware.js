/**
 * @author Martin Alemajoh
 * @description Holds all the middleware functions  for signup
 */

const path = require('path');
const Validate = require(path.join(__dirname, "../validations/ValidateCredentials"));
const SendSMS = require(path.join(__dirname, "../services/SendSMS"));
const Query = require(path.join(__dirname, "../model/Query"));
const Helper = require(path.join(__dirname, "../utils/Helper"));
const Logger = require(path.join(__dirname, "../utils/Logger"))

const middleware = new Map();

function validatePayLoad(req, res, next) {
    const payload = req.body;
    if (Object.keys(payload).length === 0 || !payload.phone) {
        const statusCode = 400;
        const error = "Please provide a phone number";
        next({ error, statusCode });
        return;
    }
    next();
}

function validate(req, res, next) {

    const phone = req.body.phone;
    if (!Validate.isValidPhone(phone)) {
        const statusCode = 400;
        const error = "Invalid phone number";
        next({ error, statusCode });
        return;
    }
    next();

}

async function isUser(req, res, next) {

    const phone = req.body.phone;
    try {
        const selectResult = await Query.selectOne("login", "phone", phone);
        if (selectResult.length === 0) {
            const statusCode = 400;
            const error = "Phone number already does not exists";
            next({ error, statusCode });
            return;
        }
        next();
    } catch (err) {
        const statusCode = 500;
        const error = "Internal server error";
        next({ error, statusCode });
        Logger.logWarning(err.message, __filename, new Date());
        return;
    }
}

async function isBlacklisted(req, res, next) {

    const phone = req.body.phone;
    try {
        const selectResult = await Query.selectOne("blacklist", "phone", phone);
        if (selectResult.length > 0) {
            const statusCode = 400;
            const error = "This account has been blacklisted";
            next({ error, statusCode });
            return;
        }
        next();
    } catch (err) {
        const statusCode = 500;
        const error = "Internal server error";
        next({ error, statusCode });
        Logger.logWarning(err.message, __filename, new Date());
        return;
    }
}

async function checkResetLimit(req, res, next) {

    const phone = req.body.phone;
    let limit = 0;
    try {
        const selectResult = await Query.selectOne("password_reset", "phone", phone);
        if (selectResult.length > 0) {
            limit = selectResult[0]["reset_limit"];
            if (selectResult[0]["reset_limit"] >= 5) {
                const statusCode = 400;
                const error = "Reset limit exceeded for today. Please wait after 5 days.";
                next({ error, statusCode });
                return;
            }
        }
        req.body.limit = limit;
        next();
    } catch (err) {
        const statusCode = 500;
        const error = "Internal server error";
        next({ error, statusCode });
        Logger.logWarning(err.message, __filename, new Date());
        return;
    }
}

async function sendVerificationCode(req, res, next) {

    const phone = req.body.phone;
    const code = Helper.getCode(6);
    req.body.code = code;
    const message = `Your mchat verification code: ${code}. Valid for 5 minutes`;
    try {
        const result = await SendSMS.send(phone, message);
        if (result.errorCode && result.status === "failure") {
            const statusCode = 400;
            const error = "Invalid Phone number. Please try using another phone number.";
            next({ error, statusCode });
            return;
        }
        req.body.code = code;
        next();
    } catch (err) {
        const statusCode = 500;
        const error = "Internal server error";
        next({ error, statusCode });
        Logger.logWarning(err.message, __filename, new Date());
        return;
    }
}

middleware.set("validatePayLoad", validatePayLoad);
middleware.set("validate", validate);
middleware.set("isUser", isUser);
middleware.set("isBlacklisted", isBlacklisted);
middleware.set("checkResetLimit", checkResetLimit);
middleware.set("sendVerificationCode", sendVerificationCode);

module.exports = middleware;