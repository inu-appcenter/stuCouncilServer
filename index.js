const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./routes/config/config')

const app = express()
const port = 7003
const db = mongoose.connection
db.on('error',console.error)
db.once('open',function() {
    console.log("db connect")
})

mongoose.connect(config.mongoPath)

const board = require('./routes/board')
const login = require('./routes/login')
const account = require('./routes/account')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

app.use('/board',board)
app.use('/login',login)
app.use('/account',account)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })
  
  app.get('/',(req,res)=> res.send("hello world"))
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error: err
      })
    })
  }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err)
  })

app.listen(port,() => console.log('stuConcilServer is running'))