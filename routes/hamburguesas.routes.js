const {requireUser} = require('../middlewares/requires-user.js');

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/hamburguesa.controller.js");

    router.get('/restaurante/:restaurantId', controller.listHamburguesasPorRestaurante);
    router.get('/create/:restaurantId', requireUser, controller.createHamburguesa);
    router.post('/create/:restaurantId', requireUser, controller.insertHamburguesa);
    router.get('/edit/:id', requireUser, controller.editHamburguesa);
    router.post('/edit/:id', requireUser, controller.updateHamburguesa);
    router.post('/delete/:id', requireUser, controller.deleteHamburguesa);
    app.use('/hamburguesas', router);
}