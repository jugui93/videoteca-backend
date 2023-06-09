const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRouter = require('./routes/users-routes');
const videosRouter = require('./routes/videos-routes');
const reviewsRouter = require('./routes/reviews-routes');
const commentsRouter = require('./routes/comments-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/videos', videosRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/comments', commentsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new HttpError('No se encuentra esta ruta.',404);
  throw error;
});

// error handler
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err =>{
      console.log(err)
    })
  }
  
  if (res.headersSent) {
      return next(error)
  }

  res.status(error.code || 500);
  res.json({ message: error.message || '¡Ha ocurrido un error desconocido!'})
});

// database conection
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.tmhi8iz.mongodb.net/videos?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectado a base de datos");
    console.log("Servidor corriendo en el puerto 3001")
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
