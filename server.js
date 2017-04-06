var express = require('express')
var app = express()

app.get('/:url', function (req, res) {


})

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 3000!')
})