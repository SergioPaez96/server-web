const jwt = require("../services/jwt");

function asureAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autorización." });
  }

  const token = req.headers.authorization.replace("Bearer", "");

  try {
    const payload = jwt.decoded(token);
    const { exp } = payload;
    const currentData = new Date().getTime();
    if (exp <= currentData) {
      return res.status(400).send({ message: "El token ha expirado." });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(400).send({ message: "Token inválido." });
  }
}

module.exports = {
  asureAuth,
};
