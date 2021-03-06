module.exports = (req, res, next) => {
  res.header('access-control-allow-origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE')
  res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}