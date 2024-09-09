const db = require("../models");
const sha1 = require('sha1');

exports.iniciar = function (req, res) {
    db.restaurantes.findAll({
        include: 'hamburguesas'
    }).then(restaurantes => {
        res.render('restaurant-list/list.ejs', {restaurantes: restaurantes
        })
    })
}
exports.createUsuario = async function (req, res) {
    res.render('login/register.ejs', { persona: null, errors: null });
}

exports.insertUsuario = async function (req, res) {
    try {
        const { username, email, password } = req.body;
        let isAdmin = false;
        if (!username || !email || !password) {
            return res.render('login/register.ejs', { 
                persona: null, 
                errors: { message: "Todos los campos son obligatorios" } 
            });
        }

        await db.usuarios.create({ 
            nombre: username,
            email,
            contrasena: sha1(password), 
            isAdmin
        });

        const usuario = await db.usuarios.findOne({
            where: { email, contrasena: sha1(password) }
        });
        req.session.usuario = usuario;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('login/register.ejs', { 
            persona: null, 
            errors: { message: "Error al crear el usuario" } 
        });
    }
}
exports.loginUsuario = async function (req, res) {
    res.render('login/login.ejs', { errors: null });
}
exports.authUsuario = async function (req, res) {
    try {
        const { email, password } = req.body;
        const usuario = await db.usuarios.findOne({
            where: { email, contrasena: sha1(password) }
        });

        if (!usuario) {
            return res.render('login/login.ejs', { errors: { message: "Usuario o contraseña incorrecta" } });
        }

        req.session.usuario = usuario;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('login/login.ejs', { errors: { message: "Error al autenticar el usuario" } });
    }
}
exports.logoutUsuario = async function (req, res) {
    req.session.usuario = null;
    res.redirect('/');
}