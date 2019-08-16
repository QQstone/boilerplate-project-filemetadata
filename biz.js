const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI)

var UserSchema = mongoose.Schema({
  username:String
})

var User = mongoose.model('User',UserSchema)

var ExerciseSchema = mongoose.Schema({
  userId:String,
  description:String,
  duration:Number,
  date:Date
})

var Exercise = mongoose.model('Exercise',ExerciseSchema)

var createUser = function(username){
  
}

var addExercise = function(userId,description,duration,date){
  
}

var getLog = function(collection,callback){
  let queryCondition = {userId:collection.userId}
  if(collection.from){
    queryCondition.date = (queryCondition.date || {});
    queryCondition.date['$gte'] = collection.from;
  }
  if(collection.to){
    queryCondition.date = (queryCondition.date || {});
    queryCondition.date['$lt'] = collection.to;
  }
  console.log('query conditions:',queryCondition)
  let query = Exercise.find(queryCondition)
  if(collection.limit){
    query = query.sort({'date': -1}).limit(collection.limit)
  }
  query.exec(callback)
}

exports.User = User;
exports.Exercise = Exercise;
exports.getLog = getLog;
