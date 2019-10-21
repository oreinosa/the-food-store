const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const { role } = req.user;
  if(role !== "Admin"){
    return res.status(403).send("Access denied.");
  }
  next();
};