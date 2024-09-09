module.exports = app => {
    require('./restaurantes.routes')(app);
    require('./hamburguesas.routes')(app);
    require('./home.routes')(app);
    require('./resenas.routes')(app);
}