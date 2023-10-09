require('dotenv').config()
const cors = require('cors')
const express = require('express')
const routerUpload = require('./routes/upload')
const { _400 } = require('./lib/http')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true })) // query params

app.get('/', (req, res) => {
  return res.json({
    status: '200 OK',
    msg: 'Welcome to Protofy´s PDF parser service'
  })
})

app.get('/status', (req, res) => {
  return res.json({
    status: '200',
    msg: 'Online'
  })
})

app.use('/upload', routerUpload)

app.use('*', (req, res) => {
  return _400(res, 'Error: Unhandled endpoint')
})

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
