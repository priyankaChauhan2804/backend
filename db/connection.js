const mongoose = require('mongoose');


let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/?readPreference=primary'
console.log(process.env.MONGO_URL)
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected! to Database'));