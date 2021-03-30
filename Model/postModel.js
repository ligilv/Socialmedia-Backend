const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  postText: {
    type: String,
    require: true,
  },
  likes: [],
});
module.exports = mongoose.model("posts", PostSchema);
