const config = require("config");
const authRoute = require("./routes/auth.route");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/food-store", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json());
//use users route for api/users
app.use("/api/auth", authRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));