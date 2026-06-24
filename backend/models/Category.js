const mongoose = require('mongoose');
var categorySchema = mongoose.Schema({
    name: String,
    description: String,
    count: {type:Number, default:0},
    checked: Boolean
})


module.exports = mongoose.model('Category', categorySchema);