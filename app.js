const express = require("express");
const logger = require("morgan");

const app = express();
//  this line is used to create a user route in the http address bar 
const userRouter = require("./routes/user/userRouter");

app.use(logger("dev"));

app.use(express.json());
//parsing form data/incoming data
app.use(express.urlencoded({ extended: false }));

// this line is making this quoted text a addon to the http route in the addressbar
app.use("/api/user", userRouter);

// this line is allowing this file to be used in the fornt end
module.exports = app;
