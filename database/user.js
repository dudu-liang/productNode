var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    password : String
});

var user = mongoose.model('user',userSchema);

module.exports = user;