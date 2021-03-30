const mongoose = require("mongoose");
let UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  friends: [],
  requests: [],
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});
module.exports = mongoose.model("user", UserSchema);
