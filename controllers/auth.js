const jwt = require("../services/jwt");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

function willExpireToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentDate = moment().unix();

  if (currentDate > exp) {
    return true;
  }
  return false;
}

function refreshAccessToken(req, res) {
  const { token } = req.body;
  const { user_id } = jwt.decoded(token);

  User.findOne({ _id: user_id }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      res.status(200).send({
        accessToken: jwt.createAccessToken(userStored),
      });
    }
  });
}

function signUp(req, res) {
  const { name, lastname, email, password } = req.body;
  const user = new User({
    name,
    lastname,
    email: email.toLowerCase(),
    role: "admin",
    active: false,
  });

  if (!email) res.status(400).send({ message: "El email es obligatorio." });
  if (!password)
    res.status(400).send({ message: "La contraseña es obligatoria." });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user.save((err, userStored) => {
    if (err) {
      res.status(400).send({ message: "Error al crear el usuario." });
    } else {
      res.status(200).send({ user: userStored });
    }
  });
}

function signIn(req, res) {
  const { email, password } = req.body;
  if (!email) res.status(400).send({ message: "El correo es obligatorio." });
  if (!password)
    res.status(400).send({ message: "La contrasela es obligatoria." });

  const emailLowerCase = email.toLowerCase();

  User.findOne({ email: emailLowerCase }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      bcrypt.compare(password, userStored.password, (bcryptErr, check) => {
        if (bcryptErr) {
          res.status(500).send({ message: "Error del servidor." });
        } else if (!check) {
          res.status(400).send({ message: "Contraseña incorrecta." });
        } else if (!userStored.active) {
          res
            .status(401)
            .send({ message: "Usuario no autorizado o inactivo." });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStored),
            refresh: jwt.createRefreshToken(userStored),
          });
        }
      });
    }
  });
}

module.exports = {
  refreshAccessToken,
  signUp,
  signIn,
};
