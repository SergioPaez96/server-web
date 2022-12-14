const Menu = require("../models/menu");

async function createMenu(req, res) {
  const menu = new Menu(req.body);

  menu.save((err, menuStored) => {
    if (err) {
      res.status(400).send({ message: "Error al crear el menu." });
    } else {
      res.status(200).send(menuStored);
    }
  });
}

async function getMenus(req, res) {
  const { active } = req.body;

  let response = null;

  if (active === undefined) {
    response = await Menu.find().sort({ order: "asc" });
  } else {
    response = await Menu.find({ active }).sort({ order: "asc" });
  }

  if (!response) {
    res.status(400).send({ message: "No se ha encontrado ningún menu." });
  } else {
    res.status(200).send(response);
  }
}

async function updateMenu(req, res) {
  const { id } = req.params;
  const menuData = req.body;

  Menu.findByIdAndUpdate({ _id: id }, menuData, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al actualizar el menu." });
    } else {
      res.status(200).send({ message: "Menu actualizado correctamente." });
    }
  });
}

async function deleteMenu(req, res) {
  const { id } = req.params;

  Menu.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al eliminar el menu." });
    } else {
      res.status(200).send({ message: "Menu eliminado correctamente." });
    }
  });
}

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};
