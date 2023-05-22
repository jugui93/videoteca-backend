const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose  = require("mongoose");

const Video = require("../models/video");
const User = require("../models/user");

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
      "Falló la subida del video, intenta de nuevo.",
      500
    );
    return next(error);
  }

  res.status(201).json({ video: uploadedVideo.toObject({ getters: true }) });
};

const getVideoById = async (req, res, next) => {
    const videoId = req.params.vid;

    let video;
    try {
        video = await Video.findById(videoId);
    } catch (err) {
        const error = new HttpError(
          "Algo salió mal, no se pudo encontrar video.",
          500
        );
        return next(error);
    }
    

    if (!video) {
        const error = new HttpError(
          "No se pudo encontrar un video con el ID proporcionado.",
          404
        );
        return next(error);
    }

    res.status(200).json({video: video.toObject( {getters:true})});
};

const getVideosByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithVideos;
    try {
        userWithVideos = await User.findById(userId).populate('videos');
    } catch (err) {
        const error = new HttpError(
          "La recuperación de videos falló, intenta de nuevo",
          500
        );
        return next(error);
    }
    

    if (
      !userWithVideos ||
      userWithVideos.videos.length === 0
    ) {
      return next(
        new HttpError(
          "No se pudo encontrar videos con el ID proporcionado ",
          404
        )
      );
    }

    res.status(200).json({
      videos: userWithVideos.videos.map((place) => place.toObject({ getters: true }))
    });

};

exports.upload = upload;
exports.getVideoById = getVideoById;
exports.getVideosByUserId = getVideosByUserId;