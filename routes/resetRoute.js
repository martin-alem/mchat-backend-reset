/**
 * @author Martin Alemajoh
 * @description This route handles request made to /Reset route
 * @date 7/19/2021
 */

const path = require("path");
const express = require("express");
const router = express.Router({ caseSensitive: true });

const Logger = require(path.join(__dirname, "../utils/Logger"));
const SendResponse = require(path.join(__dirname, "../utils/SendResponse"));
const ResetController = require(path.join(__dirname, "../controllers/ResetController"));
const VerifyController = require(path.join(__dirname, "../controllers/VerifyController"));
const ResendController = require(path.join(__dirname, "../controllers/ResendController"));
const ChangeController = require(path.join(__dirname, "../controllers/ChangeController"));

router.post("/", ResetController.middleware(), (req, res) => {
	ResetController.resetRequest(req, res);
});

router.post("/verify", VerifyController.middleware(), (req, res) => {
	VerifyController.verifyUser(req, res);
});

router.post("/change", ChangeController.middleware(), (req, res) => {
	ChangeController.change(req, res);
});

router.post("/verify/resend", ResendController.middleware(), (req, res) => {
	ResendController.resendCode(req, res);
});

router.use((error, req, res, next) => {
	Logger.logError(error.error, __filename, new Date());
	SendResponse.failedResponse(error.statusCode, req, res, error.error);
});

module.exports = router;