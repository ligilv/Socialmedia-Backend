const app = require("express");
const router = require("express").Router();
const posts = require("../Model/postModel");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");

const authentication = require("../middleware/authenticate");
router.post("/createPost", authentication, async (req, res) => {
  const { postText } = req.body;
  const userID = req.user.id;
  const name = req.user.name;
  const loggedUser = userID;
  const addPost = new posts({
    userID,
    postText,
    name,
    loggedUser,
  });

  const pushpost = await addPost.save();
  const author = await User.findOneAndUpdate(
    { _id: userID },
    {
      $push: { post: pushpost._id },
    }
  );

  await author.save();
  res.send("saved");
});
router.get("/getpost", authentication, async (req, res) => {
  const userID = req.user.id;
  // const allPost = await posts
  //   .find({ userID: userID })
  //   .populate("loggedUser", ["email", "name"]);

  // res.json({ allPost: allPost });
  const user = await User.findById(userID)
    .select("name userName requests")
    .populate("post");
  res.json({ allPost: user });
});
router.get("/getpostbyname/:name", authentication, async (req, res) => {
  try {
    //frnds name
    const fname = req.params.name;
    const name = req.user.name;
    const checkfrnd = await User.find({ name: fname });
    if (fname === name) {
      const post = await posts.find({ name: name });
      res.send(post);
    }
    if (checkfrnd[0].friends.includes(name)) {
      const frndID = checkfrnd[0]._id;
      const frndPost = await posts.find({ userID: frndID });
      res.send(frndPost);
    } else {
      res.json("no he is not");
    }
  } catch (error) {
    res.json(error);
  }
});
router.post("/like/:name", authentication, async (req, res) => {
  try {
    //frnds name
    const fname = req.params.name;
    const name = req.user.name;
    // const checkfrnd = await User.find({ name: fname });
    const post = await posts.findOne({ name: fname });
    if (fname === name) {
      await post.updateOne({
        $addToSet: { likes: name },
      });

      res.json(post.likes.length);
    }
    if (post.likes.includes(name)) {
      res.json(post.likes.length);
    } else {
      const post = await posts.findOne({ name: name });
      await post.update({
        $addToSet: { likes: [name] },
      });
      res.json(post);
    }
    await post.save();
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
