const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.header("authentication-token");
  const decoded = jwt.verify(token, "secret");
  console.log(decoded);
  //defined inside payload
  req.user = decoded.user;

  next();
};
