const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const express = require("express");
const router = express.Router();

router.get('/', auth, isAdmin, async (req,res)=>{
  // query users collection without password
  const users = await User.find().select('-password');
  // return array
  res.json(users);
});

router.get('/:id', auth, isAdmin, async (req,res)=>{
  const { id } = req.params; 
  // check if id is defined
  if(!id) return res.sendStatus(400);
  // query users with id without password
  const user = await User.findById(id).select('-password');
  // return object
  res.json(user);
});

router.post('/', auth, isAdmin, async (req,res)=>{
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
    await user.save();
  }catch{
    res.sendStatus(500);
  }
  res.sendStatus(201); 
});

router.put('/:id', auth, isAdmin, async (req, res)=>{
  const { id } = req.params;
  // const { name, email, role } = req.body;
  if(!id) return res.sendStatus(400);
  user = await User.findByIdAndUpdate(id,req.body, {useFindAndModify: true});
  if(!user) return res.sendStatus(401);
  return res.sendStatus(204);
})

router.delete('/:id', auth, isAdmin, async (req, res)=>{
  const { id } = req.params;
  if(!id) return res.sendStatus(400);
  const user = await User.findByIdAndDelete(id);
  if(!user) return res.sendStatus(402);
  res.sendStatus(204);
});

module.exports = router;