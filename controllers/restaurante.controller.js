const db = require("../models");

exports.listRestaurantes = function (req, res) {
    db.restaurantes.findAll({
        include: 'hamburguesas'
    }).then(restaurantes => {
        res.render('restaurant-list/list.ejs', {restaurantes: restaurantes
        })
    })
}
exports.createRestaurante = function (req, res) {
    res.render('restaurant-list/create.ejs', { restaurante: null });
}

exports.insertRestaurante = function (req, res) {
    const id = res.locals.usuario.id;
    const image = req.files.photo;

    db.restaurantes.create({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        admin_id: id
    }).then(restaurante => {
        // eslint-disable-next-line no-undef
        const path = __dirname + '/../public/images/restaurants/' + restaurante.id + '.jpg';
        
        image.mv(path, function (err) {
            if (err) {
                res.render('personas/uploadProfile.ejs', { errors: { message: 'Error al subir la imagen' }});
                console.log(err);
                return;
            }

            return restaurante.save();
        });
    }).then(() => {
        res.redirect('/');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Error al crear el restaurante');
    });
};

exports.editRestaurante = function (req, res) {
    const restauranteId = req.params.id;

    db.restaurantes.findByPk(restauranteId).then(restaurante => {
        if (!restaurante) {
            return res.status(404).send('Restaurante no encontrado');
        }
        res.render('restaurant-list/edit.ejs', { restaurante });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener el restaurante');
    });
};

exports.updateRestaurante = function (req, res) {
    const restauranteId = req.params.id;
    const { nombre, direccion } = req.body;
    const photo = req.files ? req.files.photo : null;

    db.restaurantes.findByPk(restauranteId).then(restaurante => {
        if (!restaurante) {
            return res.status(404).send('Restaurante no encontrado');
        }
        restaurante.nombre = nombre;
        restaurante.direccion = direccion;
        if (photo) {
            console.log('Pasa por aca')
            // eslint-disable-next-line no-undef
            const path = __dirname + '/../public/images/restaurants/' + restauranteId +  '.jpg';
            photo.mv(path, function (err) {
                if (err) {
                    res.render('personas/uploadProfile.ejs', { errors: { message: 'Error al subir la imagen' }});
                    console.log(err);
                    return;
                }
            });
        } else {
            console.log('No pasa por aca')
        }

        return restaurante.save();
    }).then(() => {
        res.redirect('/restaurantes');
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar el restaurante');
    });
};

exports.deleteRestaurante = function (req, res) {
    const restauranteId = req.params.id;

    db.restaurantes.findByPk(restauranteId).then(restaurante => {
        if (!restaurante) {
            return res.status(404).send('Restaurante no encontrado');
        }

        return restaurante.destroy();
    }).then(() => {
        res.redirect('/restaurantes');
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al eliminar el restaurante');
    });
};
