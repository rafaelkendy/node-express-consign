const express = require('express')
const upload = require('express-fileupload')
const consign = require('consign')
const cors = require('cors')

let app = express()

app.use(upload())
app.use(cors())
app.get('/', (req, res) => res.send('SERVER ON 1.0.0'))

consign()
  .then('utils')
  .then('api')
  .then('routes/auth.js')
  .then('routes')
  .into(app)

module.exports = app
