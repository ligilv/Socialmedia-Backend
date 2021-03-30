const app = require("express");
const router = require("express").Router();
const User = require("../Model/userModel");
const posts = require("../Model/postModel");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { json } = require("express");
const authentication = require("../middleware/authenticate");
router.get("/", authentication, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    return console.log(error);
  }
});
router.get("/all", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});
router.get("/byname/:name", authentication, async (req, res) => {
  try {
    const name = req.user.name;
    const fetchname = req.params.name;

    // const findNameID = await posts
    //   .find({ name: fetchname })
    //   .populate("loggedUser", "name email");

    const findNameID = await User.find({ name: fetchname }).populate("post");
    // const username = await User.find({ userName: fetchname });
    // res.json(user[0].friends);
    res.json(findNameID);
    // if (findNameID.length == 0) {

    //   res.json(findNameID);
    // } else {

    //   res.json(findNameID);
    // }

    // if (user[0].friends.includes(name)) {
    //   res.json({ user: user, isfrnd: "found" });
    // } else {
    //   res.json("not");
    // }
  } catch (error) {
    res.json(error);
  }
});
//SEND FRIEND REQUEST
router.post("/sendrequest", authentication, async (req, res) => {
  const name = req.user.name;
  const fetchname = req.body.friendName;
  const frndId = await User.findOne({ userName: fetchname }).select("_id");
  res.json(frndId);
  const frnd = await User.findOneAndUpdate(
    { _id: frndId },
    {
      $addToSet: { requests: name },
    },
    { useFindAndModify: false }
  );
  await frnd.save();
});

//Accept frnd request move name from request to accept

router.post("/accept", authentication, async (req, res) => {
  try {
    const frndtobe = req.body.frndtobe;
    let user = await User.findById(req.user.id);
    await user.updateOne({
      $pull: { requests: frndtobe },
    });
    await user.updateOne({
      $push: { friends: frndtobe },
    });

    await user.updateOne({
      $push: { friends: frndtobe },
    });
    await user.save();
    let frndsender = await User.findOne({ name: frndtobe });
    await frndsender.updateOne({
      $push: { friends: req.user.name },
    });
    await frndsender.save();
    res.json("new frnd added");
  } catch (error) {
    res.json(error);
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.find({ _id: id }).select("-password");

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});
router.post(
  "/register",
  [
    check("name", "name is emfpty").not().isEmpty(),
    check("lastName", "lastname is fempty").not().isEmpty(),
    check("userName", "username is ffmpty").not().isEmpty(),
    check("email", "email is empty").isEmail(),
    check("password", "6 letters or more").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      let { name, lastName, userName, email, password } = req.body;
      let user = await User.findOne({ email });
      let fetchedUserName = await User.findOne({ userName });
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (user) {
        return res.send("userexists already");
      }
      if (fetchedUserName) {
        return res.send("username already");
      }

      let newUser = new User({
        name,
        lastName,
        userName,
        email,
        password,
      });
      await newUser.save();
      res.json("saved");
      // const payload = {
      //   user: {
      //     id: newUser._id,
      //   },
      // };
      // jwt.sign(payload, "secret", { expiresIn: 36000 }, (err, token) => {
      //   if (err) throw err;
      //   res.json({ token: token, created: true });
      // });
    } catch (error) {
      console.log(error.message);
    }
  }
);
router.post(
  "/login",
  [
    check("email", "email is empty").isEmail(),
    check("password", "6 letters or more").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email });
      let usernpWD = await User.findOne({ email }).select("-password");
      if (user) {
        let fetchPassword = await user.password;
        if (password === fetchPassword) {
          const payload = {
            user: {
              id: user._id,
              name: user.userName,
            },
          };
          jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ logged: true, token, user: usernpWD });
          });
        } else {
          res.json({ logged: false });
        }
      } else {
        res.json({ logged: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);
router.post("/addfriend", authentication, (req, res) => {});
module.exports = router;
