const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Review = require("../models/review");
const Video = require("../models/video");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const getReviewsByVideoId = async (req, res, next) => {
  const videoId = req.params.vid;
  let reviews;
  try {    
    reviews = await Review.find({ video: videoId });
  } catch (err) {
    const error = new HttpError(
      "La recuperación de reviews falló, intenta de nuevo",
      500
    );
    return next(error);
  }

  if( !reviews || reviews.length === 0){
    return next(
        new HttpError(
          "No se pudo encontrar reviews para el video seleccionado.",
          404
        )
      );
  }
  res.status(200).json({reviews: reviews.map( review => review.toObject({ getters: true}))});
};

const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Entradas invalidas, por favor verifica tus datos.",
      422
    );
    return next(error);
  }
  const videoId = req.params.vid;
  let video;

  try {
    video = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError(
      "La recuperación de video falló, intenta de nuevo",
      500
    );
    return next(error);
  }
  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "La recuperación de usuario falló, intenta de nuevo",
      500
    );
    return next(error);
  }
  if (!video || !user) {
    const error = new HttpError(
      "No se pudo encontrar video/usuario para este Id",
      404
    );
    return next(error);
  }
  const { rating, text } = req.body;
  const createdReview = new Review({
    rating: Number(rating),
    text,
    user: user.id,
    video: video.id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdReview.save({ session: sess });
    user.reviews.push(createdReview);
    video.reviews.push(createdReview);
    await user.save({ session: sess });
    await video.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Algo salió mal, no se pudo crear review", 500);
    return next(error);
  }

  res.status(201).json({ review: createdReview.toObject({ getters: true }) });
};

exports.getReviewsByVideoId = getReviewsByVideoId;
exports.createReview = createReview;