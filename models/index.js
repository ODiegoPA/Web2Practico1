const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.hamburguesas = require("./hamburguesa.model.js")(sequelize, Sequelize);
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.resenas = require("./resena.model.js")(sequelize, Sequelize);
db.restaurantes = require("./restaurante.model.js")(sequelize, Sequelize);

db.restaurantes.hasMany(db.hamburguesas, { as: "hamburguesas" });
db.hamburguesas.belongsTo(db.restaurantes, {
    foreignKey: "restauranteId",
    as: "restaurante",
});

db.hamburguesas.belongsToMany(db.usuarios, {
    through: db.resenas,
    as: "usuario",
    foreignKey: "hamburguesaId",
});
db.usuarios.belongsToMany(db.hamburguesas, {
    through: db.resenas,
    as: "hamburguesa",
    foreignKey: "usuarioId",
});

db.resenas.belongsTo(db.hamburguesas, { foreignKey: "hamburguesaId", as: "hamburguesa" });
db.hamburguesas.hasMany(db.resenas, { foreignKey: "hamburguesaId", as: "resenas" });


db.resenas.belongsTo(db.usuarios, { foreignKey: "usuarioId", as: "usuario" });
db.usuarios.hasMany(db.resenas, { foreignKey: "usuarioId", as: "resenas" });


db.usuarios.hasMany(db.restaurantes, { as: "restaurantes" });
db.restaurantes.belongsTo(db.usuarios, {
    foreignKey: "usuarioId",
    as: "usuario",
});

module.exports = db;