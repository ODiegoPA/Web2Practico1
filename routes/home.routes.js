module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/home.controller.js");

    router.get("/", controller.iniciar);
    router.get("/create", controller.createUsuario);
    router.post("/create", controller.insertUsuario);
    router.get("/login", controller.loginUsuario);
    router.post("/login", controller.authUsuario);
    router.get("/logout", controller.logoutUsuario);    
    app.use('/', router);
}