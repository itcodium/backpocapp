var mongoose = require('mongoose');

var NotificaionesSchema = new mongoose.Schema({
   titulo:String,
   categoria: String,
   asunto:String, 
   texto: String
});

module.exports = mongoose.model('Notificaciones',NotificaionesSchema,'notificaciones');



