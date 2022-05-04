const { verifyToken } = require("../services/token");

function authorizationMiddlware(req, res, next) {
  const tokenFromClient = req.header("token");
  if (!tokenFromClient) return res.status(401).json("Please Send Token");

  const userInfo = verifyToken(tokenFromClient); //    { _id: user._id, biz: user.biz }
  if (!userInfo) return res.status(401).json("Invalid  Token!");

  req.user = userInfo;

  return next();
}

module.exports = authorizationMiddlware;
