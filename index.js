const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const randomstring = require('randomstring')

app.use(bodyParser.json())
app.use(require('./headers'))

let userItems = [
  {
    id: 0,
    name: 'Fire Place',
    image: '/images/FirePlace.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 1,
    name: 'iPad',
    image: '/images/Ipad.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 2,
    name: 'iPhone',
    image: '/images/Iphone.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 3,
    name: 'Chicken Nuggets',
    image: '/images/ChickenNuggets.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 4,
    name: 'Apples',
    image: '/images/Apple.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 5,
    name: 'Ice Cream',
    image: '/images/IceCream.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 6,
    name: 'Soda',
    image: '/images/Soda.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 7,
    name: 'Shoes',
    image: '/images/Shoes.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 8,
    name: 'Shirt',
    image: '/images/Shirt.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 9,
    name: 'Coat',
    image: '/images/Coat.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 10,
    name: 'Jacket',
    image: '/images/Jacket.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 11,
    name: 'Boots',
    image: '/images/Boots.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 12,
    name: 'Books',
    image: '/images/Books.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 13,
    name: 'Jewlery',
    image: '/images/Jewlery.jpg',
    price: 3.99,
    qty: 0
  },
  {
    id: 14,
    name: 'Knowledge',
    image: '/images/Knowledge.jpg',
    price: 3.99,
    qty: 0
  }
]
let userCart = []

app.get('/', (req, res) => {
  res.send('success')
})

app.get('/items', (req, res) => {
  res.send(userItems)
})

app.get('/cart', (req, res) => {
  res.send(userCart)
})

app.post('/cart', (req, res) => {
  let temp = req.body
  temp.id = randomstring.generate(7)
  userCart.push(temp)
  res.send(userCart)
})

app.delete('/cart/:id', (req, res) => {
  userCart = userCart.filter((x) => { return x.id != req.params.id })
  res.send(userCart)
})

app.listen(5000, (err) => {
  if (err) { throw err }
  console.log('Server up and running on port 5000')
})