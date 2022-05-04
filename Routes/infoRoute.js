const router = require("express").Router();

let msg = {
  msg: "success",
};
router.get("/info", (req, res) => {
  res.json(msg);
});

module.exports = router;
