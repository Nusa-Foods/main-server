const express = require("express");
const nusaRouter = express.Router();
const nusaController = require("../controllers/nusaController");

nusaRouter.post("/", nusaController.createNusaHandler);
nusaRouter.get("/", nusaController.getAllNusaHandler);
nusaRouter.get("/:slug", nusaController.getNusaBySlugHandler);
nusaRouter.delete("/:slug", nusaController.deleteNusaHandler);

module.exports = nusaRouter;
