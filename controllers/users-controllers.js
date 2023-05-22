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
            "El registro falló, por favor intentelo mas tarde.",
            422
          );
          return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
          "No se pudo crear el usuario, el correo electrónico ya existe.",
          422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        const error = new HttpError(
          "No se pudo crear el usuario, intentelo de nuevo.",
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
          "El registro falló, por favor intentelo de nuevo.",
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
        "Error al iniciar sesión, inicia sesión de nuevo.",
        500
      );
      return next(error);
    }

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });

}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Error al iniciar sesión, inténtelo de nuevo más tarde",
        422
      );
      return next(error);
    }

    if (!existingUser ) {
      const error = new HttpError(
        "Credenciales no válidas, no se pudo iniciar sesión",
        403
      );
      return next(error);
    }
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password );
    } catch (err) {
      const error = new HttpError(
        "No se pudo iniciar sesión, por favor verifica tus datos e intenta de nuevo.",
        500
      );
      return next(error);
    }
    
    if ( !isValidPassword){
      const error = new HttpError(
        "Credenciales no válidas, no se pudo iniciar sesión.",
        403
      );
      return next(error);
    }

    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "clave_privada_no_compartir",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "No se pudo iniciar sesión, por favor intenta de nuevo.",
        500
      );
      return next(error);
    }

    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token
    });
}

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
          "Error al recuperar usuarios, inténtelo de nuevo más tarde",
          500
        );
        return next(error);
    }
    
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;