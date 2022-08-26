const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');


const TodoTask = require("./models/TodoTask");
const TodoList = require("./models/TodoList");

const indexRouter = require('./routes/index');

const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);


const mongoose = require("mongoose");

//connection to db
//mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});