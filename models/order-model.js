const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    menuitems: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'menu',
        },
        itemcount:{
            type:Number,
            default:1
        }
    }
    ],
    date: {
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.model('order', orderSchema)