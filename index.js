const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
const db = require("./models");
const session = require('express-session');

db.sequelize.sync({
    //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

app.get('/holamundo', function(req, res) {
    res.send('Hola Mundo');
})

app.use(session({
    secret: 'keyboard cat'
}));

app.use(function (req, res, next) {
    res.locals.usuario = req.session.usuario;
    next();
}); 

require('./routes')(app);

app.listen(3000, function () {
    console.log('Ingrese a http://localhost:3000')
})