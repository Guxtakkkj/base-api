const mongoose = require('mongoose');
const { dbURI } = require('../settings');

function connectMongoDb() {
mongoose.connect(dbURI, { 
useNewUrlParser: true, 
useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'ALERTA\nSua conexão com o MongoDB falhou!'));
db.once('open', () => {
console.log('NOTICIA\nSua conexão com o MongoDB foi um Sucesso!');
});
};

module.exports.connectMongoDb = connectMongoDb;
