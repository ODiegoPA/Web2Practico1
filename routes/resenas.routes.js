const {requireUser} = require('../middlewares/requires-user.js');
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/resenas.controller.js");

    router.get('/hamburguesa/:hamburguesaId', controller.getResenasByHamburguesaId);
    router.get('/create/:hamburguesaId', requireUser, controller.createResena);
    router.post('/create/:hamburguesaId', requireUser, controller.insertResena);
    app.use('/resenas', router);
}