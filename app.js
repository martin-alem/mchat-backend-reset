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


//Route middleware
app.use("/reset", resetRouter);
app.use("/", pingRouter);



module.exports = app;