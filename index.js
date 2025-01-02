const express = require('express');
const app = express();
const CFonts= require('cfonts');
const chalk = require('chalk');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require("express-rate-limit");
const passport = require('passport');
const flash = require('connect-flash');
const MemoryStore = require('memorystore')(session);
const compression = require('compression');

const apiRouters = require('./routes/api');
const userRouters = require('./routes/users');

const { isAuthenticated } = require('./lib/auth');
const { connectMongoDb } = require('./database/connect');
const { getApikey } = require('./database/db');
const { port, site_nome } = require('./settings');

const PORT = process.env.PORT || port;

connectMongoDb();

app.set('trust proxy', 1);
app.use(compression())

const limiter = rateLimit({
windowMs: 1 * 60 * 1000, 
max: 2000, 
message: 'Muitos Requisitos.'
});
app.use(limiter);

app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.static('public'));

app.use(session({
secret: 'secret',
resave: true,
saveUninitialized: true,
cookie: { maxAge: 86400000 },
store: new MemoryStore({
checkPeriod: 86400000
}),
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
require('./lib/config')(passport);

app.use(flash());

app.use(function(req, res, next) {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user = req.user || null;
next();
})

app.get('/', (req, res) => {
res.render('index', {
nome_site: site_nome,
layout: 'index'
});
});

app.get('/input', (req, res) => {
res.render('input', {
nome_site: site_nome,
layout: 'input'
});
});

app.get('/docs', isAuthenticated, async (req, res) => { 
let getkey = await getApikey(req.user.id)
let { apikey, username } = getkey
res.render('docs', {
nome_site: site_nome,
username: username,
apikey: apikey,
layout: 'docs'
});
});

app.get('/price', (req, res) => {
res.render('buyFull', {
nome_site: site_nome,
layout: 'buyFull'
})
})

app.get('/premium', (req, res) => {
res.render('buyFull', {
nome_site: site_nome,
layout: 'buyFull'
})
})

app.use('/api', apiRouters);
app.use('/users', userRouters);

app.use(function (req, res, next) {
if (res.statusCode == '200') {
res.render('notfound', {
nome_site: site_nome,
layout: 'notfound'
});
}
});
CFonts.say(site_nome, {
font: 'block',
align: 'center',
gradient: ['red', 'magenta']
})

console.log(chalk.yellow('Conectado ✓'))
app.set('json spaces', 4);

app.listen(PORT, () => {
console.log(`Servidor ligado na porta: http://localhost:${PORT}`);
});
