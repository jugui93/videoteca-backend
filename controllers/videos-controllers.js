const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Video = require("../models/video");
const User = require("../models/user");
const mongoose  = require("mongoose");

mongoose
const upload = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(
      new HttpError("Entradas invalidas, por favor verifica tus datos.", 422)
    );
  }

  const { title, description, public } = req.body;

  const uploadedVideo = new Video({
    title,
    description,
    public: public.toLowerCase() === "true",
    url: req.file.path,
    user: req.userData.userId,
    reviews: [],
    comments: [],
  });
  
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Error al recuperar usuario, inténtelo de nuevo más tarde",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "No se pudo encontrar un usuario con el ID proporcionado.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await uploadedVideo.save({ session: sess });
    user.videos.push(uploadedVideo);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Fallo la subida del video, intenta de nuevo.",
      500
    );
    return next(error);
  }

  res.status(201).json({ video: uploadedVideo.toObject({ getters: true }) });
};

exports.upload = upload;