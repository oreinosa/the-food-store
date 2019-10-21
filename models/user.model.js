const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access rights if admin or not 
  role: {
    type: String,
    required: true,
    default: "Customer"
  }
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user, isRegister) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    role: Joi.optional()
  };

  return Joi.validate(user, schema);
}

function generateAuthToken(user){
  // console.log(user);
  return jwt.sign(user, config.get('myprivatekey'), {expiresIn: "1h"});
}

exports.User = User; 
exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;
