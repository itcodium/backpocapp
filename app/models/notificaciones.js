var mongoose = require('mongoose');

var NotificaionesSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    type: {type: Number, default: 0},
    id: {type: Number, default: 0},
    created : { type : Date, default: Date.now },
    category: {type: Number, default: 0},
    inner_id: {type: Number, default: 0},
    read: Boolean
});

module.exports = mongoose.model('Notificaciones',NotificaionesSchema,'notificaciones');



