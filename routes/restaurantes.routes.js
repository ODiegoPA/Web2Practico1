const {requireUser} = require('../middlewares/requires-user.js');

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/restaurante.controller.js");

    router.get("/", controller.listRestaurantes);
    router.get("/create", requireUser, controller.createRestaurante);
    router.post("/create", requireUser, controller.insertRestaurante);
    router.get("/edit/:id", requireUser, controller.editRestaurante);
    router.put("/edit/:id", requireUser, controller.updateRestaurante);
    router.post("/:id/delete", requireUser, controller.deleteRestaurante);
    app.use('/restaurantes', router);
}