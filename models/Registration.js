const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');


const registrationSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phonenumber: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    required: true
  }

});
registrationSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
 

module.exports = mongoose.model('Registration', registrationSchema);