const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const randomstring = require('randomstring')

app.use(bodyParser.json())
app.use(require('./headers'))

let userItems = [
  {
    name: 'Fire Place',
    image: '/images/FirePlace.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'iPad',
    image: '/images/Ipad.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'iPhone',
    image: '/images/Iphone.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Chicken Nuggets',
    image: '/images/ChickenNuggets.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Apples',
    image: '/images/Apple.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Ice Cream',
    image: '/images/IceCream.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Soda',
    image: '/images/Soda.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Shoes',
    image: '/images/Shoes.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Shirt',
    image: '/images/Shirt.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Coat',
    image: '/images/Coat.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Jacket',
    image: '/images/Jacket.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Boots',
    image: '/images/Boots.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Books',
    image: '/images/Books.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Jewlery',
    image: '/images/Jewlery.jpg',
    price: 3.99,
    qty: 0
  },
  {
    name: 'Knowledge',
    image: '/images/Knowledge.jpg',
    price: 3.99,
    qty: 0
  }
]
let userCart = []
for(let i in userItems){
  userItems[i].id = randomstring.generate(7)
}

app.get('/', (req, res) => {
  res.send('success')
})

app.get('/items', (req, res) => {
  res.send(userItems)
})

app.post('/items', (req, res) => {
  let temp = req.body
  if (req.body.id){
    let tempObj = userItems.find((el) => el.id === req.body.id)
    userItems[userItems.indexOf(tempObj)] = temp
    // console.log('with id: ',req.body.id)
    // console.log(tempObj)
    // console.log(userItems.indexOf(tempObj))
  } else{
    temp.id = randomstring.generate(7)
    userItems.push(temp)
  }
  res.send(userItems)
})

app.delete('/items/:id', (req, res) => {
  userItems = userItems.filter((x) => { return x.id != req.params.id })
  res.send(userItems)
})

app.get('/cart', (req, res) => {
  res.send(userCart)
})

app.post('/cart', (req, res) => {
  userCart.push(req.body)
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