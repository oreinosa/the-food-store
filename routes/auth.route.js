const auth = require("../middleware/auth");
const { User } = require("../models/user.model");
const { register, login } = require("../controllers/auth.controller");
const router = require("express").Router();

router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;