const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const Menu = require('../models/menu-model')
const loggedIn = require('../middlewares/loggedIn')

router.get("/", (req, res) => {
    res.render('home')
})
router.get('/signup', (req, res) => {
    res.render('signup')
})
router.get('/dashboard', loggedIn, async (req, res) => {
    const { email } = req.user
    const user = await User.findOne({ email })
    isPending = user.orders.find((item) => item.status == 'pending')
    const menus = await Menu.find({})
    res.render('dashboard', { isPending, menus })
})
router.post('/signup', async (req, res) => {
    let { name, email, password } = req.body

    const alreadyUser = await User.findOne({ email })
    if (alreadyUser) {
        res.status(500).json({ success: false, message: "User already exists" })
    }
    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const user = await User.create({
                    name,
                    email,
                    password: hash
                })

                let token = jwt.sign({ email: user.email, id: user._id }, 'secret')
                res.cookie('token', token)
                res.redirect('/dashboard')
            })
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

router.get('/login', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/dashboard')
    }
    res.render('login')
})

router.post('/login', async (req, res) => {
    let { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            res.status(500).json({ success: false, message: "Something went wrong!" })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: user.email, id: user._id }, 'secret')
                res.cookie('token', token)
                res.redirect('/dashboard')
            } else {
                res.status(500).json({ success: false, message: "Something went wrong!" })
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get('/logout', loggedIn, (req, res) => {
    res.cookie('token', '')
    res.redirect('/login')
})
module.exports = router