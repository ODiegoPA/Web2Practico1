module.exports = (sequelize, Sequelize) => {
    const Hamburguesa = sequelize.define("hamburguesa", {
        nombre: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.FLOAT
        },
        descripcion: {
            type: Sequelize.STRING
        },
        foto: {
            type: Sequelize.STRING
        },
        restauranteId: {
            type: Sequelize.INTEGER
        }
    });
    return Hamburguesa;
}