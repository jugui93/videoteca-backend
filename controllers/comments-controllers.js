const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Comment = require("../models/comment");
const Video = require("../models/video");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const getCommentsByVideoId = async (req, res, next) => {
  const videoId = req.params.vid;
  let comments;
  try {    
    comments = await Comment.find({ video: videoId });
  } catch (err) {
    const error = new HttpError(
      "La recuperación de comentarios falló, intenta de nuevo",
      500
    );
    return next(error);
  }

  if( !comments || comments.length === 0){
    return next(
        new HttpError(
          "No se pudo encontrar comentarios para el video seleccionado.",
          404
        )
      );
  }
  res.status(200).json({comments: comments.map( comment => comment.toObject({ getters: true}))});
};

const createComment = async (req, res, next) => {
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
  const { text } = req.body;
  const createdComment = new Comment({
    text,
    user: user.id,
    video: video.id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });
    user.comments.push(createdComment);
    video.comments.push(createdComment);
    await user.save({ session: sess });
    await video.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError("Algo salió mal, no se pudo crear comentario", 500);
    return next(error);
  }

  res.status(201).json({ comment: createdComment.toObject({ getters: true }) });
};

exports.getCommentsByVideoId = getCommentsByVideoId;
exports.createComment = createComment;