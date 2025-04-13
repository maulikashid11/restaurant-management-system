const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image:String
})

module.exports = mongoose.model('menu', menuSchema)