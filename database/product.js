var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : String,
    description : String,
    price : Number,
    user : String,
    createTime : Number,
    image : String
});

var product = mongoose.model('product',productSchema);

module.exports = product;