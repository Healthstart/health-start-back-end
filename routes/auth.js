var express = require("express");
var router = express.Router();
const con = require("../db/mysql");

router.post("/register", (req, res) => {
  console.log("!!");
  const sql = `INSERT INTO users(email, password, name) VALUES(?, hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}')), ?)`;

  const { email, password, name } = req.body;

  con.query(sql, [email, password, name], (err, res) => {
    if (err) throw err;
    console.log("data insert!");
  });
});

module.exports = router;
