const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const hero = require('./routes/hero')
const orders = require('./routes/orders')
const connectToDB = require('./db')
const cookieParser = require('cookie-parser')
dotenv.config()
const port = process.env.PORT || 3000

//connect to database
connectToDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', "ejs")
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.use('/', hero)
app.use('/orders', orders)


app.listen(port)