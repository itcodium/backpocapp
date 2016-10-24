var mongoose = require('mongoose');

var NotificaionesSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    type: Object,
    id: {type: Number, default: 0},
    timestamp : { type :  Number, default: new Date().getTime() },
    category: Object,
    inner_id: Object,
    read: Boolean
});

module.exports = mongoose.model('Notificaciones',NotificaionesSchema,'notificaciones');


 
