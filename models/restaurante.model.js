module.exports = (sequelize, Sequelize) => {
    const Restaurante = sequelize.define("restaurante", {
        nombre: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        },
        logo :{
            type: Sequelize.STRING
        },
        admin_id:{
            type: Sequelize.INTEGER
        }
    });
    return Restaurante;
}