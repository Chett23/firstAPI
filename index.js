const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const monk = require('monk')


const port = process.env.PORT || 5000
const url = process.env.DB_URL
const db = monk(url)
db.then(() => {
  console.log('connected')
})

const userItems = db.get('Inventory')
const userCart = db.get('Cart')
const users = db.get('Users')
const secret = 'shhh, dont tell anyone!'

app.use(express.static('ui_build'))
app.use(require('./headers'))
app.use(bodyParser.json())
app.use(cookieParser())


app.get('/items', (req, res) => {
  userItems.find({})
    .then(results =>
      res.send(results)
    )
    .catch(err =>
      res.send(err)
    )
})

app.post('/items', (req, res) => {
  if (req.body._id) {
    userItems.findOneAndUpdate(req.body._id, req.body).then(result => {
      res.send(result)
    })
  } else {
    userItems.insert(
      req.body
    ).then(result => res.send(result))
  }
})

app.delete('/items/:_id', (req, res) => {
  userItems.findOneAndDelete(req.params._id)
    .then(result => {
      res.send(result)
    })
})

app.get('/cart', (req, res) => {
  userCart.find(req.body)
    .then(results =>
      res.send(results)
    )
})

app.post('/cart', (req, res) => {
  userCart.findOne(req.body._id)
    .then((item) => {
      if (item === null) {
        req.body.qty = 1
        userCart.insert(req.body)
      } else {
        let tempQty = item.qty + 1
        userCart.update({ _id: req.body._id }, { $set: { qty: tempQty } })
      }
    }).then(result => {
      res.send(result)
    })
})

app.delete('/cart/:_id', (req, res) => {
  userCart.findOne(req.params._id)
    .then((item) => {
      if (item.qty === 1) {
        userCart.findOneAndDelete(item._id)
      } else {
        let tempQty = item.qty - 1
        userCart.update({ _id: req.params._id }, { $set: { qty: tempQty } })
      }
    }).then(result => {
      res.send(result)
    })
})

app.post('logout', (req, res) => {

})

app.post('/login', (req, res) => {
  if (req.body.newUser) {
    users.findOne({ userName: req.body.userName })
      .then(credentials => {
        if (credentials === null) {
          users.insert({ userName: req.body.userName, password: req.body.password })
        }
      })
      .then(() => {
        users.findOne({ userName: req.body.userName, password: req.body.password })
          .then(user => {
            let { password, ...userRedacted } = user
            let token = jwt.sign(userRedacted, secret)
            res.cookie("User-Token", token)
            res.status(200).send({ userRedacted, token })
          })
      })
      .catch(err => {
        console.log(err)
        res.status(401).send("login Failed" + err)
      })
  } else {
    users.findOne({ userName: req.body.userName, password: req.body.password })
      .then(user => {
        let { password, ...userResponse } = user
        let token = jwt.sign(userResponse, secret)
        res.cookie("User-Token", token)
        res.status(200).send({ userResponse, token })
      })
      .catch(err => {
        console.log(err)
        res.status(401).send("login Failed" + err)
      })
  }
})

app.listen(port, (err) => {
  if (err) { throw err }
  console.log(`Server up and running on port ${port}`)
})