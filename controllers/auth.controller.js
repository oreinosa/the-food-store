const bcrypt = require("bcrypt");
const { User,  generateAuthToken } = require("../models/user.model");

exports.register = async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, password, email } = req.body;
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
  });

  await user.save();
  res.status(200).send();
};

exports.login = async (req, res) =>{
  const { email, password } = req.body;
  if(!email || !password) res.status(401).send('Please enter an email and password');
  let user = await User.findOne({email});
  if(!user) res.status(401).send('Wrong email or password');
  const flag = await bcrypt.compare(password, user.password);
  if(flag){
    user = user.toJSON();
    const token = generateAuthToken(user);
    res.json({user, token});
  }else{
    res.status(401).send('Wrong email or password');
  }
}