module.exports = (sequelize, Sequelize) => {
    const Resena = sequelize.define("resena", {
        comentario: {
            type: Sequelize.STRING,
            allowNull: false
        },
        calificacion: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });
    return Resena;
};
