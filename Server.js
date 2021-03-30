const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/Social",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("DBconnected");
  }
);
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./Routes/user"));
app.use("/api/post", require("./Routes/post"));
app.get("/", (req, res) => {
  res.send("hola");
});
app.listen(5000, console.log("listenting to 5000"));
