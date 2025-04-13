const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const Order = require('../models/order-model')
const Menu = require('../models/menu-model')
const loggedIn = require('../middlewares/loggedIn')

router.get('/addtoorder/:id', loggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const menuItem = await Menu.findOne({ _id: req.params.id })
    const orderId = user.orders.find((item) => item.status === 'pending')?.id
    const order = await Order.findOne({ _id: orderId })
    if (!order) {
        const addOrder = await Order.create({
            user: user._id,
            menuitems: [{
                id: menuItem._id
            }]
        })
        user.orders.push({ id: addOrder._id, status: 'pending' })
        user.save()
    } else {
        const findedItem = order.menuitems.find((item) => item.id == req.params.id)
        const findedIndex = order.menuitems.findIndex((item) => item.id == req.params.id)
        if (findedItem) {
            order.menuitems[findedIndex].itemcount = order.menuitems[findedIndex].itemcount + 1
        } else {
            order.menuitems.push({ id: menuItem._id })
        }
        order.save()
    }
    res.redirect('/dashboard')
})

router.get('/removefromorder/:id', loggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const order = await Order.findOne({ user: user._id })
    const findedItem = order.menuitems.find((item) => item.id == req.params.id)
    const findedIndex = order.menuitems.findIndex((item) => item.id == req.params.id)
    if (findedItem.itemcount > 1) {
        order.menuitems[findedIndex].itemcount = order.menuitems[findedIndex].itemcount - 1
    } else {
        const filteredItems = order.menuitems.filter(item => item.id != req.params.id)
        order.menuitems = filteredItems
    }
    order.save()
    res.redirect('/orders/yourorder')
})

router.get('/yourorder', loggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    try {
        const orderId = user.orders.find((item) => item.status === 'pending').id
        const order = await Order.findOne({ _id: orderId })
        let userOrderedItem = []
        for (let i = 0; i < order.menuitems.length; i++) {
            let id = order.menuitems[i].id.toString()
            const menuItem = await Menu.findOne({ _id: id })
            userOrderedItem.push({ ...menuItem._doc, itemcount: order.menuitems[i].itemcount })
        }
        res.render('yourorder', { userOrderedItem })
    }catch(err){
        res.redirect('/dashboard')

    }
})
router.get('/confirmorder', loggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const orderIndex = user.orders.findIndex((item) => item.status === 'pending')
    user.orders[orderIndex].status = "completed"
    user.save();
    res.redirect('/dashboard')
})

router.get("/orderhistory", loggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const orders = user.orders
    const orderHistory = []
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i]
        if (order.status === 'completed') {
            let fullOrder = await Order.findOne({ _id: order.id })
            let menuItems = []
            for (let j = 0; j < fullOrder.menuitems.length; j++) {
                let menuItem = fullOrder.menuitems[j]
                const fullItem = await Menu.findOne({ _id: menuItem.id })
                menuItems.push({ menuItem, fullItem })
            }
            orderHistory.push({ fullOrder, menuItems })
        }
    }

    res.render('orderhistory', { orderHistory })
})
module.exports = router