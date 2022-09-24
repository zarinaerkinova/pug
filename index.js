const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')

require('dotenv').config()

app.set('views', './views')
app.set('view engine', 'pug')

// Importing routes
const homeRouter = require('./routes/home')
const usersRouter = require('./routes/users')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
}

// console.log(process.env.PORT);
// console.log(process.env.NODE_ENV);

// custom middleware // cross cutter middleware
app.use(function logger(req, res, next) {
    console.log('logging');
    next()
})

// routes
app.use('/', homeRouter)
app.use('/users', usersRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server working on port ', port);
})