const express = require('express');
const router = express.Router();
const passport = require('passport');

const { getHashedPassword, randomText } = require('../lib/function');
const { checkUsername, addUser } = require('../database/db');
const { site_nome } = require('../settings');
const { notAuthenticated, captchaLogin, captchaRegister } = require('../lib/auth');

router.get('/', notAuthenticated, (req, res) => {
res.render('login', {
nome_site: site_nome,
layout: 'login'
});
});

router.get('/login', notAuthenticated, (req, res) => {
res.render('login', {
nome_site: site_nome,
layout: 'login'
});
});

router.post('/login', async(req, res, next) => {
passport.authenticate('local', {
successRedirect: '/docs',
failureRedirect: '/users/login',
failureFlash: true,
})(req, res, next);
});

router.get('/register', notAuthenticated, (req, res) => {
res.render('register', {
nome_site: site_nome,
layout: 'register'
});
});

router.post('/register', async (req, res) => {
try {
let {username, password, confirmPassword } = req.body;
if (password.length < 6 || confirmPassword < 6) {
req.flash('error_msg', 'A senha deve ter no mínimo 6 caracteres');
return res.redirect('/users/register');
}
if (password === confirmPassword) {
let checking = await checkUsername(username);
if(checking) {
req.flash('error_msg', 'O nome de usuário já existe nosso sistema');
return res.redirect('/users/register');
} else {
let hashedPassword = getHashedPassword(password);
let apikey = randomText(8);
addUser(username, hashedPassword, apikey);
req.flash('success_msg', 'Sua conta foi Cadastrada com sucesso');
return res.redirect('/users/login');
}
} else {
req.flash('error_msg', 'Senha inválida');
return res.redirect('/users/register');
}
} catch(err) {
console.log(err);
}
})

router.get('/logout', (req,res) => {
req.logout();
req.flash('success_msg', 'Sucesso ao sair');
res.redirect('/users/login');
});

module.exports = router;
