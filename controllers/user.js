const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../services/image");

async function getMe(req, res) {
  const { user_id } = req.user;

  const response = await User.findById(user_id);

  if (!response) {
    res.status(400).send({ message: "No se ha encontrado el usuario." });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await User.find();
  } else {
    response = await User.find({ active });
  }
  res.status(200).send(response);
}

async function createUser(req, res) {
  const { password } = req.body;
  const user = new User({ ...req.body, active: false });

  // ENCRIPTACIÓN DE LA CONTRASEÑA
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  // GUARDAR EL USUARIO EN LA BD
  user.save((err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error al crear usuario." });
    } else {
      res.status(201).send(userStored);
    }
  });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  // ACTUALIZACIÓN DE PASSWORD
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPassword;
  } else {
    delete userData.password;
  }

  // ACTUALIZACIÓN DE AVATAR
  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  }

  User.findByIdAndUpdate({ _id: id }, userData, (err) => {
    if (err) {
      res
        .status(400)
        .send({ message: "Error al actualizar datos del usuario." });
    } else {
      res.status(200).send({ message: "Datos actualizados correctamente." });
    }
  });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al eliminar el usuario." });
    } else {
      res.status(200).send({ message: "Usuario eliminado correctamente." });
    }
  });
}

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
