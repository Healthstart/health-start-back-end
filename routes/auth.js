var express = require("express");
var router = express.Router();
const con = require("../db/mysql");

router.post("/register", (req, res) => {
  const insertSQL = `INSERT INTO users(email, password, name) VALUES(?, hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}')), ?)`;
  const checkSQL = `SELECT * FROM users WHERE email=?`;

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.send("not data!");
    return;
  }

  con.query(checkSQL, [email], (err, data) => {
    if (data) {
      res.status(400).send("같은 이메일이 있습니다!");
      return;
    }
    
    con.query(insertSQL, [email, password, name], (err, data) => {
      if (err) throw err;
      console.log("data insert!");
    });
  });
});

module.exports = router;
