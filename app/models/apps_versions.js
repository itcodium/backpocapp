var mongoose = require('mongoose');

var AppVersionSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('AppVersion',AppVersionSchema,'app_version');

 

