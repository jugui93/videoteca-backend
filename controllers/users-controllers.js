const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            "Siging up failed, please try again later",
            422
          );
          return next(error);
    }

    if (existingUser) {
        const error = new HttpError('Could not create user, email already exists.', 422)
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        const error = new HttpError(
          "Could no create user, please try again.",
          500
        );
        return next(error);
    }

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      image:
        "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png",
      videos: [],
      reviews: [],
      comments: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
          "Signing up failed, please try again",
          500
        );
        return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "clave_privada_no_compartir",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again",
        500
      );
      return next(error);
    }

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });

}

exports.signup = signup;