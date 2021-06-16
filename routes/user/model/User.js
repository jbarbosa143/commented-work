const mongoose = require("mongoose");
// creates a User model that can be used for multipule things,but for this instance this is all being used to create a user profile
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
