const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const HttpError = require("../models/http-error");
const User = require("../models/user");


const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Entradas invalidas, por favor verifica tus datos.",
      422
    );
    return next(error);
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
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
    comments: [],
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
};

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

  if (!existingUser) {
    const error = new HttpError(
      "Credenciales no válidas, no se pudo iniciar sesión",
      403
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "No se pudo iniciar sesión, por favor verifica tus datos e intenta de nuevo.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
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
    token: token,
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Error al recuperar usuarios, inténtelo de nuevo más tarde",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId,"-password");
  } catch (err) {
    const error = new HttpError(
      "Algo salío mal, no se pudo encontrar el usuario.",
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

  res.json({ user: user.toObject({ getters: true }) });
};

const updateUserById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Entradas invalidas, por favor verifica tus datos.",
      422
    );
    return next(error);
  }
  const { name, password } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Algo salío mal, no se encontró el usuario.",
      500
    );
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError(
      "No tienes permisos para editar este usuario.",
      401
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    const error = new HttpError(
      "No se pudo cambiar la contraseña, intentelo de nuevo.",
      500
    );
    return next(error);
  }

  user.name = name;
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Algo salío mal, no se pudo actualizar usuario.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    userId: user.id,
    name: user.name,
    message: "Cambio de contraseña exitoso.",
  });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Algo salío mal, no se pudo encontrar el usuario.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "No se pudo encontrar usuario para este id.",
      404
    );
    return next(error);
  }
  if (user.id !== req.userData.userId) {
    const error = new HttpError(
      "No tienes permisos para eliminar este usuario.",
      401
    );
    return next(error);
  }

  try {
    await user.deleteOne();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Algo salío mal, no se pudo eliminar el usuario",
      500
    );
    return next(error);
  }
  res.status(200).json({message: 'Usuario eliminado.'})
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUserById = updateUserById;
exports.deleteUser = deleteUser;