const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

var User = require('./biz.js').User;
var Exercise = require('./biz.js').Exercise;
var getLog = require('./biz.js').getLog;
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//create user
app.post('/api/exercise/new-user', (req, res)=>{
  if(req.body.username){
    User.create({username:req.body.username},(err, data)=>{
      if(err){
        console.log('create user error:', err)
        res.end('create new user fail')
      }else{
        console.log('create user:', data)
        res.json(data)
      }
    })
  }else{
    res.end('username is not given')
  }
})
//add exercise
app.post('/api/exercise/add', (req, res)=>{
  const requestBody = req.body;
  if(!requestBody.userId) return res.end('userId is necessary')
  if(!requestBody.description) return res.end('description is necessary')
  if(!requestBody.duration) return res.end('duration is necessary')
    Exercise.create(requestBody,(err, data)=>{
      if(err){
        console.log('add exercise error:', err)
        res.end('add exercise fail')
      }else{
        console.log('add exercise:', data)
        res.json(data)
      }
    })
})
//query logs
/*/api/exercise/log?{userId}[&from][&to][&limit]
*
* { } = required, [ ] = optional
*
* from, to = dates (yyyy-mm-dd); limit = number
*/
app.get('/api/exercise/log',(req, res)=>{
  // console.log('request params:',req.params.collection)
  // let params = req.params.collection.split('&')
  // console.log(params)
  // let collection = { userId: params[0]}
  // switch(params.length){
  //   case 4:
  //     collection.limit = params[3];
  //   case 3:
  //     collection.to = params[2];
  //   case 2:
  //     collection.from = params[1];
  //   default:
  //     break;
  // }
  console.log('query:',req.query)
  var collection = req.query
  getLog(collection, function(err, data){
    if(err){
      console.log('get log error:', err)
      res.end('get log fail')
    }else{
      res.json(data)
    }
  })
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
