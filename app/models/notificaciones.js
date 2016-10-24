var mongoose = require('mongoose');

var NotificaionesSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    type: {type: Number, default: 0},
    id: {type: Number, default: 0},
    timestamp : { type :  Number, default: new Date().getTime() },
    category: String,
    inner_id: {type: Number, default: 0},
    read: Boolean
});

module.exports = mongoose.model('Notificaciones',NotificaionesSchema,'notificaciones');


 
