/**
 * @author Martin Alemajoh
 * @description This is the main entry point for the service.
 * @date 7/19/2021
 */


const path = require("path");
const express = require("express");
const app = express();

const pingRouter = require(path.join(__dirname, "routes/pingRoute"));
const resetRouter = require(path.join(__dirname, "routes/resetRoute"));

//app settings
app.set("x-powered-by", false);

//parse json payloads and makes it available on the req object.
app.use(express.json());

/**
 * Manual cors configuration
 */
app.options("*", (req, res) => {
	res.status(200);
	res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
	res.set("Access-Control-Allow-Credentials", true);
	res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Content-Type");
	res.end();
});

//Route middleware
app.use("/reset", resetRouter);
app.use("/", pingRouter);



module.exports = app;