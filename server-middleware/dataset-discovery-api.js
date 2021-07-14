
const bodyParser = require('body-parser')
const axios = require('axios')

const app = require('express')()

app.use(bodyParser.json())
app.all('/test', (req, res) => {
  res.json({ data: 'test endpoint found' })
})
app.all('*', (req, res) => {
  res.json({ data: 'catch-all' })
})

module.exports = app
