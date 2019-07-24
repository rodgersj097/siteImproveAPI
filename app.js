
var express = require('express');
var mongoose = require('mongoose')
var app = express();
mongoose.connect(
  'mongodb+srv://siteImprove:BinWsgq06Agzhbym@cluster0-bronw.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true}
)
var db = mongoose.connection;
db.on('error', err=> console.log(err))
db.once('open', () => {
      console.log('Connection to mongodb')
      var issues = require('./api.js')
    })
var api = require('./api')


const port = 3000


app.listen(port, () => console.log('Connected to port 3000'))
