const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index-routes');
const usersRouter = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
 
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.',404);
  throw error;
});

// error handler
app.use((error, req, res, next) => {
  
  if (res.headersSent) {
      return next(error)
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error ocurred!'})
});

// database conection
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.tmhi8iz.mongodb.net/videos?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database");
    console.log("Server running in port 3001")
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
