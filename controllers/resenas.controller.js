const db = require("../models");

exports.getResenasByHamburguesaId = function (req, res) {
    const hamburguesaId = req.params.hamburguesaId;

    db.resenas.findAll({
        where: { hamburguesaId },
        include: [
            { model: db.usuarios, as: "usuario" },  
            { model: db.hamburguesas, as: "hamburguesa" }
        ]
    })
    .then(resenas => {
        res.render('resenas/list.ejs', { resenas });
    })
    .catch(error => {
        console.error('Error al obtener las reseñas:', error);
        res.status(500).send('Error al obtener las reseñas');
    });
};
exports.createResena = async function (req, res) {
    const hamburguesaId = req.params.hamburguesaId;
    const usuarioId = res.locals.usuario.id;

    try {
        const existingResena = await db.resenas.findOne({
            where: { hamburguesaId, usuarioId }
        });

        if (existingResena) {
            const hamburguesa = await db.hamburguesas.findOne({
                where: { id: hamburguesaId }
            });
            const restauranteId = hamburguesa.restauranteId;
            const restaurante = await db.restaurantes.findOne({
                where: { id: restauranteId }
            });
            const hamburguesas = await db.hamburguesas.findAll({
                where: { restauranteId },
                include: 'restaurante'
            });

            return res.render('hamburguer-list/list.ejs', { hamburguesas, restaurante, errorMessage: 'Ya has reseñado esa hamburguesa.' });
        }
        res.render('resenas/create.ejs', { hamburguesaId });
        
    } catch (error) {
        console.error('Error al verificar la reseña:', error);
        res.status(500).send('Error al verificar la reseña');
    }
};
exports.insertResena = function (req, res) {    
    const {rating, comentario } = req.body;
    const hamburguesaId = req.params.hamburguesaId;
    const usuarioId = res.locals.usuario.id;

    db.resenas.create({ hamburguesaId, usuarioId, calificacion: rating, comentario })
    .then(()=> {
        res.redirect(`/resenas/hamburguesa/${hamburguesaId}`);
    })
    .catch(error => {
        console.error('Error al insertar la reseña:', error);
        res.status(500).send('Error al insertar la reseña');
    });
}

