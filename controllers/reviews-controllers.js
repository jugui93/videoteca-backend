const Review = require("../models/review");


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

exports.getReviewsByVideoId = getReviewsByVideoId;