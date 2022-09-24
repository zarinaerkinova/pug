const Joi = require('joi')
const { Router } = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')

const users = [{name: "Tom"}]
module.exports = users

router.get('/', (req, res) => {
    // res.status(200).send(users)
    res.render('users', {
        title: 'Users',
        isUsers: true
    })
})

router.get('/user', (req, res) => {
    const user = users.find(val => val.age === +req.query.age)
    res.status(200).send(user)
})

router.get('/:id', (req, res) => {
    const user = users.find(val => val.id === +req.params.id)
    res.status(200).send(user)
})

router.post('/add', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().min(3),
        age: Joi.number().integer().required().min(6).max(100)
    })

    const validation = schema.validate(req.body)

    if (!!validation.error) {
        return res.status(400).send(validation.error.message)
    }

    const data = await new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '..', 'data', 'db.json'),
            'utf-8',
            (err, data) => {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
    })

    const user = {
        name: req.body.name,
        age: req.body.age,
        id: data.length + 1
    }

    data.push(user)

    console.log(data);
    console.log(users);

    await new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, '..', 'data', 'db.json'),
            JSON.stringify(data),
            (err) => {
                if (err) reject(err)
                resolve()
            })
    })

    res.status(201).send('User created')
})

// delete // update
router.delete('/delete/:id', (req, res) => {
    const id = +req.params.id
    const idx = users.findIndex((val, index) => val.id === id)

    if (idx < 0) {
        return res.status(400).send('Id not found')
    }

    users.splice(idx, 1)

    res.status(200).send('User deleted')
})

router.put('/update/:id', (req, res) => {
    const id = +req.params.id
    const idx = users.findIndex((val, index) => val.id === id)

    if (idx < 0) {
        return res.status(400).send('Id not found')
    }

    if (!req.body.name) {
        req.body.name = users[idx].name
    }

    req.body.id = id

    users[idx] = req.body

    res.status(200).send('User updated')
})
module.exports = router