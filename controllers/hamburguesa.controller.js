const db = require("../models");

exports.listHamburguesasPorRestaurante = function (req, res) {
    const restaurantId = req.params.restaurantId; 

    db.hamburguesas.findAll({
        where: { restauranteId: restaurantId },
        include: {
            model: db.restaurantes, 
            as: 'restaurante'      
        }
    }).then(hamburguesas => {
        if (hamburguesas.length > 0) {
            res.render('hamburguer-list/list.ejs', { 
                hamburguesas: hamburguesas, 
                restaurante: hamburguesas[0].restaurante,
            });
        } else {
            db.restaurantes.findByPk(restaurantId).then(restaurante => {
                if (restaurante) {
                    res.render('hamburguer-list/list.ejs', { 
                        hamburguesas: [], 
                        restaurante: restaurante,
                    });
                } else {
                    res.status(404).send('Restaurante no encontrado');
                }
            }).catch(error => {
                console.error(error);
                res.status(500).send('Error al obtener el restaurante');
            });
        }
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener hamburguesas');
    });
};



exports.createHamburguesa = function (req, res) {
    const restaurantId = req.params.restaurantId;
    res.render('hamburguer-list/create.ejs', { restaurantId: restaurantId });
}
exports.insertHamburguesa = function (req, res) {
    const restaurantId = req.params.restaurantId;
    const image = req.files ? req.files.photo : null;

    db.hamburguesas.create({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        foto: null,
        restauranteId: restaurantId
    }).then(hamburguesa => {
        // eslint-disable-next-line no-undef
        const path = __dirname + '/../public/images/hamburguers/' + hamburguesa.id + '.jpg';
        image.mv(path, function (err) {
            if (err) {
                res.render('personas/uploadProfile.ejs', { errors: { message: 'Error al subir la imagen' }});
                console.log(err);
                return;
            }

            return hamburguesa.save();
        });
    }).then(() => {
        res.redirect(`/hamburguesas/restaurante/${restaurantId}`);
    });
}
exports.editHamburguesa = function (req, res) {
    const hamburguesaId = req.params.id;

    db.hamburguesas.findByPk(hamburguesaId).then(hamburguesa => {
        if (!hamburguesa) {
            return res.status(404).send('Hamburguesa no encontrada');
        }
        res.render('hamburguer-list/edit.ejs', { hamburguesa });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener la hamburguesa');
    });
};
exports.updateHamburguesa = function (req, res) {
    const hamburguesaId = req.params.id;
    const { nombre, precio, descripcion } = req.body;
    const photo = req.files ? req.files.photo : null;

    db.hamburguesas.findByPk(hamburguesaId).then(hamburguesa => {
        if (!hamburguesa) {
            return res.status(404).send('Hamburguesa no encontrada');
        }
        hamburguesa.nombre = nombre;
        hamburguesa.precio = precio;
        hamburguesa.descripcion = descripcion;

        if (photo) {
            // eslint-disable-next-line no-undef
            const path = __dirname + '/../public/images/hamburguers/' + hamburguesaId + '.jpg';
            photo.mv(path, function (err) {
                if (err) {
                    return res.render('personas/uploadProfile.ejs', { errors: { message: 'Error al subir la imagen' }});
                }
            });
        }

        return hamburguesa.save();
    }).then(hamburguesa => {
        res.redirect(`/hamburguesas/restaurante/${hamburguesa.restauranteId}`);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la hamburguesa');
    });
};
exports.deleteHamburguesa = function (req, res) {
    const hamburguesaId = req.params.id;
    let idRestaurante;
    db.hamburguesas.findByPk(hamburguesaId).then(hamburguesa => {
        if (!hamburguesa) {
            return res.status(404).send('Hamburguesa no encontrada');
        }
        idRestaurante = hamburguesa.restauranteId;
        return hamburguesa.destroy();
    }).then(() => {
        res.redirect(`/hamburguesas/restaurante/${idRestaurante}`);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al eliminar la hamburguesa');
    });
}
