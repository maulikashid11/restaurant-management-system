const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    orders: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'order',
            },
            status: String  
        }
    ]
})

module.exports = mongoose.model('user', userSchema)