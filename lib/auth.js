module.exports = {
isAuthenticated: function(req, res, next) {
if (req.isAuthenticated()) {
return next();
}
req.flash('error_msg', 'Por favor, Faça login para continuar!');
res.redirect('/users/login');
},
notAuthenticated: function(req, res, next) {
if (!req.isAuthenticated()) {
return next();
}
res.redirect('/docs');
}
};