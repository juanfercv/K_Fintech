const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyparser = require('body-parser');
const fileUpload = require("express-fileupload");
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql')
const myconnection = require('express-myconnection')
const tiendaRoutes = require('../src/infrastructure/http/router/tienda.router')

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require("../src/config/keys");

const app = express();
require('../src/infrastructure/lib/passport');

const options = {
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    createDatabaseTable: true
};

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'facturacion'
}))

const sessionStore = new MySQLStore(options);


const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../src/infrastructure/http/views/layouts'), 
    partialsDir: path.join(__dirname, '../src/infrastructure/http/views/partials'),
    extname: '.hbs',
    helpers: require('../src/infrastructure/lib/handlebars')
});

/// archivos compartidos
app.set('port', process.env.PORT || 4200);
app.set('views', path.join(__dirname, '../src/infrastructure/http/views'));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
/// archivos compartidos


//midlewars
app.use(fileUpload());
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(bodyparser.json());
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore, //agregamos esta linea
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//midlewars

//varible globales 
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});
//varible globales 

//public
app.use(express.static(path.join(__dirname, '../src/infrastructure/http/public')));
//public 

//routers

//rutas principales
app.use(require("../src/infrastructure/http/router/registro.rutas"))
app.use(require('../src/infrastructure/http/router/index.rutas'))
app.use(require('../src/infrastructure/http/router/principal.router'))
//Registro de la tienda
app.use('/tienda', require('../src/infrastructure/http/router/tienda.router'))
// app.use('/factura', require('./router/factura.router'))
app.use(require('../src/infrastructure/http/router/factura.router'))
// app.get('/factura', (req, res) => {
//     res.render('factura/factura');
// })
 app.get('/formulario', (req, res) => {
    res.render('factura/formulario');
 })
module.exports = app;