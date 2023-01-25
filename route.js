var express = require("express");
var router = express.Router();
const path = require("path");

router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/index.html"));
});
router.use("/", express.static(__dirname));

router.get("/moves", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/moves.html"));
});
router.use("/moves", express.static(__dirname));

module.exports = router;
