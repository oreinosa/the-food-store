const { User, validate} = require("../models/user.model");
const bcrypt = require("bcrypt");
exports.getAllUsers = async (req,res)=>{
  // query users collection without password
  const users = await User.find().select('-password');
  // return array
  res.json(users);
};

exports.getUserById = async (req,res)=>{
  const { id } = req.params; 
  // check if id is defined
  if(!id) return res.sendStatus(400);
  // query users with id without password
  try{
    const user = await User.findById(id).select('-password');
    if(!user) return res.sendStatus(404);
    // return object
    res.json(user);
  }catch(err){
    return res.status(500).send(err);
  }
};

exports.createUser = async (req,res)=>{
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, password, email, role } = req.body;
  // find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  // create hashedPassword with bcrypt
  hashedPassword = await bcrypt.hash(password, 10);
  // create new User
  user = new User({
    name,
    password : hashedPassword,
    email,
    role
  });

  try{
    let newUser = await user.save();
    res.sendStatus(201);
  }catch(err){
    if (err.name === 'MongoError' && err.code === 11000) {
      res.sendStatus(409);
    }
    res.status(500).send(err);
  }
};

exports.updateUser = async (req, res)=>{
  const { id } = req.params;
  // const { name, email, role } = req.body;
  if(!id) return res.sendStatus(400);
  try{
    let user = await User.findByIdAndUpdate(id,{$set:req.body}, {useFindAndModify: true});
    if(!user) return res.sendStatus(404);
    res.status(200).json(user);
  }catch (err){
    if (err.name === 'MongoError' && err.code === 11000) {
      res.sendStatus(409);
    }
    res.status(500).send(err);
  }
};

exports.deleteUser = async (req, res)=>{
  const { id } = req.params;
  if(!id) return res.sendStatus(400);
  try {
    const user = await User.findByIdAndDelete(id);
    if(!user) return res.sendStatus(404);
    res.sendStatus(204);
  }catch (err) {
    return res.sendStatus(500);
  }

}