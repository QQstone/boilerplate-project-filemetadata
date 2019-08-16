'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
var _fs = require('fs') 
var multer = require('multer')

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.use(multer({dest:process.env.TMPDIR}).array('upfile'))
app.post('/api/fileanalyse',function(req, res){
  console.log(req.files[0])
  var des_file = __dirname + process.env.TMPDIR + '/' + req.files[0].originalname
  _fs.readFile(req.files[0].path, function(err, data){
    _fs.writeFile(des_file, data, function(err){
      var response = {}
      if(err){
        console.log(err)
      }else{
        response={
          message:'file uploaded',
          name:req.files[0].originalname,
          size:req.files[0].size
        }
      }
      console.log(response)
      res.json(response)
    })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
