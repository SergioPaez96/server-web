const express = require("express");
const AuthController = require("../controllers/auth");

const api = express.Router();

api.post("/auth/sign-up", AuthController.signUp);
api.post("/auth/sign-in", AuthController.signIn);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

module.exports = api;
