const Newsletter = require("../models/newsletter");

function suscribeEmail(req, res) {
  const { email } = req.body;
  if (!email) res.status(400).send({ message: "El email es obligatorio." });

  const newsletter = new Newsletter({
    email: email.toLowerCase(),
  });

  newsletter.save((err) => {
    if (err) {
      res.status(400).send({ message: "El email ya está existe." });
    } else {
      res.status(200).send({ message: "Email registrado." });
    }
  });
}

function getEmails(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  Newsletter.paginate({}, options, (err, emailsStored) => {
    if (err) {
      res.status(400).send({ message: "Error al obtener los emails." });
    } else {
      res.status(200).send(emailsStored);
    }
  });
}

function deleteEmail(req, res) {
  const { id } = req.params;

  Newsletter.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al eliminar el email." });
    } else {
      res.status(200).send({ message: "Email eliminado." });
    }
  });
}

module.exports = {
  suscribeEmail,
  getEmails,
  deleteEmail,
};
