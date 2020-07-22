const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static('dist'))
app.all('/*', function (req, res, next) {
  let path = req.path
  console.log(path)
  path = path.replace(/\/$/, '')
  path = './mock' + path + '.json'
  const data = fs.readFileSync(path, 'utf-8')
  console.log(data)
  res.json(JSON.parse(data))
})

app.listen(4000, () => console.log('listening on port 4000'))
