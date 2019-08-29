/* eslint-disable no-console */
/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./routes/config/config')

const app = express()
const port = 7004
const db = mongoose.connection
db.on('error',console.error)
db.once('open',function() {
    console.log("db connect")
})



mongoose.connect(config.mongoPath)

const board = require('./routes/board')
const login = require('./routes/login')
const account = require('./routes/account')
/* eslint-disable */
const dirname = __dirname
 
/* eslint-enable */
//app.set('rootDir',__dirname)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())
app.use(require('connect-history-api-fallback')())

app.use('/board',board)
app.use('/login',login)
app.use('/account',account)


app.use(express.static(path.join(dirname,'build')))

app.get('/',(req,res)=> res.sendFile(path.join(dirname,'build','index.html')))

app.get('/download',(req,res)=>{
  let file = dirname+'/file/'+req.query.fileFolder+'/'+req.query.filename
  res.download(file)
})

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })
*/

  // development error handler
  // will print stacktrace
 /* if (app.get('env') === 'development') {
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
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.send(err)
  })
*/
// eslint-disable-next-line no-console
app.listen(port,() => console.log('stuConcilServer is running'))
