const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


const port = process.env.PORT || 5000
const monk = require('monk')
const url = process.env.DB_URL || "mongodb://admin:admin@chesterfirstdb-shard-00-00-i7cmi.mongodb.net:27017,chesterfirstdb-shard-00-01-i7cmi.mongodb.net:27017,chesterfirstdb-shard-00-02-i7cmi.mongodb.net:27017/StoreDB?ssl=true&replicaSet=ChesterFirstDB-shard-0&authSource=admin&retryWrites=true"
const db = monk(url)
db.then(() => {
  console.log('connected')
})

const userItems = db.get('Inventory')
const userCart = db.get('Cart')
const users = db.get('Users')
const secret = 'shhh, dont tell anyone!'


app.use(require('./headers'))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('success')
})

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

app.post('/users', (req, res) => {
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
            // let token = jwt.sign(userRedacted, secret)
            // res.cookie("token", token, {
            //   domain: 'localhost',
            //   path: "/",
            //   httpOnly: "false"
            // })
            res.status(200).send(userRedacted)
          })
      })
      .catch(err => {
        console.log(err)
        res.status(401).send("login Failed")
      })
  } else {
    users.findOne({ userName: req.body.userName, password: req.body.password })
      .then(user => {
        let { password, ...userResponse } = user
        res.send(userResponse)
      })
      .catch(err => {
        console.log(err)
        res.send("login Failed")
      })
  }
})

app.listen(port, (err) => {
  if (err) { throw err }
  console.log('Server up and running on port 5000')
})




// let userItems = [
//   {
//     name: 'Fire Place',
//     image: 'https://images-na.ssl-images-amazon.com/images/I/410gOhZjUSL._SY300_QL70_.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'iPad',
//     image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/i/pa/ipad/pro/ipad-pro-12-11-select-201810_FMT_WHH?wid=2000&amp;hei=2000&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1540576009788',
//     price: 3.99,
//   },
//   {
//     name: 'iPhone',
//     image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/select/iphone7-select-2019-family?wid=882&amp;hei=1058&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1550795429263',
//     price: 3.99,
//   },
//   {
//     name: 'Chicken Nuggets',
//     image: 'https://addapinch.com/wp-content/uploads/2011/09/Recipes-Chicken-Nuggets-14-440x600-440x270.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'Apples',
//     image: 'https://www.specialtyproduce.com/sppics/193.png',
//     price: 3.99,
//   },
//   {
//     name: 'Ice Cream',
//     image: 'https://static01.nyt.com/images/2016/05/24/dining/24COOKING-BANANA-ICE-CREAM1/24COOKING-BANANA-ICE-CREAM1-threeByTwoMediumAt2X-v2.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'Soda',
//     image: 'https://cf.ltkcdn.net/best/images/std/182338-425x283-best-selling-sodas.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'Shoes',
//     image: 'https://cdn.shopify.com/s/files/1/1104/4168/products/Allbirds_W_Wool_Runner_Kotare_GREY_ANGLE_0f3bfe63-ac7d-4106-9acf-d26f8414ac53_600x600.png?v=1542064004',
//     price: 3.99,
//   },
//   {
//     name: 'Shirt',
//     image: 'https://static5.cilory.com/288824-large_default/nologo-off-white-red-casual-shirt.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'Coat',
//     image: 'https://cdn.shopify.com/s/files/1/0092/8553/3755/products/product-image-550363401_543x_91801403-ec14-4e18-abe9-e9681fc57cca_394x.jpg?v=1547408378',
//     price: 3.99,
//   },
//   {
//     name: 'Jacket',
//     image: 'https://www.revzilla.com/product_images/0091/7906/scorpion1909_leather_jacket_black_750x750.jpg',
//     price: 3.99,
//   },
//   {
//     name: 'Boots',
//     image: 'https://dsw.scene7.com/is/image/DSWShoes/317277_200_ss_01?$pdp-image$',
//     price: 3.99,
//   },
//   {
//     name: 'Books',
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQae-1m0UIpCeH9Khulq2qfvj0LRj6z1gkv-uosegTavbyKezZeUw',
//     price: 3.99,
//   },
//   {
//     name: 'Jewlery',
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBses_-yvsM5vQiZsWmbI2jqDaVZdQZp17ysUyQrmRFR6R4PmD6w',
//     price: 3.99,
//   },
//   {
//     name: 'Knowledge',
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtLmcBL-Sd8FEHM0DoBRf88iWoOl-urO_spnoAJrLX6X68JIbn-g',
//     price: 3.99,
//   }
// ]
// let userCart = []
//
//
// for (let i in userItems) {
//   userItems[i].id = randomstring.generate(7)
// }